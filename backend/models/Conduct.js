const knex = require('./database')

exports.getConductList = async () => {
    return await knex.select().table('Conduct')
}

exports.getConduct = async (conductId) => {
    return await knex('Conduct').where('conductId', conductId).first()
}

exports.deleteConduct = async (conductId) => {
    return await knex('Conduct').where('conductId', conductId).del()
}

