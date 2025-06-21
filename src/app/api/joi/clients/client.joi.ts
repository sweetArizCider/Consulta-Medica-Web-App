import Joi, { ObjectSchema } from 'joi';
import { ClientPayload } from '@expressModels/clients/clients';

export const clientSchema: ObjectSchema<ClientPayload> = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  phone: Joi.string()
    .min(10)
    .max(15)
    .optional()
    .allow(null, ''),
  address: Joi.string()
    .max(255)
    .optional()
    .allow(null, '')
});
