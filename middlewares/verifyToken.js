const jwt = require('jsonwebtoken');
const {promisify} = require('util');


exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({
            status: 'Failed',
            error: 'You are not logged in' 
        })
    };

    const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
     
    next()
    } catch (error) {
        res.status(403).json({
            status: 'fail',
            error: 'Ínvalid token'
          })      
    }
};