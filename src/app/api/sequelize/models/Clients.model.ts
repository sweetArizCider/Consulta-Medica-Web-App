import { DataTypes, Model, CreationOptional, InferCreationAttributes } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import { ClientAttributes } from '@expressModels/clients/clients';

class Clients extends Model<ClientAttributes, InferCreationAttributes<Clients>> implements ClientAttributes {
  declare id_client: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare address: string | null;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
  declare is_active: CreationOptional<boolean>;
}

Clients.init({
  id_client: {
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
  address: {
    type: DataTypes.TEXT,
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
  modelName: 'Clients',
  tableName: 'clients',
  timestamps: false
});

export default Clients;
