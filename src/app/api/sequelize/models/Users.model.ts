import { DataTypes , Model , CreationOptional , InferCreationAttributes } from 'sequelize';
import { getSequelizeInstance } from '@expressConfig/database';
import { UserAttributes } from '@expressModels/users/users'

class Users extends Model<UserAttributes, InferCreationAttributes<Users>> implements UserAttributes {
  declare id_user: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
  declare photo_profile_url: string | null;
  declare is_active: CreationOptional<boolean>;
}


Users.init( {
    id_user: {
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
      type: DataTypes.STRING( 100 ) ,
      allowNull: false ,
      unique: true ,
      validate: {
        isEmail: true
      }
    } ,
    password_hash: {
      type: DataTypes.STRING( 255 ) ,
      allowNull: false ,
    } ,
    created_at: {
      type: DataTypes.STRING,
    } ,
    updated_at: {
      type: DataTypes.STRING,
    },
    photo_profile_url: {
      type: DataTypes.STRING( 255 ) ,
      allowNull: true ,
    } ,
    is_active: {
      type: DataTypes.BOOLEAN ,
      defaultValue: true ,
    }
  } , {
    sequelize: getSequelizeInstance() ,
    modelName: 'Users' ,
    tableName: 'users' ,
    timestamps: false,
  }
)

export default Users;
