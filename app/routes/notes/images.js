const fs = require('fs')
const express = require('express')
const router = express.Router()

const multer = require('multer')
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './static/uploads')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`)
  },
})
const upload = multer({ storage })

const db = require('../../configs/database.js')

/**
 * @swagger
 * /api/note/saveImage:
 *  post:
 *    description: Create new note
 *    products:
 *      - application/json
 *    parameters:
 *      - name: login
 *        type: string
 *        required: true
 *        in: formData
 *      - name: password
 *        type: string
 *        required: true
 *        in: formData
 *    responses:
 *      '200':
 *        description: User successfull created
 */
router.post(
  '/api/note/saveImage',
  upload.single('data'),
  ({ file, body }, res) => {
    const modifiedPath = file.path.replace('static/', '')
    db.run(
      'UPDATE notes SET imageUrl = ? WHERE id = ?',
      [modifiedPath, body.noteId],
      (err) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({ path: modifiedPath })
      }
    )
  }
)

/**
 * @swagger
 * /api/note/deleteImage:
 *  post:
 *    description: Create new note
 *    products:
 *      - application/json
 *    parameters:
 *      - name: login
 *        type: string
 *        required: true
 *        in: formData
 *      - name: password
 *        type: string
 *        required: true
 *        in: formData
 *    responses:
 *      '200':
 *        description: User successfull created
 */
router.post('/api/note/deleteImage', ({ body }, res) => {
  fs.unlink(`./static/${body.path}`, () => {
    db.run(
      'UPDATE notes SET imageUrl = NULL WHERE id = ?',
      body.noteId,
      (err) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({ message: 'Succesfully removed!' })
      }
    )
  })
})

module.exports = router
