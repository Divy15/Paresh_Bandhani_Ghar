const { Joi } = require('celebrate');

module.exports = {
    login: {
        body: Joi.object({
            mobileNo: Joi.string().min(10).max(10).messages({
                "string.min": "Please enter a valid 10-digit mobile number",
                "string.max": "Please enter a valid 10-digit mobile number",
                "any.required": "Please enter a valid 10-digit mobile number"
            }).required()
        })
    },
    verifyOtp: {
        body: Joi.object({
            mobileNo: Joi.string().min(10).max(10).messages({
                "string.min": "Please enter a valid 10-digit mobile number",
                "string.max": "Please enter a valid 10-digit mobile number",
                "any.required": "Please enter a valid 10-digit mobile number"
            }).required(),
            otp: Joi.string().min(6).max(6).messages({
                "string.min": "Please enter a valid 6-digit OTP code",
                "string.max": "Please enter a valid 6-digit OTP code",
                "any.required": "Please enter a valid 6-digit OTP code"
            }).required()
        })
    }
}