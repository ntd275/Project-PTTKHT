const Account = require('../models/Accounts')
const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')
const bcrypt = require('bcrypt')
const { json } = require('express')
const { isAuth } = require('../middlewares/authentication')

let tokenList = {}

exports.forgetPassword = async (req, res) => {
    // frontend nhận được otp, thấy người dùng nhập đúng otp thì gửi otpToken và newPassword lên
    const otpToken = req.body.otpToken
    if (otpToken) {
        try {
            // decode data của user đã mã hóa vào otpToken
            const { data } = await jwtHelper.verifyToken(config.otpToken, config.otpTokenSecret);
            bcrypt.hash(req.body.newPassword, config.saltRounds, function (err, hash) {
                if (err) {
                    return res.status(500).send({
                        status: 0,
                        message:
                            err.message || "Some errors occur while changing password"
                    });
                }
                db.accounts.update({
                    password: hash,
                }, {
                    where: { username: data.username },
                    returning: true,
                    plain: true
                })
                .then(function () {
                    return res.json({
                        status: 1,
                    });
                });
            });
        } catch (error) {
            return res.status(400).json({
                status: 0,
                message: error.message || 'Some errors occur while changing password',
            });
        }
    } else {
        return res.status(400).send({
            status: 0,
            message: 'No otp token provided',
        });
    }
}

exports.sendOtp = async (req, res) => {
    // option của tài khoản gửi email cho người dùng
    const emailOption = {
        service: config.emailService,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    };
    let transporter = nodemailer.createTransport(emailOption);
    try {
        // người dùng nhập username hoặc email vào 1 ô, 
        // frontend gửi lên 2 trường username và email có nội dung giống nhau
        const user = await db.accounts.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            }
        });
        if (user == null) {
            return res.status(400).send({
                status: 0,
                message: "user does not exist"
            });
        } else {
            transporter.verify(function(error, success) {
                if (error) {
                    return res.status(500).send({
                        status: 0,
                        message: error.message || "Some errors occur while sending email"
                    });
                } else {
                    let otp = Math.floor(100000 + Math.random() * 900000);
                    let mail = {
                        from: config.emailUser,
                        to: user.email, 
                        subject: 'Xác thực tài khoản Room4U',
                        text: 'Mã xác thực của bạn là ' + otp + '. Mã này có hiệu lực trong vòng 3 phút',
                    };
                    transporter.sendMail(mail, async function(error, info) {
                        if (error) {
                            return res.status(500).send({
                                status: 0,
                                message: error.message || "Some errors occur while sending email"
                            });
                        } else {
                            user.password = undefined;
                            let userData = user;
                            let otpToken = await jwtHelper.generateToken(userData, config.otpTokenSecret, config.otpTokenLife);
                            return res.json({
                                status: 1,
                                otp: otp,
                                otpToken: otpToken
                            });
                        }
                    });
                }
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: error.message || "Some errors occur while sending email"
        });
    }
}

exports.login = async function (req, res) {
    try {
        let user = await Account.getAccountByUsername(req.body.username)

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Username or password incorrect"
            })
            return
        }

        let match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            res.status(401).json({
                success: false,
                message: "Username or password incorrect"
            })
            return
        }

        let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife)
        let refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)
        tokenList[refreshToken] = { accessToken, refreshToken };
        res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });
        return res.status(200).json({
            success: true,
            accessToken,
            id: user.accountId,
            userCode: user.userCode
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            err,
        });
    }
}

exports.refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    let refreshTokenFromClient = req.cookies.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            let decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            let user = decoded.data;
            let accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({
                success: true,
                accessToken
            });
        } catch (error) {
            delete tokenList[refreshTokenFromClient];
            res.status(403).json({
                success: false,
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            success: false,
            message: 'No token provided.',
        });
    }
};

exports.logOut = function (req, res) {
    var refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        delete tokenList[refreshToken];
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true
        })

    } else {
        res.status(403).json({
            success: false
        })
    }

}

// exports.register = async function (req, res) {
//     try {
//         console.log(config.saltRounds)
//         console.log(req.body.password)
//         req.body.password = await bcrypt.hash(req.body.password, config.saltRounds)
//         let id = await Account.createAccount(req.body)
//         console.log(id)
//         res.status(200).json({
//             success: true,
//             id: id,
//         })
//     } catch (err) {
//         console.log(err)
//         res.status(409).send({ success: false, error: err })
//     }
// }

exports.checkAuth = function (req, res) {
    res.json({
        success: true
    })
}