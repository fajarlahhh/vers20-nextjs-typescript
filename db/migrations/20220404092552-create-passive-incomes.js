'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PassiveIncomes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idAccount: {
        type: Sequelize.BIGINT,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'Accounts',
          key: 'id'
        }
      },
      debet: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      credit: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('PassiveIncomes');
  }
};