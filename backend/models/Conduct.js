/**
 * Student conduct type:
 * 0: Tốt
 * 1: Khá
 * 2: Trung bình
 * 3: Kém
 */
const knex = require('./database')

// exports.getConductList = async () => {
//     return knex.select().table('Conduct')
// }

// exports.getConductById = async (conductId) => {
//     return knex('Conduct').where('conductId', conductId).first()
// }

exports.getConduct = async (studentId, schoolYearId, term) => {
    return knex('Conduct').where({
        studentId: studentId,
        schoolYearId: schoolYearId,
        term: term
    }).first()
}

exports.createConduct = async (data) => {
    return knex('Conduct').insert([
        {
            studentId: data.studentId,
            classId: data.classId,
            teacherId: data.teacherId,
            schoolYearId: data.schoolYearId,
            conduct: data.conduct,
            term: data.term,
            note: data.note
        }
    ])
}

exports.updateConduct = async (data) => {
    return knex('Conduct')
        .where('conductId', data.conductId)
        .update({
            studentId: data.studentId,
            classId: data.classId,
            teacherId: data.teacherId,
            schoolYearId: data.schoolYearId,
            conduct: data.conduct,
            term: data.term,
            note: data.note
        })
}

// exports.deleteConduct = async (conductId) => {
//     return knex('Conduct').where('conductId', conductId).del()
// }

