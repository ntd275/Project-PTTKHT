const { Knex } = require('knex')
const knex = require('./database')

exports.getSchoolYearList = async (page, perpage) => {
    return knex.select().table('SchoolYear').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

//Get current school year is that has biggest schoolYearId (added latest)
exports.getSchoolYear = async () => {
    // let subQuery = knex('SchoolYear').max('beginSemester1 as maxDate').first()
    // return knex('SchoolYear').where('beginSemester1', subQuery.maxDate).first()
    let thisDate = await new Date().toISOString().slice(0, 10).replace('T', '')
    return knex('SchoolYear').where(function () {
        this.where('beginSemester1', '<=', thisDate)
            .andWhere('endSemester1', '>=', thisDate)
    }).orWhere(function () {
        this.where('beginSemester2', '<=', thisDate)
            .andWhere('endSemester2', '>=', thisDate)
    })
}

exports.getSchoolYearById = async (schoolYearId) => {
    return knex('SchoolYear').where('schoolYearId', schoolYearId).first()
}

exports.createSchoolYear = async (schoolYear) => {

    let beginSemester1 = await new Date(schoolYear.beginSemester1).toISOString().slice(0, 10).replace('T', ' ');
    let endSemester1 = await new Date(schoolYear.endSemester1).toISOString().slice(0, 10).replace('T', ' ');
    let beginSemester2 = await new Date(schoolYear.beginSemester2).toISOString().slice(0, 10).replace('T', ' ');
    let endSemester2 = await new Date(schoolYear.endSemester2).toISOString().slice(0, 10).replace('T', ' ');

    return knex('SchoolYear').insert([
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
    return knex('SchoolYear')
        .where('schoolYearId', id)
        .update({
            schoolYear: data.schoolYear,
            beginSemester1: new Date(schoolYear.beginSemester1).toISOString().slice(0, 10).replace('T', ' '),
            endSemester1: new Date(schoolYear.endSemester1).toISOString().slice(0, 10).replace('T', ' '),
            beginSemester2: new Date(schoolYear.beginSemester2).toISOString().slice(0, 10).replace('T', ' '),
            endSemester2: new Date(schoolYear.endSemester2).toISOString().slice(0, 10).replace('T', ' '),
            description: data.description
        })
}

exports.deleteSchoolYear = async (schoolYearId) => {
    // return knex('SchoolYear').where('schoolYearId', schoolYearId).del()

    let count = 0
    await knex.transaction(async trx => {
        try {
            count = await trx.from('ScoreLock').where('schoolYearId', schoolYearId).del()

            // if (!count) {
            //     return Promise.reject({
            //         'success': false,
            //         'message': 'deleteSchoolYear: cannot delete ScoreLock'
            //     })
            // }

            count = await trx.from('SchoolYear').where('schoolYearId', schoolYearId).del()

            // if (!count) {
            //     return Promise.reject({
            //         'success': false,
            //         'message': 'deleteSchoolYear: cannot delete ScoreLock'
            //     })
            // }
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    })

    return count
}

