import joi , { ObjectSchema } from 'joi';
import {User, UserLoginPayload} from '@expressModels/users/users';

export const userSchema : ObjectSchema<User> = joi.object( {
  username: joi.string().min( 3 ).max( 50 ).required() ,
  email: joi.string().email().required() ,
  password: joi.string().min( 3 ).max( 20 ).required() ,
} )

export const userLoginSchema : ObjectSchema<UserLoginPayload> = joi.object( {
  username: joi.string().min( 3 ).max( 50 ).required() ,
  password: joi.string().min( 3 ).max( 20 ).required() ,
})
