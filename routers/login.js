const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login')
})

module.exports = router

/*const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/login', (req, res) => {
    const dir = path.join(__dirname,"../templates/login.html")
    res.sendFile(dir)
})

module.exports = router*/