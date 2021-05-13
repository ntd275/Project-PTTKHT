const knex = require('./database')

exports.getScoreLockList = async () => {
    return await knex.select().table('ScoreLock')
}

exports.getScoreLock = async (scoreLockId) => {
    return await knex('ScoreLock').where('scoreLockId', scoreLockId).first()
}

exports.deleteScoreLock = async (scoreLockId) => {
    return await knex('ScoreLock').where('scoreLockId', scoreLockId).del()
}

