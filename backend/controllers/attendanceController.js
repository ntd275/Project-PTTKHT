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
        let attendances = await Attendance.getStudentAttendance(req.params.studentId, req.query.schoolYearId, req.query.term)

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
        var curr = new Date; // get current date
        var firstD = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var lastD = first + 6; // last day is the first day + 6
        //Convert to Date
        var firstDay = new Date(curr.setDate(firstD)).toISOString().slice(0, 10).replace('T', ' ')
        var lastDay = new Date(curr.setDate(lastD)).toISOString().slice(0, 10).replace('T', ' ')

        let attendances = Attendance.getClassAttendance(req.query.classId, req.query.schoolYearId, req.query.term, firstDay, lastDay)

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