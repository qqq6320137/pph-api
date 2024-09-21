const { User } = require("../../models");
const { Op } = require("sequelize");
const { NotFound } = require('http-errors')
const { success, failure } = require("../../utils/responses");

/**
 * 查询当前登录的用户详情
 * GET /admin/users/me
 */
exports.current = async (req, res) => {
  try {
    const user = req.user;
    success(res, '查询当前用户信息成功。', { user });
  } catch (error) {
    failure(res, error);
  }
};

// 查询所有用户
exports.usersList = async (req, res) => {
  try {
    const { query } = req;
    //当前是第几页，如果不传就第一页
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    //每页显示多少条数据，如果不传，默认10天条
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      where: {},
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    };

    if (query.email) {
      condition.where.email = query.email;
    }

    if (query.username) {
      condition.where.username = query.username;
    }

    if (query.nickname) {
      condition.where.nickname = {
        [Op.like]: `%${query.nickname}%`,
      };
    }

    if (query.role) {
      condition.where.role = query.role;
    }

    const { count, rows } = await User.findAndCountAll(condition);
    success(res, "查询用户列表成功。", {
      users: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
};

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
    failure(res, error);
  }
};

// 新增用户
exports.usersAdd = async (req, res) => {
  try {
    // 白名单过滤
    const body = filterBody(req);

    const user = await User.create(body);
    success(res, "创建用户成功。", user, 201);
  } catch (error) {
    failure(res, error);
  }
};

// 删除用户
// exports.usersDelete = async (req, res) => {
//   try {
//     const user = await getUser(req);
//     await user.destroy();
//     success(res, '删除用户成功。', null)
//   } catch (error) {
//     failure(res, error)
//   }
// };

// 修改用户
exports.usersUpdate = async (req, res) => {
  try {
    const user = await getUser(req);

    // 白名单过滤
    const body = filterBody(req);

    await user.update(body);
    success(res, "更新用户成功。", user, 201);
  } catch (error) {
    failure(res, error);
  }
};

async function getUser(req) {
  // 获取用户ID
  const { id } = req.params;

  // 查询当前用户
  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFound(`ID:${id}的用户未找到。`);
  }
  return user;
}

function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}
