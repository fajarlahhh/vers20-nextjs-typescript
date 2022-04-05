module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.INTEGER
      },
      profit: {
        type: Sequelize.INTEGER
      },
      amountPerWithdrawal: {
        type: Sequelize.DOUBLE
      },
      sponsorshipBenefits: {
        type: Sequelize.DOUBLE
      },
      firstLevelBenefits: {
        type: Sequelize.DOUBLE
      },
      secondLevelBenefits: {
        type: Sequelize.DOUBLE
      },
      thirdLevelBenefits: {
        type: Sequelize.DOUBLE
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
  async down(queryInterface) {
    await queryInterface.dropTable('Contracts');
  }
};