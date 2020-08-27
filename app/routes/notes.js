const fs = require('fs')
const express = require('express')
const router = express.Router()
// const passport = require('passport')
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

const db = require('../configs/database.js')

/**
 * @swagger
 * /api/note/create:
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
  '/api/note/create',
  // passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { layout, content, user } = req.body
    db.run(
      `INSERT INTO notes (layout, content, user) VALUES (?, ?, ?)`,
      [JSON.stringify(layout), content, user],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({ id: this.lastID })
      }
    )
  }
)

/**
 * @swagger
 * /api/notes:
 *  get:
 *    description: Select notes
 *    responses:
 *      '200':
 *        description: Select notes
 */
router.get(
  '/api/notes',
  // passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    db.all(
      'SELECT * FROM notes WHERE user = ?',
      req.query.userId,
      (err, rows) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.json({
          message: 'success',
          notes: rows,
        })
      }
    )
  }
)

/**
 * @swagger
 * /api/notes/save:
 *  post:
 *    description: Create new user
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
  '/api/notes/save',
  // passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { items } = req.body
    items.forEach((item) => {
      const content = item.content
      delete item.content
      db.all(
        'UPDATE notes SET (layout, content) = (?, ?) WHERE id = ?',
        [JSON.stringify(item), content, item.id],
        (err, row) => {
          if (err) console.log(err)
        }
      )
    })

    res.status(201).json({ message: 'success' })
  }
)

/**
 * @swagger
 * /api/note/save:
 *  post:
 *    description: Create new user
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
  '/api/note/save',
  // passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { note } = req.body
    const content = note.content
    delete note.content
    db.run(
      'UPDATE notes SET (layout, content, color, opacity) = (?, ?, ?, ?) WHERE id = ?',
      [JSON.stringify(note), content, note.color, note.opacity, note.id],
      (err, row) => {
        if (err) console.log(err)
        res.status(201).json({ message: 'success' })
      }
    )
  }
)

/**
 * @swagger
 * /api/note/delete:
 *  post:
 *    description: Create new user
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
  '/api/note/delete',
  // passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { id } = req.body
    db.run('DELETE FROM notes WHERE id = ?', id, (err, row) => {
      if (err) return console.log(err)
      res.status(201).json({ message: 'success' })
    })
  }
)

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
