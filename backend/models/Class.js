const knex = require('./database')
const HomeroomTeacherAssignment = require('./HomeroomTeacherAssignment')

exports.getClassList = async (page, perpage) => {
    return knex.select().table('Class').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getClass = async (classId) => {
    return knex('Class').where('classId', classId).first()
}

//Get homeroom class of a teacher
//And list of students of the class
exports.getHomeroomClass = async (teacherId) => {
    let homeroomClass = {}

    homeroomClass.class = await knex('Class')
        .join('HomeroomTeacherAssignment', 'Class.classId', 'HomeroomTeacherAssignment.classId')
        .select('Class.classId', 'Class.className', 'Class.classCode', 'Class.description')
        .where('HomeroomTeacherAssignment.teacherId', teacherId)
        .first() // trả về dạng object thay vì list do 1 giáo viên chỉ chủ nhiệm 1 lớp
    homeroomClass.students = await knex('StudentAssignment')
        .join('HomeroomTeacherAssignment', {
            'StudentAssignment.classId': 'HomeroomTeacherAssignment.classId',
            'StudentAssignment.schoolYearId': 'HomeroomTeacherAssignment.schoolYearId'
        })
        .join('Student', 'StudentAssignment.studentId', '=', 'Student.studentId')
        .select('Student.studentId', 'Student.studentCode', 'Student.studentName', 'Student.gender', 'Student.email', 'Student.phoneNumber', 'Student.pId',
            'Student.fatherName', 'Student.motherName', 'Student.address')
        .where('HomeroomTeacherAssignment.teacherId', teacherId)
        
    return homeroomClass
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

