const jwt = require('jsonwebtoken');

exports.tokenGenerate = user => {
    const payload = {
        emailOrNumber: user.emailOrPhoneNumber,
        role: user.role
    }
    const token =  jwt.sign(payload, process.env.ACCESS_TOKEN, {
        expiresIn: '1h'
    });

    return token;
};