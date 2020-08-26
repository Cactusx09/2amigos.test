const path = require('path')

const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 8080

const cors = require('cors')
app.use(cors())

const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerDocs = swaggerJsDoc({
  swaggerDefinition: {
    info: '2amigos.test API',
    description: '2amigos API Information',
    contact: {
      name: 'trg',
    },
    servers: [`http://localhost:${port}`],
  },
  apis: ['app.js'],
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(express.static(path.join(__dirname, 'dist')))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))

const passport = require('passport')
app.use(passport.initialize())
app.use(passport.session())
require('./app/configs/passport')

app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
)

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

const db = require('./app/configs/database.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})
/**
 * @swagger
 * /api/image/save:
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
app.post('/api/image/save', upload.single('data'), ({ file, body }, res) => {
  const modifiedPath = file.path.replace('static/', '')
  db.run(
    'UPDATE notes SET image = ? WHERE id = ?',
    [modifiedPath, body.noteId],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.status(201).json({ path: modifiedPath })
    }
  )
})

const userRouter = require('./app/routes/auth')
app.use(userRouter)

const notesRouter = require('./app/routes/notes')
app.use(notesRouter)

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})
