const express = require('express')
const router = express.Router()

router.get('/tasks', (req, res) => {
    res.render('tasks')
})

module.exports = router

/*const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/main', (req, res) => {
    const dir = path.join(__dirname,"../templates/main.html")
    res.sendFile(dir)
})

module.exports = router*/