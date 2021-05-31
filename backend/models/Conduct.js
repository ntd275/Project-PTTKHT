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
            term: data.term
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
            term: data.term
        })
}

// exports.deleteConduct = async (conductId) => {
//     return knex('Conduct').where('conductId', conductId).del()
// }

