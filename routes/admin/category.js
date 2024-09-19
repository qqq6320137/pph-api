const express = require('express');
const router = express.Router();

const category_handle = require('../../router_handle/admin/category')

// 查询所有分类
router.get('/',category_handle.categoriesAll)

// 根据id查询分类详情
router.post('/:id',category_handle.categoriesById)

// 创建分类
router.post('/',category_handle.categoriesAdd)

// 根据id修改分类
router.put('/:id',category_handle.categoriesUpdate)

// 删除分类
router.delete('/:id',category_handle.categoriesDelete)

module.exports = router