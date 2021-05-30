const Subject = require('../models/Subject')
const config = require('../config/config')

//Lấy danh sách tất cả môn học
async function getSubjectList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let subjectList = await Subject.getSubjectList(page, perpage)

        if (subjectList.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Found no subject"
            })
        }

        return res.status(200).json({
            success: true,
            result: subjectList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//Lấy danh sách các môn học giảng dạy của 1 giáo viên
// = getSubjectList(teacher)
async function getTeachingSubjectList(req, res) {
    try {
        let teachingSubject = await Subject.getTeachingSubjectList(req.query.key) //teacherId

        if (teachingSubject.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Found no teaching subject"
            })
        }

        return res.status(200).json({
            success: true,
            result: teachingSubject
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }

}

async function getSubject(req, res) {
    try {
        let subject = await Subject.getSubject(req.params.id)

        if (subject === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find subject with id = ${req.params.id}`
            })
        }

        return res.status(200).json({
            success: true,
            result: subject
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


/**
 * 
 * @param {*} req req.params.name: Tên giáo viên được encoded
 * @returns list of subjects
 */
 async function getSubjectByName(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let subjectName = decodeURI(req.params.name)
        let subjects = await Subject.getSubjectByName(subjectName, page, perpage)

        if (subjects.length == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot find subject with name = ${req.params.name}`
            })
        }

        return res.status(200).json({
            success: true,
            result: subjects
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createSubject(req, res) {
    try {
        let count = await Subject.createSubject(req.body) // Return rows affected

        if (count.length == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot create subject`
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function updateSubject(req, res) {
    try {
        //Get info of current subject that need to be updated
        subject = await Subject.getSubject(req.params.id)

        if (subject === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find subject with id = ${req.params.id}`
            })
        }

        //Get update info from request
        subject.subjectCode = req.body.subjectCode || subject.subjectCode
        subject.subjectName = req.body.subjectName || subject.subjectName
        subject.description = req.body.description || subject.description

        let count = await Subject.updateSubject(req.params.id, subject)

        if (count == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot update subject with id = ${req.params.id}`
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function deleteSubject(req, res) {
    try {
        //Return number of affected rows
        let count = await Subject.deleteSubject(req.params.id)

        if (count == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete subject with id = ${req.params.id}`
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

module.exports = {
    getSubjectList: getSubjectList,
    getTeachingSubjectList: getTeachingSubjectList,
    getSubject: getSubject,
    getSubjectByName: getSubjectByName,
    createSubject: createSubject,
    updateSubject: updateSubject,
    deleteSubject: deleteSubject
}



