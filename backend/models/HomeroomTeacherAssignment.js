const knex = require('./database')

exports.updateHomeroomTeacherAssignment = async (id, data) => {
    return knex('HomeroomTeacherAssignment')
        .where('homeroomTeacherAssignmentId', id)
        .update({
            teacherId: data.teacherId,
        })
}

exports.searchHomeroomTeacherAssignment = async (searchItems, page, perpage) => {
    return knex('HomeroomTeacherAssignment')
        .join('Teacher', 'HomeroomTeacherAssignment.teacherId', 'Teacher.teacherId')
        .join('Class', 'HomeroomTeacherAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'HomeroomTeacherAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('HomeroomTeacherAssignment.homeroomTeacherAssignmentId',
            'HomeroomTeacherAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'HomeroomTeacherAssignment.classId', 'Class.className',
            'HomeroomTeacherAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where((qb) => {
            if (searchItems.schoolYearId) {
                qb.where('SchoolYear.schoolYearId', searchItems.schoolYearId);
            }
            if (searchItems.teacherId) {
                qb.where('Teacher.teacherId', searchItems.teacherId);
            }
            if (searchItems.classId) {
                qb.where('Class.classId', searchItems.classId);
            }
        }).paginate({ perPage: perpage, currentPage: page, isLengthAware: true }); Ï
}

exports.getHomeroomTeacherAssignmentList = async (page, perpage) => {
    return knex('HomeroomTeacherAssignment')
        .join('Teacher', 'HomeroomTeacherAssignment.teacherId', 'Teacher.teacherId')
        .join('Class', 'HomeroomTeacherAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'HomeroomTeacherAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('HomeroomTeacherAssignment.homeroomTeacherAssignmentId',
            'HomeroomTeacherAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'HomeroomTeacherAssignment.classId', 'Class.className',
            'HomeroomTeacherAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getHomeroomTeacherAssignment = async (homeroomTeacherAssignmentId) => {
    return knex('HomeroomTeacherAssignment')
        .join('Teacher', 'HomeroomTeacherAssignment.teacherId', 'Teacher.teacherId')
        .join('Class', 'HomeroomTeacherAssignment.classId', 'Class.classId')
        .join('SchoolYear', 'HomeroomTeacherAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('HomeroomTeacherAssignment.homeroomTeacherAssignmentId',
            'HomeroomTeacherAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'HomeroomTeacherAssignment.classId', 'Class.className',
            'HomeroomTeacherAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where('HomeroomTeacherAssignmentId', homeroomTeacherAssignmentId).first()
}

exports.deleteHomeroomTeacherAssignment = async (homeroomTeacherAssignmentId) => {
    return knex('HomeroomTeacherAssignment').where('homeroomTeacherAssignmentId', homeroomTeacherAssignmentId).del()
}
exports.createHomeroomTeacherAssignment = async (data) => {
    return knex('HomeroomTeacherAssignment').insert([
        {
            teacherId: data.teacherId,
            schoolYearId: data.schoolYearId,
            classId: data.classId,
        }
    ])
}
