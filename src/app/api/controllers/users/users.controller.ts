import Users from '@sequelizeModels/Users.model';
import {UserLoginPayload, UserPayload, UserWithToken} from '@expressModels/users/users';
import {userSchema, userLoginSchema} from '@joiSchemas/users/users.joi';
import { generateJWT } from '@expressControllers/JWT/JWT.controller';
import {
  DEFAULT_INTERNAL_ERROR,
  FAILED_TO_GENERATE_TOKEN,
  NO_USER_FOUND,
  SERVER_ERROR,
  USER_ALREADY_EXISTS,
  USER_EMAIL_ALREADY_EXISTS,
  VALIDATION_ERROR
} from '@app/api/constants/errors/errors.constant';
import {hashPassword, comparePassword} from '@expressControllers/bcryptjs/bcryptjs.controller';

export const createUser = async (userPayload : UserPayload) : Promise<Users | Error> => {
  try {
    const { error } = userSchema.validate(userPayload);
    if( error ) {
      return new Error(VALIDATION_ERROR(error.message));
    }

    const existingUser = await Users.findOne({
      where: {
        username: userPayload.username
      }
    });

    if (existingUser) {
      return new Error(USER_ALREADY_EXISTS(userPayload.username));
    }

    const existingEmail = await Users.findOne({
      where: {
        email: userPayload.email
      }
    });

    if (existingEmail) {
      return new Error(USER_EMAIL_ALREADY_EXISTS(userPayload.email));
    }

    const hashedPassword = await hashPassword(userPayload.password_hash);

    if (hashedPassword instanceof Error) {
      return hashedPassword;
    }

    const newUser = {
      ...userPayload,
      password_hash: hashedPassword
    }

    return await Users.create( newUser );
  } catch ( error ) {
    console.error(SERVER_ERROR(error) );
    throw error;
  }
}

export const loginUser = async (userLoginPayload : UserLoginPayload) : Promise<UserWithToken | Error> => {
  const { error } = userLoginSchema.validate(userLoginPayload);
  if( error ) {
   return Error(VALIDATION_ERROR(error.message));
  }

  try{
    const user = await Users.findOne({
      where: {
        username: userLoginPayload.username,
      }
    });

    if (!user) {
      return Error(NO_USER_FOUND);
    }

    const isPasswordValid = await comparePassword(userLoginPayload.password_hash, user.password_hash);

    if (!isPasswordValid) {
      return Error(NO_USER_FOUND);
    }

    const plainUser = user.toJSON() ?? user.get({ plain: true });

    const token = generateJWT(plainUser);

    if (token instanceof Error) {
      return Error(FAILED_TO_GENERATE_TOKEN);
    }

    return { user , token } as UserWithToken;
  }catch(error){
    console.error(SERVER_ERROR(error));
    return Error(DEFAULT_INTERNAL_ERROR);
  }
}

