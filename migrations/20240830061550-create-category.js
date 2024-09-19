'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false, // 不允许为空
        autoIncrement: true, // 自动递增
        primaryKey: true, // 主键
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: { msg: '名称已存在，请选择其它名称' },  // 验证是否唯一
        validate: {
          notNull: { msg: '名称必须填写。' },
          notEmpty: { msg: '名称不能为空。' },
          len: {
            args: [2, 45],
            msg: '名称长度必须在2~45之间。'
          }
        },
      },
      rank: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          notNull: { msg: '排序必须填写。' },
          notEmpty: { msg: '排序不能为空。' },
          isInt: { msg: '排序必须是整数。' },
          isPositive(value){
            if(value <= 0){
              throw new Error('排序必须是正整数。')
            }
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories');
  }
};