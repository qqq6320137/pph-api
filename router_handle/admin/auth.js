const { User } = require("../../models");
const { Op } = require("sequelize");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.sign_in = async (req, res) => {
  try {
    // crypto.randomBytes(32)：此方法生成一个包含32个随机字节的缓冲区。
    // .toString("hex")：将生成的缓冲区转换为十六进制字符串。
    // console.log(crypto.randomBytes(32).toString("hex"));
    
    const { login, password } = req.body;

    if (!login) {
      throw new BadRequestError("邮箱/用户名必须填写。");
    }

    if (!password) {
      throw new BadRequestError("密码必须填写。");
    }

    const condition = {
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    };

    // 通过email或username，查询用户是否存在
    const user = await User.findOne(condition);
    if (!user) {
      throw new NotFoundError("用户不存在，无法登录。");
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("密码不正确，无法登录。");
    }

    // 验证是否管理员
    if (user.role !== 100)
      throw new UnauthorizedError("用户权限不足，无法登录。");

    // 生成身份证验证令牌
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.SECRET,
      { expiresIn: "30d" } // s秒 d天
    );

    success(res, "登录成功。", {token});
  } catch (error) {
    failure(res, error);
  }
};
