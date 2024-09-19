const express = require('express');
const router = express.Router()

const settings_handle = require('../../router_handle/admin/settings')


// 查询系统设置详情
router.post('/',settings_handle.settingsById)

// 修改系统设置
router.put('/',settings_handle.settingsUpdate)

module.exports = router