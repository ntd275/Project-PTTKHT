const knex = require('./database')

exports.getScoreList = async () => {
    return knex.select().table('Score')
}

exports.findScore = async (data) => {
    return knex('Score').where({
        studentId: data.studentId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
        schoolYearId: data.schoolYearId,
        kind: data.kind,
        term: data.term
    }).first()
}

//Return an array contains all score of a student by subject in a term of a school year
exports.getSubjectScore = async (studentId, subjectId, schoolYearId, term) => {
    return knex('Score').where({
        studentId: studentId,
        subjectId: subjectId,
        schoolYearId: schoolYearId,
        term: term
    })
}

//Return an array contains all score of a student in a term of a school year
exports.getStudentScore = async (studentId, schoolYearId, term) => {
    return knex('Score').where({
        studentId: studentId,
        schoolYearId: schoolYearId,
        term: term
    })
}

exports.createScore = async (data) => {
    return knex('Score').insert([
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

/**
 * {
    "scoreId": 99,
    "studentId": 1,
    
}
 */
exports.editScore = async (data) => {
    let students = data.students
    

    
}

exports.deleteScore = async (scoreId) => {
    return knex('Score').where('scoreId', scoreId).del()
}

