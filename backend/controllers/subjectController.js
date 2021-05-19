const Subject = require('../models/Subject')
const config = require('../config/config')

//Lấy danh sách tất cả môn học
async function getSubjectList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let subjectList = await Subject.getSubjectList(page, perpage)

        return res.status(200).json({
            success: true,
            result: subjectList
        })
    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

//Lấy danh sách các môn học giảng dạy của 1 giáo viên
// = getSubjectList(teacher)
async function getTeachingSubjectList(req, res) {

}

async function getSubject(req, res) {
    try {
        let subject = await Subject.getSubject(req.params.id)

        return res.status(200).json({
            success: true,
            result: subject
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function createSubject(req, res) {
    try {
        let subject = await Subject.createSubject(req.body)

        return res.status(200).json({
            success: true,
            result: subject
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function updateSubject(req, res) {
    try {
        //Get info of current school year that need to be updated
        subject = await Subject.getSubject(req.params.id)
        //Get update info from request
        subject.subjectCode = req.body.subjectCode || subject.subjectCode
        subject.subjectName = req.body.subjectName || subject.subjectName
        subject.description = req.body.description || subject.description

        let count = await Subject.updateSubject(subject)
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "School year not found"
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function deleteSubject(req, res) {
    try {
        //Return number of affected rows
        let count = await Subject.deleteSubject(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}



