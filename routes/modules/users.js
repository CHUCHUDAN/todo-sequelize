// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')

// 引用 Todo model
const db = require('../../models')
const Todo = db.Todo
const User = db.User


//登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//登入功能
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//註冊功能
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({message: '所有欄位都是必填'})
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }
  if (errors.length) {
    return res.render('register', {name, email, password, confirmPassword, errors})
  }
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        console.log('User has already exit')
        errors.push({message: '此信箱已註冊'})
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
          errors
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(user => {
          req.flash('success_msg', '註冊成功')
          return res.redirect('/users/login')
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

//登出功能
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '登出成功')
  res.redirect('/users/login')
})

//匯出路由模組
module.exports = router