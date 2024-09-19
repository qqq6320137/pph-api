const express = require('express');
const router = express.Router();

const user_handle = require('../../router_handle/admin/users')

// 根据id查询文章详情
router.get('/:id',user_handle.usersById)

// 根据id修改用户密码
router.put('/:id',user_handle.usersUpdate)

// 创建用户
router.post('/',user_handle.usersAdd)

// 删除用户
router.delete('/:id',user_handle.usersDelete)

module.exports = router