import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initContracts = (sequelize, Types) =>{
  class Contracts extends Model {
    static associate(models){

    }
  }

  Contracts.init(
    {
      name: Types.STRING,
      value: Types.INTEGER,
      profit: Types.INTEGER,
      amountPerWithdrawal: Types.DOUBLE,
      sponsorshipBenefits: Types.DOUBLE,
      firstLevelBenefits: Types.DOUBLE,
      secondLevelBenefits: Types.DOUBLE,
      thirdLevelBenefits: Types.DOUBLE
    },{
      sequelize,
      modelName: 'Contracts'
    }
  );
  return Contracts;
};

export default initContracts(connection, DataTypes);