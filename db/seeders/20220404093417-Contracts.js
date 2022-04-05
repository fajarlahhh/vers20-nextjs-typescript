'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Contracts", [
      {
        name: 'Bronze',
        value: 100,
        profit: 60,
        amountPerWithdrawal: 5,
        sponsorshipBenefits: 8,
        firstLevelBenefits: 3,
        secondLevelBenefits: 2,
        thirdLevelBenefits: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Silver',
        value: 500,
        profit: 450,
        amountPerWithdrawal: 37.5,
        sponsorshipBenefits: 40,
        firstLevelBenefits: 15,
        secondLevelBenefits: 10,
        thirdLevelBenefits: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gold',
        value: 1000,
        profit: 1200,
        amountPerWithdrawal: 100,
        sponsorshipBenefits: 80,
        firstLevelBenefits: 30,
        secondLevelBenefits: 20,
        thirdLevelBenefits: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Platinum',
        value: 5000,
        profit: 7500,
        amountPerWithdrawal: 625,
        sponsorshipBenefits: 400,
        firstLevelBenefits: 150,
        secondLevelBenefits: 100,
        thirdLevelBenefits: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Crown',
        value: 10000,
        profit: 18000,
        amountPerWithdrawal: 1500,
        sponsorshipBenefits: 800,
        firstLevelBenefits: 300,
        secondLevelBenefits: 200,
        thirdLevelBenefits: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Contracts', null, {});
  }
};
