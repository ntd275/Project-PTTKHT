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

exports.getClassConduct = async (teacherId, schoolYearId, term) => {
    return knex('Conduct')
        .join('StudentAssignment', 'Conduct.studentId', 'StudentAssignment.studentId')
        .join('HomeroomTeacherAssignment', 'StudentAssignment.classId', 'HomeroomTeacherAssignment.classId')
        .join('Class', 'Class.classId', 'HomeroomTeacherAssignment.classId')
        .join('Student', 'Student.studentId', 'Conduct.studentId')
        .select('Conduct.conductId', 'Class.className', 'Conduct.studentId',
            'Student.studentCode', 'Student.studentName', 'Student.dateOfBirth', 'Student.address', 'Student.gender',
            'Conduct.conduct', 'Conduct.note'
        ).where({
            "HomeroomTeacherAssignment.teacherId": teacherId,
            "Conduct.schoolYearId": schoolYearId,
            "Conduct.term": term
        })
}

exports.createConduct = async (data) => {
    return knex('Conduct').insert({
        studentId: data.studentId,
        classId: data.classId,
        teacherId: data.teacherId,
        schoolYearId: data.schoolYearId,
        conduct: data.conduct,
        term: data.term,
        note: data.note
    })
}

/** Only update these fields:
 * teacherId: who assesses sutdent's conduct
 * conduct: student's conduct
 * note: note/comment of teacher for student
 */
exports.updateConduct = async (data) => {
    return knex('Conduct')
        .where((builder) => {
            if (data.conductId) {
                builder.where({
                    conductId: data.conductId,
                    studentId: data.studentId,
                    schoolYearId: data.schoolYearId,
                    term: data.term
                })
            } else {
                builder.where({
                    studentId: data.studentId,
                    schoolYearId: data.schoolYearId,
                    term: data.term
                })
            }
        })
        .update({
            teacherId: data.teacherId,
            conduct: data.conduct,
            note: data.note
        })
}

// exports.deleteConduct = async (conductId) => {
//     return knex('Conduct').where('conductId', conductId).del()
// }

