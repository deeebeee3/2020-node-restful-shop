const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {

        //get auth token from header / remove Bearer part
        const token = req.headers.authorization.split(" ")[1];

        //pass token to verify method
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.userData = decoded;

        next();
        
    } catch (err) {
        res.status(401).json({
            message: 'Auth failed'
        });
    }
};