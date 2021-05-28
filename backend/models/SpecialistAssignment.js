const knex = require('./database')

exports.searchSpecialistAssignment = async (searchItems, page, perpage) => {
    return await knex('SpecialistAssignment')
        .join('Teacher', 'SpecialistAssignment.teacherId', 'Teacher.teacherId')
        .join('SpecialistTeam', 'SpecialistAssignment.specialistTeamId', 'SpecialistTeam.specialistTeamId')
        .join('SchoolYear', 'SpecialistAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('SpecialistAssignment.specialistAssignmentId',
            'SpecialistAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'SpecialistAssignment.specialistTeamId', 'SpecialistTeam.specialistName',
            'SpecialistAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where((qb) => {
            if (searchItems.schoolYearId) {
                qb.where('TeachingAssignment.schoolYearId', searchItems.schoolYearId);
            }
            if (searchItems.teacherId) {
                qb.where('Teacher.teacherId', searchItems.teacherId);
            }
            if (searchItems.specialistTeamId) {
                qb.where('SpecialistTeam.specialistTeamId', searchItems.specialistTeamId);
            }
        }).paginate({ perPage: perpage, currentPage: page, isLengthAware: true }); Ï
}

exports.getSpecialistAssignmentList = async (page, perpage) => {
    return await knex('SpecialistAssignment')
        .join('Teacher', 'SpecialistAssignment.teacherId', 'Teacher.teacherId')
        .join('SpecialistTeam', 'SpecialistAssignment.specialistTeamId', 'SpecialistTeam.specialistTeamId')
        .join('SchoolYear', 'SpecialistAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('SpecialistAssignment.specialistAssignmentId',
            'SpecialistAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'SpecialistAssignment.specialistTeamId', 'SpecialistTeam.specialistName',
            'SpecialistAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getSpecialistAssignment = async (specialistAssignmentId) => {
    return await knex('SpecialistAssignment')
        .join('Teacher', 'SpecialistAssignment.teacherId', 'Teacher.teacherId')
        .join('SpecialistTeam', 'SpecialistAssignment.specialistTeamId', 'SpecialistTeam.specialistTeamId')
        .join('SchoolYear', 'SpecialistAssignment.schoolYearId', 'SchoolYear.schoolYearId')
        .select('SpecialistAssignment.specialistAssignmentId',
            'SpecialistAssignment.teacherId', 'Teacher.teacherCode', 'Teacher.teacherName',
            'SpecialistAssignment.specialistTeamId', 'SpecialistTeam.specialistName',
            'SpecialistAssignment.schoolYearId', 'SchoolYear.schoolYear',
        ).where('SpecialistAssignmentId', specialistAssignmentId).first()
}

exports.deleteSpecialistAssignment = async (specialistAssignmentId) => {
    return await knex('SpecialistAssignment').where('specialistAssignmentId', specialistAssignmentId).del()
}
exports.createSpecialistAssignment = async (data) => {
    return await knex('SpecialistAssignment').insert([
        {
            teacherId: data.teacherId,
            schoolYearId: data.schoolYearId,
            specialistTeamId: data.specialistTeamId,
        }
    ])
}
