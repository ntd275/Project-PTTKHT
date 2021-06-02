const Account = require('../models/Accounts')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')
const bcrypt = require('bcrypt')
const { json } = require('express')
const { isAuth } = require('../middlewares/authentication')
let nodemailer = require("nodemailer");

let tokenList = {}

exports.checkOtp = async (req, res) => {
    const otpToken = req.body.otpToken
    if (otpToken) {
        try {
            // decode data của user đã mã hóa vào otpToken
            const { data } = await jwtHelper.verifyToken(config.otpToken, config.otpTokenSecret);
            if (data) {
                return res.json({
                    success: true,
                });
            }
        } catch (error) {
            // otp hết hạn
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid OTP",
            });
        }
    } else {
        return res.status(400).send({
            success: false,
            message: 'No otp token provided',
        });
    }
}

exports.forgetPassword = async (req, res) => {
    const otpToken = req.body.otpToken
    if (otpToken) {
        try {
            // decode data của user đã mã hóa vào otpToken
            const { data } = await jwtHelper.verifyToken(config.otpToken, config.otpTokenSecret);
            newPassword = bcrypt.hash(req.body.newPassword, config.saltRounds)
            let count = await Account.updatePassword(data.accountId, req.body.newPassword)
            if (count == 0) {
                return res.status(418).json({
                    success: false,
                    message: "Cannot change password"
                })
            }

            return res.status(200).json({
                success: true,
                result: "password changed"
            })
        } catch (error) {
            // otp hết hạn
            return res.status(400).json({
                success: false,
                message: error.message || 'Some errors occur while changing password',
            });
        }
    } else {
        return res.status(400).send({
            success: false,
            message: 'No otp token provided',
        });
    }
}

exports.sendOtp = async (req, res) => {
    // option của tài khoản gửi email cho người dùng
    console.log(req.body)
    const emailOption = {
        service: config.emailService,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    };
    let transporter = nodemailer.createTransport(emailOption);
    //console.log(transporter)
    try {
        let accountName = req.body.username;
        const account = await Account.getAccountByUsername(accountName);
        if (account == null) {
            return res.status(400).send({
                success: false,
                message: "username does not exist"
            });
        } else {
            transporter.verify(async function (error, success) {
                if (error) {
                    return res.status(500).send({
                        success: false,
                        message: error.message || "Some errors occur while sending email"
                    });
                } else {
                    // let email = "ntd275@gmail.com";
                    if (account.role == 0) {
                        let student = await Student.getStudentByCode(account.userCode)
                        email = student.email
                    } else {
                        let teacher = await Teacher.getTeacherByCode(account.userCode)
                        email = teacher.email
                    }
                    let otp = Math.floor(100000 + Math.random() * 900000);
                    console.log("Email ", email)
                    console.log("OTP ", otp)
                    let mail = {
                        from: config.emailUser,
                        to: email,
                        subject: 'Xác thực tài khoản Hệ thống Sổ liên lạc điện tử Trường THCS ABC',
                        text: 'Mã xác thực của bạn là ' + otp + '. Mã này có hiệu lực trong vòng 3 phút',
                    };
                    transporter.sendMail(mail, async function (error, info) {
                        if (error) {
                            return res.status(500).send({
                                success: false,
                                message: error.message || "Some errors occur while sending email"
                            });
                        } else {
                            account.password = undefined;
                            let userData = account;
                            let otpToken = await jwtHelper.generateToken(userData, config.otpTokenSecret, config.otpTokenLife);
                            return res.json({
                                success: true,
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
            success: false,
            message: error.message || "Some errors occur while sending email"
        });
    }
}

exports.login = async function (req, res) {
    try {
        let user = await Account.getAccountByUsername(req.body.username)
        // console.log(user)
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
    //console.log(refreshTokenFromClient)
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            let decoded = await jwtHelper.verifyToken(refreshTokenFromClient, config.refreshTokenSecret);
            let user = decoded;
            //console.log(user)
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({
                success: true,
                accessToken
            });
        } catch (error) {
            console.log(error)
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