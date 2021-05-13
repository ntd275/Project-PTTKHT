const knex = require('./database')

exports.getScoreList = async () => {
    return await knex.select().table('Score')
}

exports.getScore = async (scoreId) => {
    return await knex('Score').where('scoreId', scoreId).first()
}

exports.deleteScore = async (scoreId) => {
    return await knex('Score').where('scoreId', scoreId).del()
}

