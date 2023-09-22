module.exports = authorization = (...role) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if(!role.includes(userRole)){
            return res.status(403).json({
                status: 'fail',
                error: 'Your are not authorization to access this route'
            });
        }

        next()
    }
};