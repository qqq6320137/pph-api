const { Course, Category, User, Chapter } = require("../../models");
const { Op, where } = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 查询所有
exports.coursesAll = async (req, res) => {
  try {
    const { query } = req;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      ...getCondition(),
      // 倒序
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    };
    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId,
        },
      };
    }

    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId,
        },
      };
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`,
        },
      };
    }

    if (query.recommended) {
      condition.where = {
        recommended: {
          // 需要转布尔值
          [Op.eq]: query.recommended === "true",
        },
      };
    }

    if (query.introductory) {
      condition.where = {
        introductory: {
          [Op.eq]: query.introductory === "true",
        },
      };
    }
    const { count, rows } = await Course.findAndCountAll(condition);
    success(res, "查询课程列表成功。", {
      courses: rows,
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

// 根据id查询课程详情
exports.coursesById = async (req, res) => {
  try {
    const course = await getCourse(req);
    res.json({
      status: true,
      message: "查询课程详情成功。",
      data: course,
    });
  } catch (error) {
    failure(res, error);
  }
};

// 新增课程
exports.coursesAdd = async (req, res) => {
  try {
    // 白名单过滤
    const body = filterBody(req);

    // 获取当前登录的用户 ID  中间件验证过
    body.userId = req.user.id;

    const course = await Course.create(body);
    success(res, "创建课程成功。", course, 201);
  } catch (error) {
    failure(res, error);
  }
};

// 删除课程
exports.coursesDelete = async (req, res) => {
  console.log('进来了')
  try {
    const course = await getCourse(req);

    const count = await Chapter.count({where: { courseId: req.params.id } })
    console.log('打印',count)
    if(count > 0){
      console.log('进来了')
      throw new Error('该课程下有章节，无法删除');
    }

    await course.destroy();
    success(res, "删除课程成功。", null);
  } catch (error) {
    failure(res, error);
  }
};

// 修改课程
exports.coursesUpdate = async (req, res) => {
  try {
    const course = await getCourse(req);

    // 白名单过滤
    const body = filterBody(req);

    await course.update(body);
    success(res, "更新课程成功。", course, 201);
  } catch (error) {
    failure(res, error);
  }
};

async function getCourse(req) {
  const { id } = req.params;

  const condition = getCondition();

  const course = await Course.findByPk(id, condition);
  if (!course) {
    throw new NotFoundError(`ID: ${id}的课程未找到。`);
  }

  return course;
}

function getCondition() {
  return {
    attributes: { exclude: ["CategoryId", "UserId"] },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar"],
      },
    ],
  };
}
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content,
  };
}
