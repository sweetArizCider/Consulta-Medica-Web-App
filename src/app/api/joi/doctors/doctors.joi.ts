import joi from 'joi';
import { DoctorPayload } from '@expressModels/doctors/doctors';

export const doctorSchema = joi.object<DoctorPayload>({
  name: joi.string().min(3).max(100).required(),
  email: joi.string().email().max(100).required(),
  phone: joi.string().max(20).optional().allow(null),
  specialty: joi.string().max(100).optional().allow(null),
})
