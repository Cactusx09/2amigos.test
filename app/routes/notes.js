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
    const reqBody = req.body
    console.log(req.body)
    db.run(
      `INSERT INTO notes (content, user) VALUES (?,?)`,
      [reqBody.content, reqBody.user],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({
          noteId: this.lastID,
        })
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

module.exports = router
