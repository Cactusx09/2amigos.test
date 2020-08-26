const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = './app/db.sqlite'

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')
    db.run(
      `CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login text UNIQUE,
        password text,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT login_unique UNIQUE (login)
      )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
        }
      }
    )
    db.run(
      `CREATE TABLE notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        layout text,
        content text,
        image text,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user INTEGER,
        FOREIGN KEY(user) REFERENCES user(id)
      )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
        }
      }
    )
  }
})

module.exports = db
