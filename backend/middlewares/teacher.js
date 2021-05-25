const jwtHelper = require('../Helpers/jwtToken')
const config = require('../Config/config')
const accessTokenSecret = config.accessTokenSecret

exports.isTeacher = async(req, res, next) => {
    const tokenFromClient = req.body.token || req.headers["x-access-token"];
    if (tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            
            if (decoded.role == 1) {
                req.jwtDecoded = decoded;
                next();
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Not teacher'
                });
            }

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }
    } else {
        return res.status(403).json({
            success: false,
            message: "No token provided"
        })
    }
}