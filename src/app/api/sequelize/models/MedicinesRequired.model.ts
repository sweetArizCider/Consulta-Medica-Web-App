import { DataTypes, Model, CreationOptional, InferCreationAttributes, ForeignKey } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import Diagnostics from '@sequelizeModels/Diagnostics.model';
import Medicines from '@sequelizeModels/Medicines.model';
import { MedicineRequiredAttributes } from '@expressModels/medicinesRequired/medicinesRequired';

class MedicinesRequired extends Model<MedicineRequiredAttributes, InferCreationAttributes<MedicinesRequired>> implements MedicineRequiredAttributes {
  declare id_medicine_required: CreationOptional<number>;
  declare diagnostic_id: ForeignKey<number>;
  declare medicine_id: ForeignKey<number>;
  declare dosage: string | null;
  declare frequency: string | null;
  declare duration: string | null;
  declare readonly created_at: CreationOptional<Date>;
  declare readonly updated_at: CreationOptional<Date>;
}

MedicinesRequired.init({
  id_medicine_required: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  diagnostic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Diagnostics,
      key: 'id_diagnostic',
    },
  },
  medicine_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medicines,
      key: 'id_medicine',
    },
  },
  dosage: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: getSequelizeInstance(),
  modelName: 'MedicinesRequired',
  tableName: 'medicines_required',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default MedicinesRequired;
