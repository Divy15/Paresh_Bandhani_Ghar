const redisClient = require('../utils/redis'); // Adjust relative path based on directory layout
const { generateToken } = require('../helper/jwttoken');
const { pgClient } = require('../utils/db'); // ⚡ Import your central pg utility wrap

// 1. LOGIN CONTROLLER: Verify Mobile, generate OTP, and save state to Redis
const login = async (req, res) => {
    try {
        const { mobileNo } = req.body;

        // ⚡ INVOKE THE POSTGRES FUNCTION: Pass parameters safely using parameterized array alignments
        const queryText = `SELECT get_firstname_by_mobile($1) AS firstname;`;
        const result = await pgClient(queryText, [mobileNo]);

        // Guard against instances where the raw client caught and returned an Error object instance instead of throwing
        if (result instanceof Error) {
            throw result;
        }

        // If the mobile number doesn't match any record inside the database, the function yields NULL
        const firstName = result.rows[0]?.firstname;

        if (!firstName) {
            return res.status(404).json({ success: false, message: 'This mobile number is not registered for admin panel access' });
        }

        // Generate a random, cryptographically simple 6-digit code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save string data layout to Redis under 'otp:mobileNo' key context, expiring in 300 seconds (5 min)
        const redisKey = `otp:${mobileNo}`;
        await redisClient.setEx(redisKey, 300, otpCode);

        // Simulated background notification SMS processing log telemetry target
        console.log(`📱 [SMS SIMULATION] Outgoing OTP for ${mobileNo}: ${otpCode}`);

        return res.status(200).json({
            success: true,
            message: 'You are authorized. Please enter the OTP sent to your registered mobile number.',
            firstName: firstName // Returning the mapped function name output variable cleanly
        });

    } catch (error) {
        console.error('❌ Login Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error processing identity validation' });
    }
};

// 2. VERIFY OTP CONTROLLER: Compare keys across transient state records
const verifyOtp = async (req, res) => {
    try {
        const { mobileNo, otp } = req.body;

        const redisKey = `otp:${mobileNo}`;
        const cachedOtp = await redisClient.get(redisKey);

        if (!cachedOtp) {
            return res.status(401).json({ success: false, message: 'OTP has expired or never existed. Please request a new one.' });
        }

        if (cachedOtp !== otp.toString()) {
            return res.status(401).json({ success: false, message: 'Invalid OTP verification credentials code supplied' });
        }

        // Fetch user data metadata details to generate the claims block payload signature
        const user = await prisma.user.findUnique({
            where: { mobileNo: mobileNo }
        });

        // Delete the verification token key from Redis immediately upon use to prevent replay attacks
        await redisClient.del(redisKey);

        // Build out the dynamic tracking parameters token string
        const tokenClaimsPayload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId
        };

        const generatedJwtToken = generateToken(tokenClaimsPayload);

        return res.status(200).json({
            success: true,
            message: 'OTP verification successful!',
            token: `Bearer ${generatedJwtToken}`
        });

    } catch (error) {
        console.error('❌ Verification Error:', error);
        return res.status(500).json({ success: false, message: 'Internal validation loop failure handling authorization parameters' });
    }
};

module.exports = {
    login,
    verifyOtp
};