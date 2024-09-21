const { Course, Category, Chapter, User } = require("../../models");
const { Op } = require("sequelize");
const { NotFound, BadRequest } = require('http-errors');
const { success, failure } = require("../../utils/responses");

// 查询所有
exports.chaptersAll = async (req, res) => {
  try {
    const { query } = req;
    //当前是第几页，如果不传就第一页
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    //每页显示多少条数据，如果不传，默认10天条
    const pageSize = Math.abs(Number(query.pageSize)) || 10;

    const offset = (currentPage - 1) * pageSize;

    const condition = {
      // 倒序
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    };
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`,
        },
      };
    }
    const { count, rows } = await Chapter.findAndCountAll(condition);
    success(res, "查询章节列表成功。", {
      chapters: rows,
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

/**
 * 查询章节详情
 * GET /chapters/:id
 */
exports.chaptersById = async (req, res) => {
  try {
    const { id } = req.params;
    const condition = {
      attributes: { exclude: ["CourseId"] },
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "name"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "nickname", "avatar", "company"],
            },
          ],
        },
      ],
    };

    const chapter = await Chapter.findByPk(id, condition);
    if (!chapter) {
      throw new NotFound(`ID: ${id}的章节未找到。`);
    }

    // 同属一个课程的所有章节
    const chapters = await Chapter.findAll({
      attributes: { exclude: ["CourseId", "content"] },
      where: { courseId: chapter.courseId },
      order: [
        ["rank", "ASC"],
        ["id", "DESC"],
      ],
    });

    success(res, "查询章节成功。", { chapter, chapters });
  } catch (error) {
    failure(res, error);
  }
};

// 新增章节
exports.chaptersAdd = async (req, res) => {
  try {
    // 白名单过滤
    const body = filterBody(req);

    // 创建章节，并增加课程章节数
    const chapter = await Chapter.create(body);
    await Course.increment("chaptersCount", {
      where: { id: chapter.courseId },
    });

    success(res, "创建章节成功。", chapter, 201);
  } catch (error) {
    failure(res, error);
  }
};

// 删除章节
exports.chaptersDelete = async (req, res) => {
  try {
    const chapter = await getChapter(req);

    // 删除章节，并减少课程章节数
    await chapter.destroy();
    await Course.decrement("chaptersCount", {
      where: { id: chapter.courseId },
    });
    
    success(res, "删除章节成功。");
  } catch (error) {
    failure(res, error);
  }
};

// 修改章节
exports.chaptersUpdate = async (req, res) => {
  try {
    const chapter = await getChapter(req);

    // 白名单过滤
    const body = filterBody(req);

    if (!query.courseId) {
      throw new BadRequest("获取章节列表失败，课程ID不能为空。");
    }
    const condition = {
      ...getCondition(),
      where: {},
      order: [['rank', 'ASC'], ['id', 'ASC']],
      limit: pageSize,
      offset: offset
    };
    condition.where.courseId = query.courseId;

    if (query.title) {
      condition.where.title = {
        [Op.like]: `%${ query.title }%`
      };
    }
    await chapter.update(body);
    success(res, "更新章节成功。", chapter, 201);
  } catch (error) {
    failure(res, error);
  }
};

async function getChapter(req) {
  // 获取章节ID
  const { id } = req.params;
  const condition = getCondition();

  // 查询当前章节
  const chapter = await Chapter.findByPk(id, condition);
  if (!chapter) {
    throw new NotFound(`ID:${id}的章节未找到。`);
  }
  return chapter;
}

function filterBody(req) {
  return {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank,
  };
}
function getCondition() {
  return {
    attributes: { exclude: ["CourseId"] },
    include: [
      {
        model: Course,
        as: "course",
        attributes: ["id", "name"],
      },
    ],
  };
}
