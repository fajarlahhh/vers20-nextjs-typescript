'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Accounts", [
      {
        uuid: '5e21cd96-01ce-4840-892b-c417354d2fb8',
        username: "jondoe",
        email: "andifajarlah@gmail.com",
        password: bcrypt.hashSync('vers20', bcrypt.genSaltSync()),
        idContract: 5,
        type: 1,
        idParent: null,
        walletAddress: '0x991e95A4553E5F8Ee0E57404419B975EDAD4fA26',
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
