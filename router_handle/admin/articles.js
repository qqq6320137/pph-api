const { Article } = require("../../models");
const { Op } = require("sequelize");
const { NotFound } = require('http-errors')
const { success, failure } = require("../../utils/responses");

// 查询所有
exports.articlesAll = async (req, res) => {
  try {
    const { query } = req;
    //当前是第几页，如果不传就第一页
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    //每页显示多少条数据，如果不传，默认10天条
    const pageSize = Math.abs(Number(query.pageSize)) || 10;

    const offset = (currentPage - 1) * pageSize;

    const condition = {
      // 倒序
      where: {},
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    };
    if (query.title) {
      condition.where.title = {
        [Op.like]: `%${ query.title }%`
      };
    }
    const { count, rows } = await Article.findAndCountAll(condition);
    success(res, "查询文章列表成功。", {
      articles: rows,
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
exports.articlesById = async (req, res) => {
  try {
    const article = await getArticle(req);
    res.json({
      status: true,
      message: "查询文章详情成功。",
      data: article,
    });
  } catch (error) {
    failure(res, error);
  }
};

// 新增文章
exports.articlesAdd = async (req, res) => {
  try {
    // 白名单过滤
    const body = filterBody(req);

    const article = await Article.create(body);
    success(res, "创建文章成功。", article, 201);
  } catch (error) {
    failure(res, error);
  }
};

// 删除文章
exports.articlesDelete = async (req, res) => {
  try {
    const article = await getArticle(req);
    await article.destroy();
    success(res, "删除文章成功。", null);
  } catch (error) {
    failure(res, error);
  }
};

// 修改文章
exports.articlesUpdate = async (req, res) => {
  try {
    const article = await getArticle(req);

    // 白名单过滤
    const body = filterBody(req);

    await article.update(body);
    success(res, "更新文章成功。", article, 201);
  } catch (error) {
    failure(res, error);
  }
};

async function getArticle(req) {
  // 获取文章ID
  const { id } = req.params;

  // 查询当前文章
  const article = await Article.findByPk(id);
  if (!article) {
    throw new NotFound(`ID:${id}的文章未找到。`);
  }
  return article;
}

function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}
