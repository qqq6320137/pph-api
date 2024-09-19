const { Category,Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

// 查询所有
exports.categoriesAll = async (req, res) => {
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
  if (query.name) {
    condition.where = {
      name: {
        [Op.like]: `%${query.name}%`,
      },
    };
  }
  const { count, rows } = await Category.findAndCountAll(condition);
  success(res,'查询分类列表成功。',{
    categories: rows,
    pagination: {
      total: count,
      currentPage,
      pageSize,
    },
  })
};

// 根据id查询
exports.categoriesById = async (req, res) => { 
  try {
    const category = await getCategory(req);
    res.json({
      status: true,
      message: "查询分类详情成功。",
      data: category,
    });
  } catch (error) {
    failure(res, error)
  }
};

// 创建分类
exports.categoriesAdd = async (req, res) => {
  try {
    // 白名单过滤
    const body = filterBody(req);

    const category = await Category.create(body);
    success(res, '创建分类成功。', category, 201)
  } catch (error) {
    failure(res, error)
  }
};

// 删除分类
exports.categoriesDelete = async (req, res) => {
  try {
    const category = await getCategory(req);
    await category.destroy();
    success(res, '删除分类成功。', null)
  } catch (error) {
    failure(res, error)
  }
};

// 修改分类
exports.categoriesUpdate = async (req, res) => {
  try {
    const category = await getCategory(req);

    // 白名单过滤
    const body = filterBody(req);

    await category.update(body);
    success(res, '更新分类成功。', category, 201)
  } catch (error) {
    failure(res, error)
  }
};

async function getCategory(req) {
  // 获取分类ID
  const { id } = req.params;
  const condition = {
    include: [
      {
        model: Course,
        as: "courses",
        attributes: ["id", "name"], // 加这个属性是只查Course表里的id和name字段
      },
    ],
  }


  // 查询当前分类
  const category = await Category.findByPk(id,condition);
  if (!category) {
    throw new notFoundError(`ID:${id}的分类未找到。`);
  }
  return category;
}

function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}
