const { User } = require("../../models");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 根据id查询
exports.usersById = async (req, res) => { 
  try {
    const user = await getUser(req);
    res.json({
      status: true,
      message: "查询用户成功。",
      data: user,
    });
  } catch (error) {
    failure(res, error)
  }
};

// 新增用户
exports.usersAdd = async (req, res) => {
  try {
    // 白名单过滤
    const body = filterBody(req);

    const user = await User.create(body);
    success(res, '创建用户成功。', user, 201)
  } catch (error) {
    failure(res, error)
  }
};

// 删除用户
exports.usersDelete = async (req, res) => {
  try {
    const user = await getUser(req);
    await user.destroy();
    success(res, '删除用户成功。', null)
  } catch (error) {
    failure(res, error)
  }
};

// 修改用户
exports.usersUpdate = async (req, res) => {
  try {
    const user = await getUser(req);

    // 白名单过滤
    const body = filterBody(req);

    await user.update(body);
    success(res, '更新用户成功。', user, 201)
  } catch (error) {
    failure(res, error)
  }
};

async function getUser(req) {
  // 获取用户ID
  const { id } = req.params;

  // 查询当前用户
  const user = await User.findByPk(id);
  if (!user) {
    throw new notFoundError(`ID:${id}的用户未找到。`);
  }
  return user;
}

function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    sex: req.body.sex,
    role: req.body.role,
    nickname: req.body.nickname
  };
}
