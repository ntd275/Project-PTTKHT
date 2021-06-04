const multer = require('multer')
const path = require('path')

const fileTypes = /jpeg|jpg|png/
const imageDir = path.join('./public/images')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const checkFileType = (req, file, callback) => {
    let extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    let mimetype = fileTypes.test(file.mimetype)

    if (extname && mimetype) {
        return callback(null, true)
    }

    return callback('Error: image only!', false)
}

const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter: checkFileType
}).single('avatar')

module.exports = uploadImage
