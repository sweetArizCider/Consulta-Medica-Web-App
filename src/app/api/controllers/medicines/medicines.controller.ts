import Medicines from '@sequelizeModels/Medicines.model';
import { MedicinePayload } from '@expressModels/medicines/medicines';
import { Op } from 'sequelize';
import {
  VALIDATION_ERROR,
  SERVER_ERROR,
  NOT_FOUND,
} from '@app/api/constants/errors/errors.constant';
import { medicineSchema } from '@joiSchemas/medicines/medicines.joi';

const MEDICINE_ALREADY_EXISTS = (name: string) => `Medicine with name '${name}' already exists.`;

export const createMedicine = async (medicinePayload: MedicinePayload): Promise<Medicines | Error> => {
  const { error } = medicineSchema.validate(medicinePayload);
  if (error) {
    return new Error(VALIDATION_ERROR(error.message));
  }

  const existingMedicine = await Medicines.findOne({
    where: {
      name: medicinePayload.name,
    },
  });
  if (existingMedicine) {
    return new Error(MEDICINE_ALREADY_EXISTS(medicinePayload.name));
  }

  try {
    return await Medicines.create(medicinePayload);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getAllMedicines = async (): Promise<Medicines[] | Error> => {
  try {
    return await Medicines.findAll({ where: { is_active: true } });
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getMedicineById = async (id: number): Promise<Medicines | Error> => {
  try {
    const medicine = await Medicines.findByPk(id);
    if (!medicine) {
      return new Error(NOT_FOUND(id));
    }
    return medicine;
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const updateMedicine = async (id: number, medicinePayload: MedicinePayload): Promise<Medicines | Error> => {
  const { error } = medicineSchema.validate(medicinePayload);
  if (error) {
    return new Error(VALIDATION_ERROR(error.message));
  }

  try {
    const medicine = await getMedicineById(id);
    if (medicine instanceof Error) {
      return medicine;
    }

    const existingMedicine = await Medicines.findOne({
      where: {
        name: medicinePayload.name,
        id_medicine: {
          [Op.ne]: id,
        },
      },
    });

    if (existingMedicine) {
      return new Error(MEDICINE_ALREADY_EXISTS(medicinePayload.name));
    }

    await medicine.update(medicinePayload);
    return medicine;
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const deleteMedicine = async (id: number): Promise<Medicines | Error> => {
  try {
    const medicine = await getMedicineById(id);
    if (medicine instanceof Error) {
      return medicine;
    }

    return await medicine.update({ is_active: false });
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const restoreMedicine = async (id: number): Promise<Medicines | Error> => {
  try {
    const medicine = await getMedicineById(id);
    if (medicine instanceof Error) {
      return medicine;
    }

    return await medicine.update({ is_active: true });
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};
