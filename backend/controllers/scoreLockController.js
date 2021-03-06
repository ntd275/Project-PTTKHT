const ScoreLock = require('../models/ScoreLock')
const config = require('../config/config')

async function getScoreLockList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let scoreLockList = await ScoreLock.getScoreLockList(page, perpage)

        if (scoreLockList.length == 0 || scoreLockList == undefined) {
            return res.status(400).json({
                success: false,
                message: "No score lock exists"
            })
        }

        return res.status(200).json({
            success: true,
            result: scoreLockList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getScoreLockById(req, res) {
    try {
        let sLock = await ScoreLock.getScoreLockById(req.params.id)

        if (sLock == undefined || sLock == null) {
            return res.status(400).json({
                success: false,
                message: `Cannot find score lock with id = ${req.params.id}`
            })
        }

        return res.status(200).json({
            success: true,
            result: sLock
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getScoreLock(req, res) {
    try {
        let sLock = await ScoreLock.getScoreLockBySchoolYear(req.query.schoolYearId)

        if (sLock == undefined || sLock == null) {
            return res.status(400).json({
                success: false,
                message: `Cannot find score lock for schoolYearId = ${req.query.schoolYearId}`
            })
        }

        return res.status(200).json({
            success: true,
            result: sLock
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createScoreLock(req, res) {
    try {
        let scoreLock = await ScoreLock.createScoreLock(req.body)

        return res.status(200).json({
            success: true,
            result: scoreLock
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function deleteScoreLock(req, res) {
    try {
        //Return number of affected rows
        let count = await ScoreLock.deleteScoreLock(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete scoreLockId = ${req.params.id}`
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

async function lock(req, res) {
    try {
        let schoolYearId = req.body.schoolYearId
        let term = req.body.term
        //Check data
        if (typeof (schoolYearId) !== "number" || typeof (term) !== "number" || schoolYearId < 0 || term < 0) {
            return res.status(400).json({
                success: false,
                message: "schoolYearId or term is inappropriate"
            })
        }

        //return rows affected
        let count = await ScoreLock.lock(schoolYearId, term)

        if (count == 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot lock"
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

async function unlock(req, res) {
    try {
        let schoolYearId = req.body.schoolYearId
        let term = req.body.term
        //Check data
        if (typeof (schoolYearId) !== "number" || typeof (term) !== "number" || schoolYearId < 0 || term < 0) {
            return res.status(400).json({
                success: false,
                message: "schoolYearId or term is inappropriate"
            })
        }
        //Number of rows affected
        let count = await ScoreLock.unlock(schoolYearId, term)

        if (count == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot unlock"
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
    getScoreLockList: getScoreLockList,
    getScoreLockById: getScoreLockById,
    createScoreLock: createScoreLock,
    getScoreLock: getScoreLock,
    // updateScoreLock: updateScoreLock,
    deleteScoreLock: deleteScoreLock,
    lock: lock,
    unlock: unlock
}