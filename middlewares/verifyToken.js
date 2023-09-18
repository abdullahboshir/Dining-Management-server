const jwt = require('jsonwebtoken');
const {promisify} = require('util');


exports.verifyToken = async (req, res, next) => {
    try {
        // const token = req.headers.authorization?.split(' ')[1];
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbE9yTnVtYmVyIjoic2FtaXVubm9vcjcxQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk1MDQ0NDMyLCJleHAiOjE2OTUzMDM2MzJ9.TK3eOtdIt-5tUIDrL4NfBv-rORVq_Yii34gujgNFK_c"
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