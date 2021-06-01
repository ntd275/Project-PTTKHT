const knex = require('./database')
const HomeroomTeacherAssignment = require('./HomeroomTeacherAssignment')

exports.getClassList = async (page, perpage) => {
    return knex.select().table('Class').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getClass = async (classId) => {
    return knex('Class').where('classId', classId).first()
}

//Get homeroom class list of a teacher
exports.getHomeroomClass = async (teacherId) => {
    // let subQuery = knex('HomeroomTeacherAssignment').where('teacherId',teacherId).select('classId')
    // return knex('Class').where('classId', subQuery)
    return knex('Class')
        .join('HomeroomTeacherAssignment', 'Class.classId', 'HomeroomTeacherAssignment.classId')
        .select('Class.classId', 'Class.className', 'Class.classCode', 'Class.description')
        .where('HomeroomTeacherAssignment.teacherId', teacherId)
        .first() // 1 giáo viên chỉ chủ nhiệm 1 lớp
}

exports.getClassByName = async (className, page, perpage) => {
    return knex('Class').where('className', 'like', `%${className}%`).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.createClass = async (data) => {
    return knex('Class').insert([
        {
            classCode: data.classCode,
            className: data.className,
            description: data.description
        }
    ])
}

exports.updateClass = async (id, data) => {
    return knex('Class')
        .where('classId', id)
        .update({
            classCode: data.classCode,
            className: data.className,
            description: data.description
        })
}

exports.deleteClass = async (classId) => {
    return knex('Class').where('classId', classId).del()
}

