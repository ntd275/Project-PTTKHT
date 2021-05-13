const knex = require('./database')

exports.getStudentList = async () => {
    return await knex.select().table('Student')
}

exports.getStudent = async (studentId) => {
    return await knex('Student').where('studentId', studentId).first()
}

exports.deleteStudent = async (studentId) => {
    return await knex('Student').where('studentId', studentId).del()
}

