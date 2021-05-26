const Teacher = require('../models/Teacher')
const config = require('../config/config')

async function getTeacherList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let myTeacherList = await Teacher.getTeacherList(page, perpage)

        return res.status(200).json({
            success: true,
            result: myTeacherList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function getTeacher(req, res) {
    try {
        let teacher = await Teacher.getTeacher(req.params.id)

        return res.status(200).json({
            success: true,
            result: teacher
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function createTeacher(req, res) {
    try {
        let teacher = await Teacher.createTeacher(req.body)

        return res.status(200).json({
            success: true,
            result: teacher
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function updateTeacher(req, res) {
    try {
        //Get info of current school year that need to be updated
        teacher = await Teacher.getTeacher(req.params.id)
        //Get update info from request
        teacher.teacherCode = req.body.teacherCode || teacher.teacherCode
        teacher.teacherName = req.body.teacherName || teacher.teacherName
        teacher.dateOfBirth = req.body.dateOfBirth || teacher.dateOfBirth
        teacher.gender = req.body.gender || teacher.gender
        teacher.pId = req.body.pId || teacher.pId
        teacher.image = req.body.image || teacher.image
        teacher.address = req.body.address || teacher.address
        teacher.permanentResidence = req.body.permanentResidence || teacher.permanentResidence
        teacher.email = req.body.email || teacher.email
        teacher.phoneNumber = req.body.phoneNumber || teacher.phoneNumber
        teacher.accountName = req.body.accountName || teacher.accountName
        teacher.dateOfParty = req.body.dateOfParty || teacher.dateOfParty
        teacher.dateOfUnion = req.body.dateOfUnion || teacher.dateOfUnion
        teacher.civilServantNumber = req.body.civilServantNumber || teacher.civilServantNumber
        teacher.major = req.body.major || teacher.major

        let count = await Teacher.updateTeacher(req.params.id, teacher)
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
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
            message: err
        })
    }
}

async function deleteTeacher(req, res) {
    try {
        //Return number of affected rows
        let count = await Teacher.deleteTeacher(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
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
            message: err
        })
    }
}

module.exports = {
    getTeacherList: getTeacherList,
    getTeacher: getTeacher,
    createTeacher: createTeacher,
    updateTeacher: updateTeacher,
    deleteTeacher: deleteTeacher
}