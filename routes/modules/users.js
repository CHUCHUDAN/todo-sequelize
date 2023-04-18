// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')

// 引用 Todo model
const db = require('../../models')
const Todo = db.Todo


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
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        console.log('User has already exit')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
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
        .then(user => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

//登出功能
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

//匯出路由模組
module.exports = router