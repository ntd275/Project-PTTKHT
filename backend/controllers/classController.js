const Class = require('../models/Class')
const config = require('../config/config')

async function getClassList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let myClassList = await Class.getClassList(page, perpage)

        return res.status(200).json({
            success: true,
            result: myClassList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

//Lấy thông tin lớp học dựa trên classId
async function getClass(req, res) {
    try {
        let myClass = await Class.getClass(req.params.id)

        return res.status(200).json({
            success: true,
            result: myClass
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

//Lấy danh sách lớp học ứng với teacherId của giáo viên chủ nhiệm
//= getClass(teacher)
async function getHomeroomClass(req, res) {
    try {
        //req.query.key == teacherId
        let homeroom = Class.getHomeroomClass(req.query.key)

        return res.status(200).json({
            success: true,
            result: homeroom
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function createClass(req, res) {
    try {
        let myClass = await Class.createClass(req.body)

        return res.status(200).json({
            success: true,
            result: myClass
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function updateClass(req, res) {
    try {
        myClass = await Class.getClass(req.params.id)
        //Get update info from request
        myClass.schoolYearId = req.body.schoolYearId || myClass.schoolYearId
        myClass.classCode = req.body.classCode || myClass.classCode
        myClass.className = req.body.className || myClass.className
        myClass.description = req.body.description || myClass.description

        let count = await Class.updateClass(req.params.id, myClass)
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
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
            message: err
        })
    }
}

async function deleteClass(req, res) {
    try {
        //Return number of affected rows
        let count = await Class.deleteClass(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
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
            message: err
        })
    }
}

module.exports = {
    getClassList: getClassList,
    getClass: getClass,
    getHomeroomClass: getHomeroomClass,
    createClass: createClass,
    updateClass: updateClass,
    deleteClass: deleteClass
}



