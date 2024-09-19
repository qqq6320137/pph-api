const { Chapter } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 查询所有
exports.chaptersAll = async (req, res) => {
  try{
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
    success(res,'查询章节列表成功。',{
      chapters: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    })
  } catch(error) {
    failure(res, error)
  }

};

// 根据id查询
exports.chaptersById = async (req, res) => { 
  try {
    const chapter = await getChapter(req);
    res.json({
      status: true,
      message: "查询章节详情成功。",
      data: chapter,
    });
  } catch (error) {
    failure(res, error)
  }
};

// 新增章节
exports.chaptersAdd = async (req, res) => {
  try {
    // 白名单过滤
    const body = filterBody(req);

    const chapter = await Chapter.create(body);
    success(res, '创建章节成功。', chapter, 201)
  } catch (error) {
    failure(res, error)
  }
};

// 删除章节
exports.chaptersDelete = async (req, res) => {
  try {
    const chapter = await getChapter(req);
    await chapter.destroy();
    success(res, '删除章节成功。', null)
  } catch (error) {
    failure(res, error)
  }
};

// 修改章节
exports.chaptersUpdate = async (req, res) => {
  try {
    const chapter = await getChapter(req);

    // 白名单过滤
    const body = filterBody(req);

    if (!query.courseId) {
        throw new Error('获取章节列表失败，课程ID不能为空。');
    }
    const condition = {
        ...getCondition(),
        order: [['rank', 'ASC'], ['id', 'ASC']],
        limit: pageSize,
        offset: offset
    };
    condition.where = {
        courseId: {
            [Op.eq]: query.courseId
        }
    };
      
      if (query.title) {
        condition.where = {
          title: {
            [Op.like]: `%${ query.title }%`
          }
        };
      }
    await chapter.update(body);
    success(res, '更新章节成功。', chapter, 201)
  } catch (error) {
    failure(res, error)
  }
};

async function getChapter(req) {
  // 获取章节ID
  const { id } = req.params;
  const condition = getCondition();

  // 查询当前章节
  const chapter = await Chapter.findByPk(id,condition);
  if (!chapter) {
    throw new notFoundError(`ID:${id}的章节未找到。`);
  }
  return chapter;
}

function filterBody(req) {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank
    };
}
function getCondition() {
    return {
        attributes: { exclude: ['CourseId'] },
        include: [
        {
            model: Course,
            as: 'course',
            attributes: ['id', 'name']
        }
        ]
    }
}
