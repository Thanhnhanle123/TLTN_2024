const fs = require('fs')
const path = require('path')

const copyImage = async (req, res, next) => {
  try {
    if (req.files || req.files.length !== 0) {
      const { folderName } = req.body
      const files = req.files
      const folder = folderName || 'defaultFolder'

      // Create the folder if it doesn't exist
      await fs.promises.mkdir(path.join('public/images', folder), {
        recursive: true
      })

      for (const file of files) {
        const filename = file.filename
        const destination = path.join('public/images', folder, filename)

        // Copy file to the destination folder and remove the temp file
        await fs.promises.copyFile(file.path, destination)
        await fs.promises.unlink(file.path)

        // Update file path to the new destination
        file.path = destination
      }
    }
    next()
  } catch (error) {
    res.status(500).send({
      error: error.message || 'An error occurred while copying images'
    })
  }
}

module.exports = {
  copyImage
}
