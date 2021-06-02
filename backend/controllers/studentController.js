const Student = require('../models/Student')
const config = require('../config/config')

async function getStudentList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let studentList = await Student.getStudentList(page, perpage)

        if (studentList.length == 0) {
            return res.status(400).json({
                success: false,
                message: "No student found"
            })
        }

        return res.status(200).json({
            success: true,
            result: studentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getStudent(req, res) {
    try {
        let student = await Student.getStudent(req.params.id)

        if (student === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find student with id = ${req.params.id}`
            })
        }

        return res.status(200).json({
            success: true,
            result: student
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getStudentByCode(req, res) {
    try {
        let student = await Student.getStudentByCode(req.params.code)

        if (student === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find student with code = ${req.params.code}`
            })
        }

        return res.status(200).json({
            success: true,
            result: student
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

/**
 * 
 * @param {*} req req.params.name: Tên giáo viên được encoded
 * @returns list of students
 */
 async function getStudentByName(req, res) {
    try {
        let studentName = decodeURI(req.params.name)
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem

        let students = await Student.getStudentByName(studentName, page, perpage)

        if (students.length == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot find student with name = ${req.params.name}`
            })
        }

        return res.status(200).json({
            success: true,
            result: students
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function searchStudent(req, res) {
    try {
        let query = req.query.query

        let students = await Student.searchStudent(query)

        return res.status(200).json({
            success: true,
            result: students
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createStudent(req, res) {
    try {
        let student = await Student.createStudent(req.body)

        if (student.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot create student"
            })
        }

        return res.status(200).json({
            success: true,
            result: student
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function updateStudent(req, res) {
    try {
        //Get info of current school year that need to be updated
        student = await Student.getStudent(req.params.id)
        //Check exists
        if (student === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find student with id = ${req.params.id}`
            })
        }
        // //Get update info from request
        // student.studentCode = req.body.studentCode || student.studentCode
        // student.studentName = req.body.studentName || student.studentName
        // student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth
        // student.gender = req.body.gender || student.gender
        // student.pId = req.body.pId || student.pId
        // student.image = req.body.image || student.image
        // student.address = req.body.address || student.address
        // student.permanentResidence = req.body.permanentResidence || student.permanentResidence
        // student.email = req.body.email || student.email
        // student.phoneNumber = req.body.phoneNumber || student.phoneNumber
        // student.dateOfParty = req.body.dateOfParty || student.dateOfParty
        // student.dateOfUnion = req.body.dateOfUnion || student.dateOfUnion
        // student.fatherName = req.body.fatherName || student.fatherName
        // student.fatherPhone = req.body.fatherPhone || student.fatherPhone
        // student.fatherMail = req.body.fatherMail || student.fatherMail
        // student.motherName = req.body.motherName || student.motherName
        // student.motherPhone = req.body.motherPhone || student.motherPhone
        // student.motherMail = req.body.motherMail || student.motherMail

        let count = await Student.updateStudent(req.params.id, req.body)
        
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot update student with id = ${req.params.id}`
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

async function deleteStudent(req, res) {
    try {
        //Return number of affected rows
        let count = await Student.deleteStudent(req.params.id)

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot update student with id = ${req.params.id}`
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

module.exports = {
    getStudentList: getStudentList,
    getStudent: getStudent,
    getStudentByCode: getStudentByCode,
    getStudentByName: getStudentByName,
    searchStudent: searchStudent,
    createStudent: createStudent,
    updateStudent: updateStudent,
    deleteStudent: deleteStudent
}