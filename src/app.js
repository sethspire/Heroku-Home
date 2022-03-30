const express = require('express') 
const path = require('path')
const hbs = require('hbs')

const indexRouter = require('../routers/index')
const about_meRouter = require('../routers/about-me')
const create_accountRouter = require('../routers/create-account') 
const loginRouter = require('../routers/login') 
const mainRouter = require('../routers/main')
const tasksRouter = require('../routers/tasks')

const _404Router = require('../routers/404')

const app = express() 

const dir = path.join(__dirname, "../public") 
app.use(express.static(dir)) 

app.set('view engine', 'hbs')

const viewsPath = path.join(__dirname, "../templates")
app.set('views', viewsPath)

const partialPath = path.join(__dirname, "../templates/partials")
hbs.registerPartials(partialPath)

app.use(indexRouter) 
app.use(about_meRouter)
app.use(create_accountRouter)
app.use(loginRouter)
app.use(mainRouter)
app.use(tasksRouter)

app.use(_404Router) 

const port = process.env.PORT || 3000 

app.listen(port, () => { 
    console.log('Server is up on port ' + port) 
}) 