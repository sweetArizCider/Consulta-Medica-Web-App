import { DataTypes, Model, CreationOptional, InferCreationAttributes } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import { MedicineAttributes } from '@expressModels/medicines/medicines';

class Medicines extends Model<MedicineAttributes, InferCreationAttributes<Medicines>> implements MedicineAttributes {
  declare id_medicine: CreationOptional<number>;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare readonly created_at: CreationOptional<Date>;
  declare readonly updated_at: CreationOptional<Date>;
  declare is_active: boolean;
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
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize: getSequelizeInstance(),
  modelName: 'Medicines',
  tableName: 'medicines',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Medicines;
