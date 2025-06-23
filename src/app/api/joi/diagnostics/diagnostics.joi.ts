import Joi, { ObjectSchema } from 'joi';
import { DiagnosticPayload } from '@expressModels/diagnostics/diagnostics';

export const diagnosticSchema: ObjectSchema<DiagnosticPayload> = Joi.object({
  client_id: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Client ID must be a number.',
      'number.integer': 'Client ID must be an integer.',
      'any.required': 'Client ID is required.',
    }),
  doctor_id: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Doctor ID must be a number.',
      'number.integer': 'Doctor ID must be an integer.',
      'any.required': 'Doctor ID is required.',
    }),
  diagnosis_date: Joi.string()
    .optional()
    .allow(null)
    .messages({
      'date.base': 'Diagnosis date must be a valid date.',
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Description must be a string.',
      'string.max': 'Description must be at most {#limit} characters long.',
    }),
});
