import { DataTypes, Model, CreationOptional, InferCreationAttributes } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import { DoctorAttributes } from '@expressModels/doctors/doctors';

class Doctors extends Model<DoctorAttributes, InferCreationAttributes<Doctors>> implements DoctorAttributes {
  declare id_doctor: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare specialty: string | null;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
  declare is_active: CreationOptional<boolean>;
}

Doctors.init({
  id_doctor: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
  },
  specialty: {
    type: DataTypes.STRING(100),
    allowNull: true,
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
  modelName: 'Doctors',
  tableName: 'doctors',
  timestamps: false,

});

export default Doctors;
