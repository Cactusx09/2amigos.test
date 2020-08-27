const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 8080

const cors = require('cors')
app.use(cors())

const { loadNuxt } = require('nuxt')

async function start() {
  const nuxt = await loadNuxt('start')
  app.use(nuxt.render)
}
if (process.env.NODE_ENV === 'production') start()

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

const userRouter = require('./app/routes/auth')
app.use(userRouter)

const notesRouter = require('./app/routes/notes')
app.use(notesRouter)

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})
