const knex = require('./database')

exports.searchTeachingAssignment = async (searchItems, page, perpage) => {
    return knex('TeachingAssignment')
        .join('Teacher', 'TeachingAssignment.teacherId', 'Teacher.teacherId')
        .join('Class', 'TeachingAssignment.classId', 'Class.classId')
        .join('Subject', 'TeachingAssignment.subjectId', 'Subject.subjectId')
        .join('SchoolYear', 'TeachingAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('TeachingAssignment.teachingAssignmentId',
            'TeachingAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'TeachingAssignment.classId', 'Class.className',
            'TeachingAssignment.subjectId', 'Subject.subjectName',
            'TeachingAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where((qb) => {
            if (searchItems.schoolYearId) {
                qb.where('TeachingAssignment.schoolYearId', searchItems.schoolYearId);
            }
            if (searchItems.teacherId) {
                qb.where('Teacher.teacherId', searchItems.teacherId);
            }
            if (searchItems.classId) {
                qb.where('Class.classId', searchItems.classId);
            }
            if (searchItems.subjectId) {
                qb.where('Subject.subjectId', searchItems.subjectId);
            }
        }).paginate({ perPage: perpage, currentPage: page, isLengthAware: true }); Ï
}

exports.getTeachingAssignmentList = async (page, perpage) => {
    return knex('TeachingAssignment')
        .join('Teacher', 'TeachingAssignment.teacherId', 'Teacher.teacherId')
        .join('Class', 'TeachingAssignment.classId', 'Class.classId')
        .join('Subject', 'TeachingAssignment.subjectId', 'Subject.subjectId')
        .join('SchoolYear', 'TeachingAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('TeachingAssignment.teachingAssignmentId',
            'TeachingAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'TeachingAssignment.classId', 'Class.className',
            'TeachingAssignment.subjectId', 'Subject.subjectName',
            'TeachingAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getTeachingAssignment = async (teachingAssignmentId) => {
    return knex('TeachingAssignment')
        .join('Teacher', 'TeachingAssignment.teacherId', 'Teacher.teacherId')
        .join('Class', 'TeachingAssignment.classId', 'Class.classId')
        .join('Subject', 'TeachingAssignment.subjectId', 'Subject.subjectId')
        .join('SchoolYear', 'TeachingAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('TeachingAssignment.teachingAssignmentId',
            'TeachingAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'TeachingAssignment.classId', 'Class.className',
            'TeachingAssignment.subjectId', 'Subject.subjectName',
            'TeachingAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where('teachingAssignmentId', teachingAssignmentId).first()
}

exports.deleteTeachingAssignment = async (teachingAssignmentId) => {
    return knex('TeachingAssignment').where('teachingAssignmentId', teachingAssignmentId).del()
}
exports.createTeachingAssignment = async (data) => {
    return knex('TeachingAssignment').insert([
        {
            teacherId: data.teacherId,
            classId: data.classId,
            schoolYearId: data.schoolYearId,
            subjectId: data.subjectId,
        }
    ])
}
