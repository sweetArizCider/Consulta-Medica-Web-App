import { DataTypes, Model, CreationOptional, InferCreationAttributes } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import { MedicineAttributes } from '@expressModels/medicines/medicines';

class Medicines extends Model<MedicineAttributes, InferCreationAttributes<Medicines>> implements MedicineAttributes {
  declare id_medicine: CreationOptional<number>;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
  declare is_active: CreationOptional<boolean>;
}

Medicines.init({
  id_medicine: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  created_at: {
    type: DataTypes.STRING,
  },
  updated_at: {
    type: DataTypes.STRING,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize: getSequelizeInstance(),
  modelName: 'Medicines',
  tableName: 'medicines',
  timestamps: false,
});

export default Medicines;
