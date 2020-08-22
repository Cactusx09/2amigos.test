const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const db = require('./database.js')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password',
    },
    (login, password, done) => {
      db.get(
        'SELECT * FROM user WHERE login = ?',
        [login],
        async (err, row) => {
          if (err) {
            return done(err)
          }
          if (!row) {
            return done(null, false, { error: 'Invalid login' })
          }
          const isPasswordMatch = await bcrypt.compare(password, row.password)
          if (!isPasswordMatch) {
            return done(null, false, { error: 'invalid password' })
          }
          done(null, row)
        }
      )
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport
