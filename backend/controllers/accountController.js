const Account = require('../models/Accounts')
const config = require('../config/config')
const bcrypt = require('bcrypt')
const { json } = require('express')

async function getAccountList(req, res) {
    try {
        let page = req.query.page || 1
        let perpage = req.query.perpage || 30
        let accountList = await Account.getAccountList(page, perpage)

        return res.status(200).json({
            success: true,
            result: accountList
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
        let account = await Account.getAccount(req.params.accountId)

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
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function editAccount(req, res) {
    try {
        //Return number of affected row
        let count = await Account.editAccount(req.params.accountId, req.body)

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
        let count = await Account.deleteAccount(req.params.accountId)
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
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function checkPassword(req, res) {
    try {
        let account = await Account.getAccount(req.params.accountId)
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
            message: err
        })
    }

}

async function changePassword(req, res) {
    try {
        let accountId = req.params.accountId
        let oldPassword = await bcrypt.hash(req.body.old_password, config.saltRounds)
        let newPassword = req.body.new_password

        let account = await Account.getAccount(accountId)

        let match = await bcrypt.compare(oldPassword, account.password)
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Password incorrect"
            })
        }

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