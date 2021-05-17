const Account = require('../models/Accounts')
const config = require('../config/config')
const bcrypt = require('bcrypt')
const { json } = require('express')

async function getAccountList(req, res) {
    try {
        let accountList = await Account.getAccountList()

        if (!accountList) {
            return res.status(400).json({
                success: false,
                message: "Cannot get account list"
            })
        }

        return res.status(200).json({
            success: true,
            account_list: accountList
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function getAccount(req, res) {
    try {
        let account = await Account.getAccount(req.body.accountId)

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "Account does not exist"
            })
        }

        return res.status(200).json({
            success: true,
            account: account
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function editAccount(req, res) {
    try {
        let account = req.body
        let ok = await Account.editAccount(account)

        if (!ok) {
            return res.status(400).json({
                success: false,
                message: "Cannot update account"
            })
        }

        return res.status(200).json({
            success: true,
            account: account
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

//Only admin can delete account
async function deleteAccount(req, res) {
    try {
        let ok = await Account.deleteAccount(req.body.account.accountId)
        if (!ok) {
            return res.status(401).json({
                success: false,
                message: "Cannot delete account"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Account deleted"
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function checkPassword(req, res) {
    try {
        let account = await Account.getAccount(req.body.accountId)
        let match = await bcrypt.compare(req.body.password, account.password)

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Password incorrect"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password matched"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }

}

async function changePassword(req, res) {
    try {
        let username = req.body.username
        let oldPassword = await bcrypt.hash(req.body.old_password, config.saltRounds)
        let newPassword = req.body.new_password
        let account = await Account.getAccountByUsername(username)

        let match = await bcrypt.compare(oldPassword, account.password)
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Password incorrect"
            })
        }

        let id = await Account.updatePassword(username, newPassword)
        if (!id) {
            return res.status(418).json({
                success: false,
                message: "Cannot change password"
            })
        }

        return res.status(200).json({
            success: true,
            message: "password changed"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

module.exports = {
    getAccountList: getAccountList,
    getAccount: getAccount,
    editAccount: editAccount,
    deleteAccount: deleteAccount,
    checkPassword: checkPassword,
    changePassword: changePassword
}