import { DataTypes, Model, CreationOptional, InferCreationAttributes } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import { ClientAttributes } from '@expressModels/clients/clients';

class Clients extends Model<ClientAttributes, InferCreationAttributes<Clients>> implements ClientAttributes {
  declare id_client: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare address: string | null;
  declare readonly created_at: CreationOptional<Date>;
  declare readonly updated_at: CreationOptional<Date>;
  declare is_active: boolean;
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
    allowNull: true,
  },
  address: {
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
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize: getSequelizeInstance(),
  modelName: 'Clients',
  tableName: 'clients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Clients;
