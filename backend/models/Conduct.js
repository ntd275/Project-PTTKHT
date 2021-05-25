const knex = require('./database')

// exports.getConductList = async () => {
//     return await knex.select().table('Conduct')
// }

// exports.getConductById = async (conductId) => {
//     return await knex('Conduct').where('conductId', conductId).first()
// }

exports.getConduct = async (studentId, schoolYearId, term) => {
    return await knex('Conduct').where({
        studentId: studentId,
        schoolYearId: schoolYearId,
        term: term
    }).first()
}

exports.createConduct = async (data) => {
    return await knex('Conduct').insert([
        {
            studentId: data.studentId,
            classId: data.classId,
            teacherId: data.teacherId,
            schoolYearId: data.schoolYearId,
            conduct: data.conduct,
            term: data.term
        }
    ])
}

exports.updateConduct = async (data) => {
    return await knex('Conduct')
        .where('conductId', data.conductId)
        .update({
            studentId: data.studentId,
            classId: data.classId,
            teacherId: data.teacherId,
            schoolYearId: data.schoolYearId,
            conduct: data.conduct,
            term: data.term
        })
}

// exports.deleteConduct = async (conductId) => {
//     return await knex('Conduct').where('conductId', conductId).del()
// }

