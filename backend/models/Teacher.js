const knex = require('./database')

exports.getTeacherList = async () => {
    return await knex.select().table('Teacher')
}

exports.getTeacher = async (teacherId) => {
    return await knex('Teacher').where('teacherId', teacherId).first()
}

exports.deleteTeacher = async (teacherId) => {
    return await knex('Teacher').where('teacherId', teacherId).del()
}

