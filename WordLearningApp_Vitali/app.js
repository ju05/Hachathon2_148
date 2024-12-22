const express = require('express')
const app = express()
const router = require('./routes/index')

app.use('/res',express.static('public/start/res'))
app.use('/res',express.static('public/main/res'));
app.use('/res',express.static('public/session/res'))

app.use('/', router);

module.exports = app;