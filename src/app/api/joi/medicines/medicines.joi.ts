import Joi, { ObjectSchema } from 'joi';
import { MedicinePayload } from '@expressModels/medicines/medicines';

export const medicineSchema: ObjectSchema<MedicinePayload> = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least {#limit} characters long.',
      'string.max': 'Name must be at most {#limit} characters long.',
      'any.required': 'Name is required.',
    }),
  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.min': 'Price cannot be negative.',
      'any.required': 'Price is required.',
    }),
  description: Joi.string()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Description must be a string.',
      'string.max': 'Description must be at most {#limit} characters long.',
    }),
});
