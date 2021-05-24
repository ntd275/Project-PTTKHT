const knex = require('./database')

exports.getScoreLockList = async (page, perpage) => {
    return await knex.select().table('ScoreLock').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getScoreLock = async (id) => {
    return await knex('ScoreLock').where('scoreLockId', id).first()
}

exports.lock = async (schoolYearId, term) => {
    return await knex('ScoreLock')
        .where({
            schoolYearId: schoolYearId,
            term: term
        })
        .update('lock', 1)
}

exports.unlock = async (schoolYearId, term) => {
    return await knex('ScoreLock')
        .where({
            schoolYearId: schoolYearId,
            term: term
        })
        .update('lock', 0)
}

exports.createScoreLock = async (data) => {
    return await knex('ScoreLock').insert([
        {
            schoolYearId: data.schoolYearId,
            lock: data.lock,
            term: data.term
        }
    ])
}

exports.deleteScoreLock = async (id) => {
    return await knex('ScoreLock').where('scoreLockId', id).del()
}

