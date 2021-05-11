const Account = require('../models/Accounts')
const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')
const bcrypt = require('bcrypt')
const { json } = require('express')

let tokenList = {}

exports.login = async function (req, res) {
    try {
        let user = await Account.getAccount(req.body.username)
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
        const accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife)
        const refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)
        tokenList[refreshToken] = { accessToken, refreshToken };
        res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });
        return res.status(200).json({
            success: true,
            accessToken,
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
    const refreshTokenFromClient = req.cookies.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            const user = decoded.data;
            const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
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
    // console.log("cookies: ", req.cookies)
    var refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        delete tokenList[refreshToken];
        res.clearCookie('refreshToken');
    }
    res.status(200).json({
        success: true,
    });
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

exports.changePassword = async function (req, res) {
    try {
        let username = req.body.username
        let oldPassword = await bcrypt.hash(req.body.old_password, config.saltRounds) 
        let newPassword = req.body.new_password
        let account = Account.getAccountByUsername(username)
        
        let match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            res.status(401).json({
                success: false,
                message: "Password incorrect"
            })
            return
        }

        let id = await Account.updatePassword(username, newPassword)
        res.status(200),json({
            success: true,
            id: id
        })

    } catch (err) {
        console.log(err)
        res.status(409).send({success: false, error: err})
    }
}

exports.checkAuth = function (req, res) {
    res.json({
        success: true
    })
}