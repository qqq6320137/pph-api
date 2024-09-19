const express = require('express');
const router = express.Router();

const course_handle = require('../../router_handle/admin/courses.js')

// 查询所有课程
router.get('/',course_handle.coursesAll)

// 根据id查询课程详情
router.post('/:id',course_handle.coursesById)

// 根据id修改课程
router.put('/:id',course_handle.coursesUpdate)

// 创建课程
router.post('/',course_handle.coursesAdd)

router.delete('/:id',course_handle.coursesDelete)

module.exports = router