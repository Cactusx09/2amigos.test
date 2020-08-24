const express = require('express')
const router = express.Router()
// const passport = require('passport')
const db = require('../configs/database.js')

/**
 * @swagger
 * /api/note:
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
  '/api/note',
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
 * /api/notes/savePositions:
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
  '/api/notes/savePositions',
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

module.exports = router
