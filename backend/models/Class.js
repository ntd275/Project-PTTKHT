const knex = require('./database')

exports.getClassList = async () => {
    return await knex.select().table('Class')
}

exports.getClass = async (classId) => {
    return await knex('Class').where('classId', classId).first()
}

exports.deleteClass = async (classId) => {
    return await knex('Class').where('classId', classId).del()
}

