const jwtHelper = require('../Helpers/jwtToken')
const config = require('../Config/config')
const debug = console.log.bind(console);
const accessTokenSecret = config.accessTokenSecret

exports.isAdmin = async(req, res, next) => {
    const tokenFromClient = req.body.token || req.headers["x-access-token"];
    if (tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            
            if (decoded.role == 2) {
                req.jwtDecoded = decoded;
                next();
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Not admin'
                });
            }

        } catch (error) {
            return res.status(403).json({
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