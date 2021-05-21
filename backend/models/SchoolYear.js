const knex = require('./database')

exports.getSchoolYearList = async (page, perpage) => {
    return await knex.select().table('SchoolYear').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

//Get current school year is that has biggest schoolYearId (added latest)
exports.getSchoolYear = async () => {
    let subQuery = await knex('SchoolYear').max('beginSemester1 as maxDate').first()
    return await knex('SchoolYear').where('beginSemester1', subQuery.maxDate).first()
}

exports.getSchoolYearById = async (schoolYearId) => {
    return await knex('SchoolYear').where('schoolYearId', schoolYearId).first()
}

exports.createSchoolYear = async (schoolYear) => {
    
    let beginSemester1 = await new Date(schoolYear.beginSemester1).toISOString().slice(0,10).replace('T', ' ');
    let endSemester1 = await new Date(schoolYear.endSemester1).toISOString().slice(0,10).replace('T', ' ');
    let beginSemester2 = await new Date(schoolYear.beginSemester2).toISOString().slice(0,10).replace('T', ' ');
    let endSemester2 = await new Date(schoolYear.endSemester2).toISOString().slice(0,10).replace('T', ' ');

    return await knex('SchoolYear').insert([
        {
            schoolYear: schoolYear.schoolYear, 
            beginSemester1: beginSemester1,
            endSemester1: endSemester1,
            beginSemester2: beginSemester2,
            endSemester2: endSemester2,
            description: schoolYear.description
        }
    ])
}

exports.updateSchoolYear = async (id, data) => {
    return await knex('SchoolYear')
        .where('schoolYearId', id)
        .update({
            schoolYear: data.schoolYear,
            beginSemester1: new Date(schoolYear.beginSemester1).toISOString().slice(0,10).replace('T', ' '),
            endSemester1: new Date(schoolYear.endSemester1).toISOString().slice(0,10).replace('T', ' '),
            beginSemester2: new Date(schoolYear.beginSemester2).toISOString().slice(0,10).replace('T', ' '),
            endSemester2: new Date(schoolYear.endSemester2).toISOString().slice(0,10).replace('T', ' '),
            description: data.description
        })
}

exports.deleteSchoolYear = async (schoolYearId) => {
    return await knex('SchoolYear').where('schoolYearId', schoolYearId).del()
}

