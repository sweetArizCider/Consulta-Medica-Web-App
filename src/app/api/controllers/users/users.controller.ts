/*

import Users from '@sequelizeModels/Users.model';
import {UserLoginPayload, UserPayload, UserWithToken} from '@expressModels/users/users';
import {userSchema, userLoginSchema} from '@joiSchemas/users/users.joi';
import { config } from 'dotenv'
config();
import jwt from 'jsonwebtoken';
import {
  DEFAULT_INTERNAL_ERROR,
  FAILED_TO_GENERATE_TOKEN,
  JWT_SECRET_NOT_CONFIGURED, NO_USER_FOUND
} from '@app/api/constants/errors/errors.constant';

const JWT_SECRET = process.env['SECRET']
const JWT_OPTIONS = { expiresIn: 600 };

export const createUser = async (userPayload : UserPayload) : Promise<Users | Error> => {
  try {
    const { error } = userSchema.validate(userPayload);
    if( error ) {
      return new Error(`Validation error: ${error.message}`);
    }
    return await Users.create( userPayload );
  } catch ( error ) {
    console.error( 'Error creating user:', error );
    throw error;
  }
}

export const loginUser = async (userLoginPayload : UserLoginPayload) : Promise<UserWithToken | Error> => {
  const { error } = userLoginSchema.validate(userLoginPayload);
  if( error ) {
   return Error(`Validation error: ${error.message}`);
  }

  try{
    const user = await Users.findOne({
      where: {
        username: userLoginPayload.username,
        password: userLoginPayload.password
      }
    });

    if (!user) {
      return Error(NO_USER_FOUND);
    }

    if( !JWT_SECRET ) {
      return Error(JWT_SECRET_NOT_CONFIGURED);
    }

    const plainUser = user.toJSON() ?? user.get({ plain: true });

    const token = jwt.sign(plainUser, JWT_SECRET, JWT_OPTIONS);
    console.log(token);

    if (!token) {
      return Error(FAILED_TO_GENERATE_TOKEN);
    }

    return { user , token};
  }catch(err){
    console.error('Error finding user:', err);
    return Error(DEFAULT_INTERNAL_ERROR);
  }
}

*/

