const Account = require('../models/Accounts')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const config = require('../config/config')
const bcrypt = require('bcrypt')
const path = require('path')

async function getAccountList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem

        let accountList = await Account.getAccountList(page, perpage)

        return res.status(200).json({
            success: true,
            result: accountList
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getAccount(req, res) {
    try {
        let account = await Account.getAccount(req.params.id)

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            })
        }

        return res.status(200).json({
            success: true,
            result: account
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getAccountByUsername(req, res) {
    try {
        let accounts = await Account.getAccountsByUsername(req.params.username)

        if (accounts.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            })
        }

        return res.status(200).json({
            success: true,
            result: accounts
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function addAccount(req, res) {
    try {
        let account = req.body
        account.password = await bcrypt.hash(account.password, config.saltRounds)

        let count = await Account.createAccount(req.body)

        return res.status(200).json({
            success: true,
            result: count
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function editAccount(req, res) {
    try {
        //Return number of affected row
        let newPassword = await bcrypt.hash(req.body.password, config.saltRounds)
        req.body.password = newPassword
        console.log(req.body)
        let count = await Account.editAccount(req.params.id, req.body)

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//Only admin can delete account
async function deleteAccount(req, res) {
    try {
        let count = await Account.deleteAccount(req.params.id)
        if (count == 0) {
            return res.status(401).json({
                success: false,
                message: "Account not found"
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function checkPassword(req, res) {
    try {
        let account = await Account.getAccount(req.params.id)
        let match = await bcrypt.compare(req.body.password, account.password)

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Password incorrect"
            })
        }

        return res.status(200).json({
            success: true,
            result: "Password matched"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }

}

async function changePassword(req, res) {
    try {
        let accountId = parseInt(req.params.id)
        let oldPassword = req.body.old_password
        let newPassword = req.body.new_password

        let account = await Account.getAccount(accountId)

        let match = await bcrypt.compare(oldPassword, account.password)
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Password incorrect"
            })
        }

        newPassword = await bcrypt.hash(newPassword, config.saltRounds)
        let count = await Account.updatePassword(accountId, newPassword)
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
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function uploadImage(req, res) {
    try {
        //let userCode = req.params.userCode
        // console.log(req)
        if (req.file == undefined) {
            return res.status(400).json({
                success: false,
                message: "You must upload a file"
            })
        }
        let avatarPath = req.file.path

        // let count = 0;
        // if (userCode[0] == 'H' && userCode[1] == 'S') { //Student
        //     count = await Student.uploadImage(userCode, avatarPath)
        // } else if (userCode[0] == 'G' && userCode[1] == 'V') { //Teacher
        //     count = await Teacher.uploadImage(userCode, avatarPath)
        // }

        return res.status(200).json({
            success: true,
            result: avatarPath
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getImage(req, res) {
    try {
        let userCode = req.params.userCode

        let imageDir = ""
        if (userCode[0] == 'H' && userCode[1] == 'S') { //Student
            imageDir = await Student.getImage(userCode)
        } else if (userCode[0] == 'G' && userCode[1] == 'V') { //Teacher
            imageDir = await Teacher.getImage(userCode)
        }

        if (imageDir.image == undefined) {
            imageDir.image = './public/images/default_avatar.jpg'
        }

        imageDir = path.join(__dirname, '../' + imageDir.image)

        res.status(200).sendFile(imageDir)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

module.exports = {
    getAccountList: getAccountList,
    getAccount: getAccount,
    getAccountByUsername: getAccountByUsername,
    addAccount: addAccount,
    editAccount: editAccount,
    deleteAccount: deleteAccount,
    checkPassword: checkPassword,
    changePassword: changePassword,
    uploadImage: uploadImage,
    getImage: getImage
}