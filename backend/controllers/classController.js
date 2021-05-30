const Class = require('../models/Class')
const config = require('../config/config')

async function getClassList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let myClassList = await Class.getClassList(page, perpage)

        if (myClassList.length == 0) {
            return res.status(400).json({
                success: false,
                message: "No class found"
            })
        }

        return res.status(200).json({
            success: true,
            result: myClassList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//Lấy thông tin lớp học dựa trên classId
async function getClass(req, res) {
    try {
        let myClass = await Class.getClass(req.params.id)

        if (myClass === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find class with id = ${req.params.id}`
            })
        }

        return res.status(200).json({
            success: true,
            result: myClass
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

/*
//Lấy danh sách lớp học ứng với teacherId của giáo viên chủ nhiệm
//= getClass(teacher)
Returns:
    class: các fields trong class
    students: danh sách học sinh thuộc homeroomClass đó
*/
async function getHomeroomClass(req, res) {
    try {
        //req.query.key == teacherId
        let homeroomClasses = await Class.getHomeroomClass(req.query.key)

        if (homeroomClasses === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find homeroom class with teacherId = ${req.query.key}`
            })
        }

        return res.status(200).json({
            success: true,
            result: homeroomClasses
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
 * @returns list of classes
 */
 async function getClassByName(req, res) {
    try {
        let className = decodeURI(req.params.name)
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem

        let classes = await Class.getClassByName(className, page, perpage)

        if (classes.length == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot find class with name = ${req.params.name}`
            })
        }

        return res.status(200).json({
            success: true,
            result: classes
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createClass(req, res) {
    try {
        let myClass = await Class.createClass(req.body)

        if (myClass.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot create class"
            })
        }

        return res.status(200).json({
            success: true,
            result: myClass
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function updateClass(req, res) {
    try {
        myClass = await Class.getClass(req.params.id)

        if (myClass === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find class with id = ${req.params.id}`
            })
        }

        //Get update info from request
        myClass.schoolYearId = req.body.schoolYearId || myClass.schoolYearId
        myClass.classCode = req.body.classCode || myClass.classCode
        myClass.className = req.body.className || myClass.className
        myClass.description = req.body.description || myClass.description

        let count = await Class.updateClass(req.params.id, myClass)
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot update class with id = ${req.params.id}`
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

async function deleteClass(req, res) {
    try {
        //Return number of affected rows
        let count = await Class.deleteClass(req.params.id)

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete class with id = ${req.params.id}`
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
    getClassList: getClassList,
    getClass: getClass,
    getHomeroomClass: getHomeroomClass,
    getClassByName: getClassByName,
    createClass: createClass,
    updateClass: updateClass,
    deleteClass: deleteClass
}



