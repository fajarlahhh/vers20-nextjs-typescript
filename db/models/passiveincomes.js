import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initPassiveIncomes = (sequelize, Types) =>{
  class PassiveIncomes extends Model {
    static associate(models){

    }
  }

  PassiveIncomes.init(
    {
      idAccount: Types.BIGINT,
      debet: Types.DOUBLE,
      credit: Types.DOUBLE,
      description: Types.TEXT
    },{
      sequelize,
      modelName: 'PassiveIncomes'
    }
  );
  return PassiveIncomes;
};

export default initPassiveIncomes(connection, DataTypes);