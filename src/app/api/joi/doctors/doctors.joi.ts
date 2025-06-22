import Joi, { ObjectSchema } from 'joi';
import { DoctorPayload } from '@expressModels/doctors/doctors';

export const doctorSchema: ObjectSchema<DoctorPayload> = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z\s.'-]+$/)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least {#limit} characters long.',
      'string.max': 'Name must be at most {#limit} characters long.',
      'string.pattern.base': 'Name can only contain letters, spaces, periods, apostrophes, and hyphens.',
      'any.required': 'Name is required.',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.empty': 'Email is required.',
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Phone must be a string of digits.',
      'string.pattern.base': 'Phone must be between 10 and 15 digits.',
    }),
  specialty: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Specialty must be a string.',
      'string.min': 'Specialty must be at least {#limit} characters long.',
      'string.max': 'Specialty must be at most {#limit} characters long.',
    }),
});
