const express = require('express');
const route = express.Router();
const authRoute = require('./auth');
const configRoute = require('./configuration');

route.use('/auth', authRoute);

route.use('/config', configRoute);

module.exports = route;