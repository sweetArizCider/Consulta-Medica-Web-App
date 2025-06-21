import bcrypt from 'bcryptjs'
import {SERVER_ERROR} from '@app/api/constants/errors/errors.constant';

type Password = string

export const hashPassword = async (password: string): Promise<Password | Error> => {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    throw new Error(SERVER_ERROR(error));
  }
}

export const comparePassword = async (password: Password, hashedPassword: Password): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    throw new Error(SERVER_ERROR(error));
  }
}
