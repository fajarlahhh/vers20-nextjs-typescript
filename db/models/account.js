'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    id_contract: DataTypes.STRING,
    type: DataTypes.TINYINT,
    id_parent: DataTypes.BIGINT,
    wallet_address: DataTypes.STRING,
    email_verification: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};