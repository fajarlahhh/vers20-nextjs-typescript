import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initAccount = (sequelize, Types) =>{
  class Account extends Model {
    static associate(models){

    }
  }

  Account.init(
    {
      uuid: Types.STRING,
      username: Types.STRING,
      email: Types.STRING,
      password: Types.STRING,
      id_contract: Types.STRING,
      type: Types.TINYINT,
      id_parent: Types.BIGINT,
      wallet_address: Types.STRING,
      email_verification: Types.TINYINT
    },{
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  return Account;
};

export default initAccount(connection, DataTypes);