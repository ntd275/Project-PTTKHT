const knex = require('./database')

exports.searchStudentAssignment = async (searchItems, page, perpage) => {
    return await knex('StudentAssignment')
        .join('Student', 'StudentAssignment.studentId', 'Student.studentId')
        .join('Class', 'StudentAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'StudentAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('StudentAssignment.studentAssignmentId',
            'StudentAssignment.studentId', 'Student.studentName', 'Student.dateOfBirth', 'Student.address',
            'StudentAssignment.classId', 'Class.className',
            'StudentAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where((qb) => {
            if (searchItems.schoolYearId) {
                qb.where('StudentAssignment.schoolYearId', searchItems.schoolYearId);
            }
            if (searchItems.classId) {
                qb.where('Class.classId', searchItems.classId);
            }
            if (searchItems.studentId) {
                qb.where('Student.studentId', searchItems.studentId);
            }
        }).paginate({ perPage: perpage, currentPage: page, isLengthAware: true }); Ï
}

exports.getStudentAssignmentList = async (page, perpage) => {
    return await knex('StudentAssignment')
        .join('Student', 'StudentAssignment.studentId', 'Student.studentId')
        .join('Class', 'StudentAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'StudentAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('StudentAssignment.studentAssignmentId',
            'StudentAssignment.studentId', 'Student.studentName', 'Student.dateOfBirth', 'Student.address',
            'StudentAssignment.classId', 'Class.className',
            'StudentAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getStudentAssignment = async (studentAssignmentId) => {
    return await knex('StudentAssignment')
        .join('Student', 'StudentAssignment.studentId', 'Student.studentId')
        .join('Class', 'StudentAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'StudentAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('StudentAssignment.studentAssignmentId',
            'StudentAssignment.studentId', 'Student.studentName', 'Student.dateOfBirth', 'Student.address',
            'StudentAssignment.classId', 'Class.className',
            'StudentAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where('StudentAssignmentId', studentAssignmentId).first()
}

exports.deleteStudentAssignment = async (studentAssignmentId) => {
    return await knex('StudentAssignment').where('studentAssignmentId', studentAssignmentId).del()
}
exports.createStudentAssignment = async (data) => {
    return await knex('StudentAssignment').insert([
        {
            classId: data.classId,
            schoolYearId: data.schoolYearId,
            studentId: data.studentId,
        }
    ])
}
