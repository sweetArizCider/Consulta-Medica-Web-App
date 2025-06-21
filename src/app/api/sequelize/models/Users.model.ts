import { DataTypes , Model  } from 'sequelize';
import { User , UserPayload } from '@expressModels/users/users';
import { getSequelizeInstance } from '@expressConfig/database';

class Users extends Model<User , UserPayload> {}

Users.init( {
  id: {
    type: DataTypes.INTEGER ,
    autoIncrement: true ,
    primaryKey: true ,
  } ,
  username: {
    type: DataTypes.STRING( 50 ) ,
    allowNull: false ,
    unique: true ,
  } ,
  email: {
    type: DataTypes.STRING( 50 ) ,
    allowNull: false ,
    unique: true ,
    validate: {
      isEmail: true
    }
  } ,
  password: {
    type: DataTypes.STRING( 20 ) ,
    allowNull: false ,
    validate: {
      len: [ 6 , 20 ]
    }
  } ,
  created_at: {
    type: DataTypes.STRING( 50 ) ,
  } ,
  active: {
    type: DataTypes.BOOLEAN ,
    defaultValue: true ,
  }
} , {
  sequelize: getSequelizeInstance() ,
  modelName: 'Users' ,
  tableName: 'users' ,
  timestamps: false ,
}
)

export default Users;
