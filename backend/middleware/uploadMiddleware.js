const fs = require('fs')
const path = require('path')
const multer = require('multer')

const uploadDirectory = path.join(__dirname, '..', 'uploads', 'cars')

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory)
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase()
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`

        cb(null, uniqueName)
    }
})

const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
]

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 3
    },
    fileFilter: (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG, PNG and WEBP images are allowed'))
        }

        cb(null, true)
    }
})

const carImageUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
])

const uploadCarImages = (req, res, next) => {
    carImageUpload(req, res, error => {
        if (!error) return next()

        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'Each image must be smaller than 5MB'
                })
            }

            if (error.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    error: 'Maximum 3 images are allowed'
                })
            }
        }

        return res.status(400).json({
            error: error.message || 'Image upload failed'
        })
    })
}

module.exports = {
    uploadCarImages
}