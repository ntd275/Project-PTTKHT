const knex = require('./database')

exports.searchStudentAssignment = async (searchItems, page, perpage) => {
    return knex('StudentAssignment')
        .join('Student', 'StudentAssignment.studentId', 'Student.studentId')
        .join('Class', 'StudentAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'StudentAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('StudentAssignment.studentAssignmentId', 'StudentAssignment.studentId',
            'Student.studentCode', 'Student.studentName', 'Student.dateOfBirth', 'Student.address', 'Student.gender',
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
    return knex('StudentAssignment')
        .join('Student', 'StudentAssignment.studentId', 'Student.studentId')
        .join('Class', 'StudentAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'StudentAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('StudentAssignment.studentAssignmentId', 'StudentAssignment.studentId',
            'Student.studentCode', 'Student.studentName', 'Student.dateOfBirth', 'Student.address', 'Student.gender',
            'StudentAssignment.classId', 'Class.className',
            'StudentAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getStudentAssignment = async (studentAssignmentId) => {
    return knex('StudentAssignment')
        .join('Student', 'StudentAssignment.studentId', 'Student.studentId')
        .join('Class', 'StudentAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'StudentAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('StudentAssignment.studentAssignmentId', 'StudentAssignment.studentId',
            'Student.studentCode', 'Student.studentName', 'Student.dateOfBirth', 'Student.address', 'Student.gender',
            'StudentAssignment.classId', 'Class.className',
            'StudentAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where('StudentAssignmentId', studentAssignmentId).first()
}

exports.deleteStudentAssignment = async (studentAssignmentId) => {
    return knex('StudentAssignment').where('studentAssignmentId', studentAssignmentId).del()
}
exports.createStudentAssignment = async (data) => {
    return knex('StudentAssignment').insert([
        {
            classId: data.classId,
            schoolYearId: data.schoolYearId,
            studentId: data.studentId,
        }
    ])
}
exports.createStudentAssignmentList = async (data) => {
    data = data.map(studentAssignment => {
        return {
            classId: studentAssignment.classId,
            schoolYearId: studentAssignment.schoolYearId,
            studentId: studentAssignment.studentId,
        };
    });
    return knex('StudentAssignment').insert(data)
}
