const knex = require('./database')
const HomeroomTeacherAssignment = require('./HomeroomTeacherAssignment')

exports.getClassList = async (page, perpage) => {
    return await knex.select().table('Class').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getClass = async (classId) => {
    return await knex('Class').where('classId', classId).first()
}

//Get homeroom class list of a teacher
exports.getHomeroomClass = async(teacherId) => {
    // let subQuery = await knex('HomeroomTeacherAssignment').where('teacherId',teacherId).select('classId')
    // return await knex('Class').where('classId', subQuery)
    return await knex('Class')
        .join('HomeroomTeacherAssignment', 'Class.classId', 'HomeroomTeacherAssignment.classId')
        .select('Class.classId', 'Class.schoolYearId', 'Class.className', 'Class.classCode', 'Class.description')
        .where('HomeroomTeacherAssignment.teacherId', teacherId)
        .first() // 1 giáo viên chỉ chủ nhiệm 1 lớp
}

exports.createClass = async (data) => {
    return await knex('Class').insert([
        {
            schoolYearId : data.schoolYearId,
            classCode : data.classCode,
            className : data.className,
            description : data.description
        }
    ])
}

exports.updateClass = async (id, data) => {
    return await knex('Class')
        .where('classId', id)
        .update({
            schoolYearId : data.schoolYearId,
            classCode : data.classCode,
            className : data.className,
            description : data.description
        })
}

exports.deleteClass = async (classId) => {
    return await knex('Class').where('classId', classId).del()
}

