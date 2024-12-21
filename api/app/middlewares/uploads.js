const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join('uploads\\temp') // Set dynamic path

    // Ensure the folder exists, create if not
    fs.mkdir(folderPath, { recursive: true }, err => {
      if (err) {
        return cb(err)
      }
      cb(null, folderPath) // Set destination path
    })
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) // Set file name
  }
})

const uploadImage = multer({ storage })

module.exports = {
  uploadImage
}
