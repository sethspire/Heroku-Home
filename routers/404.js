const express = require('express')
const router = express.Router()

router.get('*', (req, res) => {
    res.render('404')
})

module.exports = router

/*const express = require('express')
const path = require('path')

const router = express.Router()

router.get('*', (req, res) => {
    const dir = path.join(__dirname,"../templates/404.html")
    res.sendFile(dir)
})

module.exports = router*/