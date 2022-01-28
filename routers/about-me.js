const express = require('express')
const router = express.Router()

router.get('/about-me', (req, res) => {
    res.render('about-me')
})

module.exports = router

/*const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/about-me', (req, res) => {
    const dir = path.join(__dirname,"../templates/about-me.html")
    res.sendFile(dir)
})

module.exports = router*/