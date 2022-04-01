import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initContract = (sequelize, Types) =>{
  class Contract extends Model {
    static associate(models){

    }
  }

  Contract.init(
    {
      name: Types.STRING,
      value: Types.INTEGER,
      profit: Types.INTEGER,
      amount_per_withdrawal: Types.DOUBLE,
      sponsorship_benefits: Types.DOUBLE,
      level_1_benefits: Types.DOUBLE,
      level_2_benefits: Types.DOUBLE,
      level_3_benefits: Types.DOUBLE
    },{
      sequelize,
      modelName: 'Contract',
      tableName: 'contracts',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  return Contract;s
};

export default initContract(connection, DataTypes);