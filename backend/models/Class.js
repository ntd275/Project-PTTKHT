const knex = require('./database')
const HomeroomTeacherAssignment = require('./HomeroomTeacherAssignment')

exports.getClassList = async (perpage, page) => {
    return await knex.select().table('Class').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getClass = async (classId) => {
    return await knex('Class').where('classId', classId).first()
}

//Get homeroom class list of a teacher
exports.getHomeroomClass = async(teacherId) => {
    let subQuery = await knex('HomeroomTeacherAssignment').where('teacherId',teacherId).select('classId')
    return await knex('Class').where('classId', subQuery)
}

exports.createClass = async (myClass) => {
    return await knex('Class').insert([
        {
            schoolYearId = myClass.schoolYearId,
            classCode = myClass.classCode,
            className = myClass.className,
            description = myClass.description
        }
    ])
}

exports.updateClass = async (myClass) => {
    return await knex('Subject')
        .where('schoolYearId', schoolYear.schoolYearId)
        .update({
            schoolYearId = myClass.schoolYearId,
            classCode = myClass.classCode,
            className = myClass.className,
            description = myClass.description
        })
}

exports.deleteClass = async (classId) => {
    return await knex('Class').where('classId', classId).del()
}

