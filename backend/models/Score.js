const knex = require('./database')

exports.getScoreList = async () => {
    return await knex.select().table('Score')
}

exports.getScore = async (scoreId) => {
    return await knex('Score').where('scoreId', scoreId).first()
}

//Return an array contains all score of a student by subject
//in a school year
exports.getSubjectScore = async (studentId, subjectId, schoolYearId) => {
    return await knex('Score').where({
        studentId: studentId,
        subjectId: subjectId,
        schoolYearId: schoolYearId
    })
}

exports.deleteScore = async (scoreId) => {
    return await knex('Score').where('scoreId', scoreId).del()
}

