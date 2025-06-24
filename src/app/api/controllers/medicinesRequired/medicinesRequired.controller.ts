import MedicinesRequired from '@sequelizeModels/MedicinesRequired.model';
import Diagnostics from '@sequelizeModels/Diagnostics.model';
import Medicines from '@sequelizeModels/Medicines.model';
import Clients from '@sequelizeModels/Clients.model';
import Doctors from '@sequelizeModels/Doctors.model';
import {
  ClientWithMedicinesResponse,
  DiagnosticWithMedicinesResponse,
  MedicineRequiredPayload,
  MedicineRequiredResponse,
  MedicineRequiredAttributes
} from '@expressModels/medicinesRequired/medicinesRequired';
import { medicineRequiredSchema } from '@joiSchemas/medicinesRequired/medicinesRequired.joi';
import {
  CLIENT_NOT_FOUND,
  DIAGNOSTIC_NOT_FOUND,
  MEDICINE_NOT_ACTIVE,
  MEDICINE_NOT_FOUND,
  NOT_FOUND,
  SERVER_ERROR,
  VALIDATION_ERROR
} from '@app/api/constants/errors/errors.constant';
import { DiagnosticAttributes } from '@expressModels/diagnostics/diagnostics';
import { MedicineAttributes } from '@expressModels/medicines/medicines';

const formatMedicineRequiredResponse = (medicineRequired: MedicinesRequired): MedicineRequiredResponse => {
  const plainMedicineRequired = medicineRequired.get({ plain: true });
  const { medicine, diagnostic, ...medicineRequiredData } = plainMedicineRequired;
  return {
    medicineRequired: medicineRequiredData,
    medicine: medicine || null
  };
};

export const createMedicineRequired = async (payload: MedicineRequiredPayload): Promise<MedicineRequiredResponse | Error> => {
  const { error } = medicineRequiredSchema.validate(payload);
  if (error) return new Error(VALIDATION_ERROR(error.message));

  try {
    const diagnostic = await Diagnostics.findByPk(payload.diagnostic_id);
    if (!diagnostic) return new Error(DIAGNOSTIC_NOT_FOUND(payload.diagnostic_id));

    const medicine = await Medicines.findByPk(payload.medicine_id);
    if (!medicine) return new Error(MEDICINE_NOT_FOUND(payload.medicine_id));
    if (!medicine.is_active) return new Error(MEDICINE_NOT_ACTIVE(payload.medicine_id));

    const newMedicineRequired = await MedicinesRequired.create(payload);
    return getMedicineRequiredById(newMedicineRequired.id_medicine_required);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getAllMedicinesRequired = async (): Promise<MedicineRequiredResponse[] | Error> => {
  try {
    const medicinesRequired = await MedicinesRequired.findAll({
      include: [{ model: Medicines, as: 'medicine' }]
    });
    return medicinesRequired.map(formatMedicineRequiredResponse);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getMedicineRequiredById = async (id: number): Promise<MedicineRequiredResponse | Error> => {
  try {
    const medicineRequired = await MedicinesRequired.findByPk(id, {
      include: [{ model: Medicines, as: 'medicine' }]
    });
    if (!medicineRequired) return new Error(NOT_FOUND(id));
    return formatMedicineRequiredResponse(medicineRequired);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getMedicinesRequiredByDiagnosticId = async (diagnosticId: number): Promise<DiagnosticWithMedicinesResponse | Error> => {
  try {
    const diagnostic = await Diagnostics.findByPk(diagnosticId, {
      include: [
        { model: Clients, as: 'client' },
        { model: Doctors, as: 'doctor' }
      ]
    });
    if (!diagnostic) return new Error(DIAGNOSTIC_NOT_FOUND(diagnosticId));

    const medicinesRequiredInstances = await MedicinesRequired.findAll({
      where: { diagnostic_id: diagnosticId },
      include: [{ model: Medicines, as: 'medicine' }]
    });

    const plainDiagnostic = diagnostic.get({ plain: true });
    const { client, doctor, ...diagnosticData } = plainDiagnostic;

    return {
      diagnostic: diagnosticData,
      client: client || null,
      doctor: doctor || null,
      medicinesRequired: medicinesRequiredInstances.map(formatMedicineRequiredResponse)
    };
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getMedicinesRequiredByClientId = async (clientId: number): Promise<ClientWithMedicinesResponse | Error> => {
  try {
    const client = await Clients.findByPk(clientId);
    if (!client) return new Error(CLIENT_NOT_FOUND(clientId));

    const diagnostics = await Diagnostics.findAll({
      where: { client_id: clientId },
      include: [
        { model: Doctors, as: 'doctor' },
        {
          model: MedicinesRequired,
          as: 'medicinesRequired',
          include: [{ model: Medicines, as: 'medicine' }]
        }
      ]
    });

    const formattedDiagnostics = diagnostics.map((d): DiagnosticWithMedicinesResponse => {
      const plainDiagnostic = d.get({ plain: true }) as DiagnosticAttributes & {
        medicinesRequired?: (MedicineRequiredAttributes & { medicine?: MedicineAttributes })[];
      };
      const { client: diagClient, doctor, medicinesRequired, ...diagnosticData } = plainDiagnostic;

      const formattedMedicines = (medicinesRequired || []).map((mr: MedicineRequiredAttributes & { medicine?: MedicineAttributes }): MedicineRequiredResponse => {
        const { medicine, diagnostic, ...mrData } = mr;
        return {
          medicineRequired: mrData,
          medicine: medicine || null
        };
      });

      return {
        diagnostic: diagnosticData,
        client: null,
        doctor: doctor || null,
        medicinesRequired: formattedMedicines
      };
    });

    return {
      client: client.get({ plain: true }),
      diagnostics: formattedDiagnostics
    };
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const updateMedicineRequired = async (id: number, payload: MedicineRequiredPayload): Promise<MedicineRequiredResponse | Error> => {
  const { error } = medicineRequiredSchema.validate(payload);
  if (error) return new Error(VALIDATION_ERROR(error.message));

  try {
    const medicineRequired = await MedicinesRequired.findByPk(id);
    if (!medicineRequired) return new Error(NOT_FOUND(id));

    const diagnostic = await Diagnostics.findByPk(payload.diagnostic_id);
    if (!diagnostic) return new Error(DIAGNOSTIC_NOT_FOUND(payload.diagnostic_id));

    const medicine = await Medicines.findByPk(payload.medicine_id);
    if (!medicine) return new Error(MEDICINE_NOT_FOUND(payload.medicine_id));
    if (!medicine.is_active) return new Error(MEDICINE_NOT_ACTIVE(payload.medicine_id));

    await medicineRequired.update(payload);
    return getMedicineRequiredById(id);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};
