const express = require('express');
const cors = require('cors');
const config = require('config');
const { pgPool } = require('./utils/db.js');
const redisClient = require('./utils/redis.js');
const route = require('./routes/index.js');
const { isCelebrateError } = require('celebrate');

const app = express();
const PORT = config.get('App.Config.Port');

app.use(cors());
app.use(express.json());

(
    async () => {
        try {
            await pgPool.connect();
            console.log('🚀 Database connected');
        } catch (error) {
            console.log(error);
        }
    }
)();

(
    async () => {
        try {
            await redisClient;
        } catch (error) {
            console.log(error);
        }
    }
)();

app.use('/api', route);

app.use((err, req, res, next) => {
    console.log(err);
    if (isCelebrateError(err)) {
        return res.status(400).json({ success: false, message: err.details.get('body').message });
    }
    next();
});

app.use((err, req, res, next) => {
        return res.status(500).json({ success: false, message: 'Server internal error please call the administrator' });
});

app.listen(PORT, () => {
    console.log(`🎉 Server is running on port ${PORT}`);
});