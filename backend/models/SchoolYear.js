const knex = require('./database')

exports.getSchoolYearList = async (perpage, page) => {
    return await knex.select().table('SchoolYear').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

//Get current school year is that has biggest schoolYearId (added latest)
exports.getSchoolYear = async () => {
    let subQuery = await knex('SchoolYear').max('beginSemester1')
    return await knex('SchoolYear').where('beginSemester1', subQuery).first()
}

exports.getSchoolYearById = async (schoolYearId) => {
    return await knex('SchoolYear').where('schoolYearId', schoolYearId).first()
}

exports.createSchoolYear = async (schoolYear) => {
    
    return await knex('SchoolYear').insert([
        {
            schoolYear: schoolYear.schoolYear, 
            beginSemester1: new Date(schoolYear.beginSemester1).toISOString.slice(0,10).replace('T', ' '),
            endSemester1: new Date(schoolYear.endSemester1).toISOString.slice(0,10).replace('T', ' '),
            beginSemester2: new Date(schoolYear.beginSemester2).toISOString.slice(0,10).replace('T', ' '),
            endSemester2: new Date(schoolYear.endSemester2).toISOString.slice(0,10).replace('T', ' '),
            description: schoolYear.description
        }
    ])
}

exports.updateSchoolYear = async (id, data) => {
    return await knex('SchoolYear')
        .where('schoolYearId', id)
        .update({
            schoolYear: data.schoolYear,
            beginSemester1: new Date(schoolYear.beginSemester1).toISOString.slice(0,10).replace('T', ' '),
            endSemester1: new Date(schoolYear.endSemester1).toISOString.slice(0,10).replace('T', ' '),
            beginSemester2: new Date(schoolYear.beginSemester2).toISOString.slice(0,10).replace('T', ' '),
            endSemester2: new Date(schoolYear.endSemester2).toISOString.slice(0,10).replace('T', ' '),
            description: data.description
        })
}

exports.deleteSchoolYear = async (schoolYearId) => {
    return await knex('SchoolYear').where('schoolYearId', schoolYearId).del()
}

