const express = require('express');
const router = express.Router();

const chapter_handle = require('../../router_handle/admin/chapters')

// 查询所有文章
router.get('/',chapter_handle.chaptersAll)

// 根据id查询文章详情
router.post('/:id',chapter_handle.chaptersById)

// 根据id修改文章
router.put('/:id',chapter_handle.chaptersUpdate)

// 创建文章
router.post('/',chapter_handle.chaptersAdd)

router.delete('/:id',chapter_handle.chaptersDelete)

module.exports = router