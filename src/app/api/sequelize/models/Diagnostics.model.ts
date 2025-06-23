import { DataTypes, Model, CreationOptional, InferCreationAttributes, ForeignKey } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import Clients from '@sequelizeModels/Clients.model';
import Doctors from '@sequelizeModels/Doctors.model';
import { DiagnosticAttributes } from '@expressModels/diagnostics/diagnostics';

class Diagnostics extends Model<DiagnosticAttributes, InferCreationAttributes<Diagnostics>> implements DiagnosticAttributes {
  declare id_diagnostic: CreationOptional<number>;
  declare client_id: ForeignKey<number>;
  declare doctor_id: ForeignKey<number>;
  declare diagnosis_date: CreationOptional<string>;
  declare description: string | null;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
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
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.STRING,
  },
  updated_at: {
    type: DataTypes.STRING,
  },
}, {
  sequelize: getSequelizeInstance(),
  modelName: 'Diagnostics',
  tableName: 'diagnostics',
  timestamps: false
});

Diagnostics.belongsTo(Clients, { foreignKey: 'client_id', as: 'client' });
Diagnostics.belongsTo(Doctors, { foreignKey: 'doctor_id', as: 'doctor' });

export default Diagnostics;
