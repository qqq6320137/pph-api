const express = require('express');
const router = express.Router();

const user_handle = require('../../router_handle/admin/users')

// 查询当前登录的用户详情
// 注意：次接口必须再 根据id查询用户详情之前  否则会把 me 当作 :id
router.get('/me',user_handle.current)

// 查询用户列表
router.get('/',user_handle.usersList)

// 根据id查询用户详情
router.get('/:id',user_handle.usersById)

// 根据id修改用户密码
router.put('/:id',user_handle.usersUpdate)

// 创建用户
router.post('/',user_handle.usersAdd)

// 删除用户
// router.delete('/:id',user_handle.usersDelete)

module.exports = router