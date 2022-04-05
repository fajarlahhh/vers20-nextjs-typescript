import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initAccounts = (sequelize, Types) =>{
  class Accounts extends Model {
    static associate(models){

    }
  }

  Accounts.init(
    {
      uuid: Types.STRING,
      username: Types.STRING,
      email: Types.STRING,
      password: Types.STRING,
      idContract: Types.STRING,
      idParent: Types.BIGINT,
      walletAddress: Types.STRING,
      emailVerification: Types.TINYINT
    },{
      sequelize,
      modelName: 'Accounts',
      paranoid: true
    }
  );
  return Accounts;
};

export default initAccounts(connection, DataTypes);