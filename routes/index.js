//引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const { authenticator } = require('../middleware/auth')

const todos = require('./modules/todos')
const home = require('./modules/home')
const users = require('./modules/users')
const auth = require('./modules/auth')


router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)


// 匯出路由器
module.exports = router