import joi , { ObjectSchema } from 'joi';
import {User, UserLoginPayload} from '@expressModels/users/users';

export const userSchema : ObjectSchema<User> = joi.object( {
  username: joi.string().min( 3 ).max( 50 ).required() ,
  email: joi.string().email().required(),
  password_hash: joi.string().min( 4 ).max( 255 ).required() ,
  photo_profile_url: joi.string().uri().optional().allow( null )
} )

export const userLoginSchema : ObjectSchema<UserLoginPayload> = joi.object( {
  username: joi.string().min( 3 ).max( 50 ).required() ,
  password_hash: joi.string().min( 3 ).max( 20 ).required() ,
})
