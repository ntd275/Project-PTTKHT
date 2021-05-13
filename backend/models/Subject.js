const knex = require('./database')

exports.getSubjectList = async () => {
    return await knex.select().table('Subject')
}

exports.getSubject = async (subjectId) => {
    return await knex('Subject').where('subjectId', subjectId).first()
}

exports.deleteSubject = async (subjectId) => {
    return await knex('Subject').where('subjectId', subjectId).del()
}

