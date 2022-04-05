'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Accounts", [
      {
        uuid: 'tes',
        username: "Jon Doe",
        email: "andifajarlah@gmail.com",
        password: bcrypt.hashSync('vers20', bcrypt.genSaltSync()),
        idContract: 5,
        idParent: null,
        walletAddress: null,
        emailVerification: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accounts', null, {});
  }
};
