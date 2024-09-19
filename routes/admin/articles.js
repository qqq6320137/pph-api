const express = require('express');
const router = express.Router();

const article_handle = require('../../router_handle/admin/articles')

// 查询所有文章
router.get('/',article_handle.articlesAll)

// 根据id查询文章详情
router.post('/:id',article_handle.articlesById)

// 根据id修改文章
router.put('/:id',article_handle.articlesUpdate)

// 创建文章
router.post('/',article_handle.articlesAdd)

router.delete('/:id',article_handle.articlesDelete)

module.exports = router