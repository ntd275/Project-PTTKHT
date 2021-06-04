const knex = require('./database')

exports.getScoreLockList = async (page, perpage) => {
    return knex.select().table('ScoreLock').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getScoreLockById = async (id) => {
    return knex('ScoreLock').where('lock_Id', id).first()
}

exports.getScoreLockBySchoolYear = async (schoolYearId) => {
    return knex('ScoreLock').where({
        schoolYearId: schoolYearId,
        term: term
    }).first()
}

exports.getScoreLock = async (schoolYearId, term) => {
    return knex('ScoreLock').where({
        schoolYearId: schoolYearId,
        term: term
    }).first()
}

exports.lock = async (schoolYearId, term) => {
    return knex('ScoreLock')
        .where({
            schoolYearId: schoolYearId,
            term: term
        }).update('lock', 1)
}

exports.unlock = async (schoolYearId, term) => {
    return knex('ScoreLock')
        .where({
            schoolYearId: schoolYearId,
            term: term
        })
        .update('lock', 0)
}

exports.createScoreLock = async (data) => {
    return knex('ScoreLock').insert([
        {
            schoolYearId: data.schoolYearId,
            lock: data.lock,
            term: data.term
        }
    ])
}

exports.deleteScoreLock = async (id) => {
    return knex('ScoreLock').where('scoreLockId', id).del()
}

