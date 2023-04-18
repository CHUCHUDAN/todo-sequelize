// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 Todo model
const db = require('../../models')
const Todo = db.Todo

//新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

//新增功能
router.post('/', (req, res) => {
  const UserId = req.user.id
  const { name } = req.body
  return Todo.create({ name, UserId })
    .then(todo => res.redirect('/'))
    .catch(err => console.log(err))
})

//詳細頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

//編輯頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

//編輯功能
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findByPk(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

//刪除功能
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => todo.destroy())
    .then(todo => res.redirect('/'))
    .catch(err => console.log(err))
})

//匯出路由模組
module.exports = router