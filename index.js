const express = require('express')
const app = express()
const route = require('./src/routes')
const morgan = require('morgan')

require('dotenv').config();

//use middlewares
app.use(morgan('dev'))
app.use(express.json({limit: "500mb"}))
app.use(express.urlencoded({
    extended: true
}))

//routing
route(app);

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})