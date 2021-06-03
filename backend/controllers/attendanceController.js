//Controller: Student Attendance
const Attendance = require('../models/Attendance')
const config = require('../config/config')

async function getAttendanceList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let attendances = await Attendance.getAttendanceList(page, perpage)

        return res.status(200).json({
            success: true,
            result: attendances
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getStudentAttendance(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let studentId = parseInt(req.params.id)
        let schoolYearId = parseInt(req.query.schoolYearId)
        let term = parseInt(req.query.term)
        let attendances = await Attendance.getStudentAttendance(studentId, schoolYearId, term, page, perpage)

        if (attendances == null || attendances == {}) {
            return res.status(400).json({
                success: false,
                message: "Attendances not found"
            })
        }

        return res.status(200).json({
            success: true,
            result: attendances
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getClassAttendance(req, res) {
    try {
        let classId = parseInt(req.query.classId)
        let schoolYearId = parseInt(req.query.schoolYearId)
        let term = parseInt(req.query.term)

        let curr = new Date; // get current date
        //Get start and end date of the week from Monday to Sunday
        let firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)).toISOString().slice(0, 10).replace('T', ' ')
        let lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7)).toISOString().slice(0, 10).replace('T', ' ')

        let attendances = await Attendance.getClassAttendance(classId, schoolYearId, term, firstDay, lastDay)

        return res.status(200).json({
            success: true,
            result: attendances
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function attendStudents(req, res) {
    try {
        //Return number of row affected
        let count = await Attendance.updateAttendance(req.body)

        if (count == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot update attendances`
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
    getAttendanceList: getAttendanceList,
    getStudentAttendance: getStudentAttendance,
    getClassAttendance: getClassAttendance,
    attendStudents: attendStudents,
}