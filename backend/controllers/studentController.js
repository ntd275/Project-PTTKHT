const Student = require('../models/Student')
const config = require('../config/config')

async function getStudentList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let studentList = await Student.getStudentList(page, perpage)

        return res.status(200).json({
            success: true,
            result: studentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function getStudent(req, res) {
    try {
        let student = await Student.getStudent(req.params.id)

        return res.status(200).json({
            success: true,
            result: student
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function createStudent(req, res) {
    try {
        let student = await Student.createStudent(req.body)

        return res.status(200).json({
            success: true,
            result: student
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function updateStudent(req, res) {
    try {
        //Get info of current school year that need to be updated
        student = await Student.getStudent(req.params.id)
        //Get update info from request
        student.studentCode = req.body.studentCode || student.studentCode
        student.studentName = req.body.studentName || student.studentName
        student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth
        student.gender = req.body.gender || student.gender
        student.pId = req.body.pId || student.pId
        student.image = req.body.image || student.image
        student.address = req.body.address || student.address
        student.permanentResidence = req.body.permanentResidence || student.permanentResidence
        student.email = req.body.email || student.email
        student.phoneNumber = req.body.phoneNumber || student.phoneNumber
        student.accountName = req.body.accountName || student.accountName
        student.dateOfParty = req.body.dateOfParty || student.dateOfParty
        student.dateOfUnion = req.body.dateOfUnion || student.dateOfUnion
        student.fatherName = req.body.fatherName || student.fatherName
        student.fatherPhone = req.body.fatherPhone || student.fatherPhone
        student.fatherMail = req.body.fatherMail || student.fatherMail
        student.motherName = req.body.motherName || student.motherName
        student.motherPhone = req.body.motherPhone || student.motherPhone
        student.motherMail = req.body.motherMail || student.motherMail

        let count = await Student.updateStudent(req.params.id, student)
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
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

async function deleteStudent(req, res) {
    try {
        //Return number of affected rows
        let count = await Student.deleteStudent(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
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
    getStudentList: getStudentList,
    getStudent: getStudent,
    createStudent: createStudent,
    updateStudent: updateStudent,
    deleteStudent: deleteStudent
}