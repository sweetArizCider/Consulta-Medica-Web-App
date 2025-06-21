import { DataTypes, Model, CreationOptional, InferCreationAttributes, ForeignKey } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import Clients from '@sequelizeModels/Clients.model';
import Doctors from '@sequelizeModels/Doctors.model';
import { DiagnosticAttributes } from '@expressModels/diagnostics/diagnostics';

class Diagnostics extends Model<DiagnosticAttributes, InferCreationAttributes<Diagnostics>> implements DiagnosticAttributes {
  declare id_diagnostic: CreationOptional<number>;
  declare client_id: ForeignKey<number>;
  declare doctor_id: ForeignKey<number>;
  declare diagnosis_date: Date;
  declare description: string | null;
  declare readonly created_at: CreationOptional<Date>;
  declare readonly updated_at: CreationOptional<Date>;
}

Diagnostics.init({
  id_diagnostic: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Clients,
      key: 'id_client',
    },
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctors,
      key: 'id_doctor',
    },
  },
  diagnosis_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
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
  modelName: 'Diagnostics',
  tableName: 'diagnostics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Diagnostics;
