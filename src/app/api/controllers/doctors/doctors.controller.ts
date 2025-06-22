import Doctors from '@sequelizeModels/Doctors.model';
import {DoctorPayload} from '@expressModels/doctors/doctors';
import {Op} from 'sequelize';
import {
  PHONE_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
  VALIDATION_ERROR,
  SERVER_ERROR, NOT_FOUND
} from '@app/api/constants/errors/errors.constant';
import {doctorSchema} from '@joiSchemas/doctors/doctors.joi';

export const createDoctor = async (doctorPayload: DoctorPayload): Promise<Doctors | Error> => {
  const { error } = doctorSchema.validate(doctorPayload);
  if (error) {
    return new Error(VALIDATION_ERROR(error.message));
  }

  const existingEmail = await Doctors.findOne({
    where: {
      email: doctorPayload.email
    }
  });
  if (existingEmail) {
    return new Error(EMAIL_ALREADY_EXISTS(doctorPayload.email));
  }

  const existingPhone = await Doctors.findOne({
    where: {
      phone: doctorPayload.phone
    }
  });
  if (doctorPayload.phone && existingPhone) {
    return new Error(PHONE_ALREADY_EXISTS(doctorPayload.phone));
  }

  try {
    return await Doctors.create(doctorPayload);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}

export const getAllDoctors = async (): Promise<Doctors[] | Error> => {
  try {
    return await Doctors.findAll({where: {is_active: true}});
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}

export const getDoctorById = async (id: number): Promise<Doctors | Error> => {
  try {
    const doctor = await Doctors.findByPk(id);
    if (!doctor) {
      return new Error(NOT_FOUND(id));
    }
    return doctor;
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}

export const updateDoctor = async (id: number, doctorPayload: DoctorPayload): Promise<Doctors | Error> => {
  const { error } = doctorSchema.validate(doctorPayload);
  if (error) {
    return new Error(VALIDATION_ERROR(error.message));
  }

  try {
    const doctor = await getDoctorById(id);
    if (doctor instanceof Error) {
      return doctor;
    }

    const existingEmail = await Doctors.findOne({
      where: {
        email: doctorPayload.email,
        id_doctor: {
          [Op.ne]: id
        }
      }
    });

    if (existingEmail) {
      return new Error(EMAIL_ALREADY_EXISTS(doctorPayload.email));
    }

    const existingPhone = await Doctors.findOne({
      where: {
        phone: doctorPayload.phone,
        id_doctor: {
          [Op.ne]: id
        }
      }
    });
    if (doctorPayload.phone && existingPhone) {
      return new Error(PHONE_ALREADY_EXISTS(doctorPayload.phone));
    }

    await doctor.update(doctorPayload);
    return doctor;
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}

export const deleteDoctor = async (id: number): Promise<Doctors | Error> => {
  try {
    const doctor = await getDoctorById(id);
    if (doctor instanceof Error) {
      return doctor;
    }

    return await doctor.update({is_active: false});
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}

export const restoreDoctor = async (id: number): Promise<Doctors | Error> => {
  try {
    const doctor = await getDoctorById(id);
    if (doctor instanceof Error) {
      return doctor;
    }

    await doctor.update({is_active: true});
    return doctor;
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
}
