const express = require('express')
const router = express.Router()

router.get('', (req, res) => {
    res.render('index')
})

module.exports = router

/*const express = require('express')
const path = require('path')

const router = express.Router()

router.get('', (req, res) => {
    const dir = path.join(__dirname,"../templates/index.html")
    res.sendFile(dir)
})

module.exports = router*/