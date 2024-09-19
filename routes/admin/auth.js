const express = require('express');
const router = express.Router();


const auth_handle = require('../../router_handle/admin/auth');

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', auth_handle.sign_in)

module.exports = router;
