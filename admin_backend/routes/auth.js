const express = require('express');
const route = express.Router();
const { celebrate, Segments } = require('celebrate');
const authCtrl = require('../controllers/auth');
const paramValidation = require('../validation/auth');


route.route('/login')
.post(
    celebrate({[Segments.BODY]: paramValidation.login.body}), 
    authCtrl.login
);

route.route('/verify/otp')
.post(
    celebrate({[Segments.BODY]: paramValidation.verifyOtp.body}), 
    authCtrl.verifyOtp
);

module.exports = route;