//Controller: Student Attendance
const Attendance = require('../models/Attendance')
const config = require('../config/config')

async function getAttendance(req, res) {
    try {
        let attendances = Attendance.getAttendance(req.query.studentId, req.query.schoolYearId, req.query.term)
        
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

async function attendStudent(req, res) {
    try {
        let attendance = req.body

        if (attendance.attendanceId === null) {
            let result = await Attendance.createAttendance(attendance)

            return res.status(200).json({
                success: true,
                result: result
            })
        }

        let count = await Attendance.updateAttendance(attendance)

        if (count == 0) {
            return res.status(400).json({
                success: false,
                message: "Attendance not found"
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
    getAttendance: getAttendance,
    attendStudent: attendStudent,
}