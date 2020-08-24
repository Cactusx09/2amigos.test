const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../configs/database.js')

router.post('/api/login', passport.authenticate('local'), (req, res, next) => {
  req.session.userInfo = req.user
  req.session.save()
  const token = jwt.sign({ id: req.user.id }, 'secret cat', {
    expiresIn: 86400,
  })
  res.status(200).send({
    user: {
      id: req.user.id,
      login: req.user.login,
    },
    token,
  })
})

router.get('/api/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

/**
 * @swagger
 * /api/signup:
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
  '/api/signup',
  // passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { login, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    db.run(
      `INSERT INTO user (login, password) VALUES (?,?)`,
      [login, hashedPassword],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({
          userId: this.lastID,
        })
      }
    )
  }
)

/**
 * @swagger
 * /api/user/:id:
 *  get:
 *    description: Select users
 *    parameters:
 *      - name: id
 *        type: integer
 *        required: true
 *        in: path
 *    responses:
 *      '200':
 *        description: Select users from user
 */
router.get('/api/user', (req, res, next) => {
  const usertoken = req.headers.authorization
  const token = usertoken.split(' ')

  const decodedUserId = jwt.verify(token[1], 'secret cat').id

  const sql = 'SELECT * FROM user WHERE id = ?'
  db.get(sql, decodedUserId, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (!row) return res.status(400).json({ error: 'User not find' })
    res.json({
      message: 'success',
      user: {
        id: row.id,
        login: row.login,
      },
    })
  })
})

module.exports = router
