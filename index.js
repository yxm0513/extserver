const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()

app.use(bodyParser.json())
app.use(methodOverride())

mongoose.connect('mongodb://localhost:27017/extserver')

restify.serve(router, mongoose.model('settings', new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
})))

restify.serve(router, mongoose.model('zixuan', new mongoose.Schema({
  code: { type: String, required: true },
})))

restify.serve(router, mongoose.model('jixuan', new mongoose.Schema({
  code: { type: String, required: true },
})))

restify.serve(router, mongoose.model('notify', new mongoose.Schema({
  message: { type: String, required: true },
})))

app.use(router)

app.listen(3000, () => {
  console.log('Express server listening on port 3000')
})
