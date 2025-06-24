import Joi, { ObjectSchema } from 'joi';
import { MedicineRequiredPayload } from '@expressModels/medicinesRequired/medicinesRequired';

export const medicineRequiredSchema: ObjectSchema<MedicineRequiredPayload> = Joi.object({
  diagnostic_id: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Diagnostic ID must be a number.',
      'number.integer': 'Diagnostic ID must be an integer.',
      'any.required': 'Diagnostic ID is required.',
    }),
  medicine_id: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Medicine ID must be a number.',
      'number.integer': 'Medicine ID must be an integer.',
      'any.required': 'Medicine ID is required.',
    }),
  dosage: Joi.string()
    .max(50)
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Dosage must be a string.',
      'string.max': 'Dosage must be at most {#limit} characters long.',
    }),
  frequency: Joi.string()
    .max(50)
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Frequency must be a string.',
      'string.max': 'Frequency must be at most {#limit} characters long.',
    }),
  duration: Joi.string()
    .max(50)
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Duration must be a string.',
      'string.max': 'Duration must be at most {#limit} characters long.',
    }),
});
