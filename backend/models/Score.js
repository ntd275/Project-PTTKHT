const knex = require('./database')

exports.getScoreList = async () => {
    return await knex.select().table('Score')
}

exports.getScoreById = async (scoreId) => {
    return await knex('Score').where('scoreId', scoreId).first()
}

//Return an array contains all score of a student by subject in a term of a school year
exports.getSubjectScore = async (studentId, subjectId, schoolYearId, term) => {
    return await knex('Score').where({
        studentId: studentId,
        subjectId: subjectId,
        schoolYearId: schoolYearId,
        term: term
    })
}

//Return an array contains all score of a student in a term of a school year
exports.getStudentScore = async (studentId, schoolYearId, term) => {
    return await knex('Score').where({
        studentId: studentId,
        schoolYearId: schoolYearId,
        term: term
    })
}

exports.createScore = async (data) => {
    return await knex('Score').insert([
        {
            studentId: data.studentId,
            teacherId: data.teacherId,
            subjectId: data.subjectId,
            schoolYearId: data.schoolYearId,
            kind: data.kind,
            score: data.score,
            term: data.term
        }
    ])
}

exports.editScore = async (data) => {
    return await knex('Score').where('scoreId', data.scoreId)
        .update({
            studentId: data.studentId,
            teacherId: data.teacherId,
            subjectId: data.subjectId,
            schoolYearId: data.schoolYearId,
            kind: data.kind,
            score: data.score,
            term: data.term
        })
}

exports.deleteScore = async (scoreId) => {
    return await knex('Score').where('scoreId', scoreId).del()
}

