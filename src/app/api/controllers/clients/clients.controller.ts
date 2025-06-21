import Clients from '@sequelizeModels/Clients.model';
import {ClientPayload} from '@expressModels/clients/clients';
import {
  CLIENT_EMAIL_ALREADY_EXISTS,
  CLIENT_NOT_FOUND, CLIENT_PHONE_ALREADY_EXISTS,
  SERVER_ERROR,
  VALIDATION_ERROR
} from '@app/api/constants/errors/errors.constant';
import {clientSchema} from '@joiSchemas/clients/client.joi';
import {Op} from 'sequelize';

export const createClient = async ( clientPayload: ClientPayload ) : Promise<Clients | Error > => {

  const { error } = clientSchema.validate(clientPayload);
  if (error) {
    return new Error(VALIDATION_ERROR(error.message));
  }

  try {
    const existingEmail = await Clients.findOne({
      where: {
        email: clientPayload.email
      }
    });

    if (existingEmail) {
      return new Error(CLIENT_EMAIL_ALREADY_EXISTS(clientPayload.email));
    }

    const existingPhone = await Clients.findOne({
      where: {
        phone: clientPayload.phone
      }
    });

    if (clientPayload.phone && existingPhone) {
      return new Error(CLIENT_PHONE_ALREADY_EXISTS(clientPayload.phone));
    }

    return await Clients.create(clientPayload);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    throw new Error(SERVER_ERROR(error));
  }
}

export const getAllClients = async (): Promise<Clients[] | Error> => {
  try {
    return await Clients.findAll();
  } catch (error) {
    console.error(SERVER_ERROR(error));
    throw new Error(SERVER_ERROR(error));
  }
}

export const getClientById = async (id: number): Promise<Clients | Error> => {
  try {
    const client = await Clients.findByPk(id);
    if (!client) {
      return new Error(CLIENT_NOT_FOUND(id));
    }
    return client;
  } catch (error) {
    console.error(SERVER_ERROR(error));
    throw new Error(SERVER_ERROR(error));
  }
}

export const updateClient = async (id: number, clientPayload: ClientPayload): Promise<Clients | Error> => {
  const { error } = clientSchema.validate(clientPayload);
  if (error) {
    return new Error(VALIDATION_ERROR(error.message));
  }

  const existingEmail = await Clients.findOne({
    where: {
      email: clientPayload.email,
      id_client: {
        [Op.ne]: id
      }
    }
  })
  if (existingEmail) {
    return new Error(CLIENT_EMAIL_ALREADY_EXISTS(clientPayload.email));
  }

  const existingPhone = await Clients.findOne({
    where: {
      phone: clientPayload.phone,
      id_client: {
        [Op.ne]: id
      }
    }
  })
  if (existingPhone) {
    return new Error(CLIENT_PHONE_ALREADY_EXISTS(clientPayload.phone as string));
  }

  try {
    const client = await Clients.findByPk(id);
    if (!client) {
      return new Error(CLIENT_NOT_FOUND(id));
    }

    return await client.update(clientPayload);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    throw new Error(SERVER_ERROR(error));
  }
}
