const knex = require('./database')

exports.getAttendanceList = async () => {
    return knex.select().table('Attendance')
}

exports.getAttendanceById = async (attendanceId) => {
    return knex('Attendance').where('attendanceId', attendanceId).first()
}

exports.getAttendance = async (studentId, schoolYearId, term) => {
    return knex('Attendance').where({
        studentId: studentId,
        schoolYearId: schoolYearId,
        term: term
    })
}

exports.createAttendance = async (data) => {
    return knex('Attendance').insert({

    })
}

exports.updateAttendance = async (attendanceId, data) => {
    return knex('Attendance').where('attendanceId', attendanceId).update({
        
    })
}

exports.deleteAttendance = async (attendanceId) => {
    return knex('Attendance').where('attendanceId', attendanceId).del()
}

