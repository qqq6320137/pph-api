const express = require('express');
const router = express.Router();

const charts_handle = require('../../router_handle/admin/charts');

// 统计用户行性别
router.get('/sex',charts_handle.findAndCountSex)

// 统计每个月用户数量
router.get('/user',charts_handle.findAndCountUser)

module.exports = router