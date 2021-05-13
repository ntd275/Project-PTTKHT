const knex = require('./database')

exports.getAttendanceList = async () => {
    return await knex.select().table('Attendance')
}

exports.getAttendance = async (attendanceId) => {
    return await knex('Attendance').where('attendanceId', attendanceId).first()
}

exports.deleteAttendance = async (attendanceId) => {
    return await knex('Attendance').where('attendanceId', attendanceId).del()
}

