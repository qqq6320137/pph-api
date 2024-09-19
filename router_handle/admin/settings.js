const { Setting } = require("../../models");
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


// 查询系统设置详情
exports.settingsById = async (req, res) => { 
    try {
      const setting = await getSetting();
      success(res, '查询系统设置成功。', {setting})
    } catch (error) {
      failure(res, error)
    }
  };

// 修改系统设置
exports.settingsUpdate = async (req, res) => {
  try {
    const setting = await getSetting();

    // 白名单过滤
    const body = filterBody(req);

    await setting.update(body);
    success(res, '更新系统设置成功。', {setting})
  } catch (error) {
    failure(res, error)
  }
};

// 查询当前系统设置
async function getSetting(req) {
  const setting = await Setting.findOne()

  // 查询当前系统设置
//   const setting = await Setting.findByPk(id);
  if (!setting) {
    throw new notFoundError(`ID:${id}的系统设置未找到。`);
  }
  return setting;
}
/**
 * 公共方法：白名单过滤
 * @param req 
 * @returns 
 */
function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.bode.icp,
    copyright: req.body.copyright,
  };
}
