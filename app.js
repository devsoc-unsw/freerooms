const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const port = 1337

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))