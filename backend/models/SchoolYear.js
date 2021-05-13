const knex = require('./database')

exports.getSchoolYearList = async () => {
    return await knex.select().table('SchoolYear')
}

exports.getSchoolYear = async (schoolYearId) => {
    return await knex('SchoolYear').where('schoolYearId', schoolYearId).first()
}

exports.deleteSchoolYear = async (schoolYearId) => {
    return await knex('SchoolYear').where('schoolYearId', schoolYearId).del()
}

