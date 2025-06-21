import JWT from 'jsonwebtoken';
import { config } from 'dotenv'
import {UserAttributes} from '@expressModels/users/users';
import {INVALID_TOKEN_FORMAT, JWT_SECRET_NOT_CONFIGURED, SERVER_ERROR} from '@app/api/constants/errors/errors.constant';
config();

const JWT_SECRET = process.env['SECRET']
const JWT_OPTIONS = { expiresIn: 600 };

type JWT = string

export const generateJWT = (plainUser: UserAttributes): JWT | Error => {
  if (!JWT_SECRET) {
    return new Error(JWT_SECRET_NOT_CONFIGURED);
  }

  try {
    return JWT.sign(plainUser, JWT_SECRET, JWT_OPTIONS);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}

export const verifyJWT = (token: string): UserAttributes | Error => {
  if (!JWT_SECRET) {
    return new Error(JWT_SECRET_NOT_CONFIGURED);
  }

  try {
    const decoded = JWT.verify(token, JWT_SECRET);
    if (typeof decoded !== 'object' || !decoded) {
      return new Error(INVALID_TOKEN_FORMAT);
    }
    return decoded as UserAttributes;
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}
