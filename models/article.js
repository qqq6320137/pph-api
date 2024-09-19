"use strict";
const { Model } = require("sequelize");
const moment = require("moment");
moment.locale("zh-cn");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // 不允许空
        validate: {
          // 必须有这个参数
          notNull: {
            msg: "标题必须存在",
          },
          // 不能为空字符串
          notEmpty: {
            msg: "标题不能为空",
          },
          len: {
            args: [2, 45],
            msg: "标题长度必须在2-45之间",
          },
        },
      },
      content: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("createdAt")).format("LL");
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("updatedAt")).format("LL");
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
