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
        // teacher.schoolYearId = req.body.schoolYearId || teacher.schoolYearId
        // teacher.classCode = req.body.classCode || teacher.classCode
        // teacher.className = req.body.className || teacher.className
        // teacher.description = req.body.description || teacher.description

        let count = await Teacher.updateTeacher(req.params.id, teacher)
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "School year not found"
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