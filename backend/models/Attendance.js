const knex = require('./database')

exports.getAttendanceList = async () => {
    return await knex.select().table('Attendance')
}

exports.getAttendanceById = async (attendanceId) => {
    return await knex('Attendance').where('attendanceId', attendanceId).first()
}

exports.getAttendance = async (studentId, schoolYearId, term) => {
    return await knex('Attendance').where({
        studentId: studentId,
        schoolYearId: schoolYearId,
        term: term
    })
}

exports.createAttendance = async (data) => {
    return await knex('Attendance').insert({

    })
}

exports.updateAttendance = async (attendanceId, data) => {
    return await knex('Attendance').where('attendanceId', attendanceId).update({
        
    })
}

exports.deleteAttendance = async (attendanceId) => {
    return await knex('Attendance').where('attendanceId', attendanceId).del()
}

