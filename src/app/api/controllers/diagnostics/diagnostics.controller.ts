import Diagnostics from '@sequelizeModels/Diagnostics.model';
import Clients from '@sequelizeModels/Clients.model';
import Doctors from '@sequelizeModels/Doctors.model';
import { DiagnosticPayload, DiagnosticResponse } from '@expressModels/diagnostics/diagnostics';
import { diagnosticSchema } from '@joiSchemas/diagnostics/diagnostics.joi';
import {
  VALIDATION_ERROR,
  SERVER_ERROR,
  NOT_FOUND, DOCTOR_NOT_FOUND, CLIENT_NOT_FOUND, CLIENT_NOT_ACTIVE, DOCTOR_NOT_ACTIVE
} from '@app/api/constants/errors/errors.constant';

const formatDiagnosticResponse = (diagnostic: Diagnostics): DiagnosticResponse => {
  const plainDiagnostic = diagnostic.get({ plain: true });
  const { client, doctor, ...diagnosticData } = plainDiagnostic;
  return {
    diagnostic: diagnosticData,
    client: client || null,
    doctor: doctor || null
  };
};

export const createDiagnostic = async (diagnosticPayload: DiagnosticPayload): Promise<DiagnosticResponse | Error> => {
  const { error } = diagnosticSchema.validate(diagnosticPayload);
  if (error) {
    return new Error(VALIDATION_ERROR(error.message));
  }

  try {
    const client = await Clients.findByPk(diagnosticPayload.client_id);
    if (!client) return new Error(CLIENT_NOT_FOUND(diagnosticPayload.client_id));
    if(!client.is_active) return new Error(CLIENT_NOT_ACTIVE(diagnosticPayload.client_id));

    const doctor = await Doctors.findByPk(diagnosticPayload.doctor_id);
    if (!doctor) return new Error(DOCTOR_NOT_FOUND(diagnosticPayload.doctor_id));
    if(!doctor.is_active) return new Error(DOCTOR_NOT_ACTIVE(diagnosticPayload.doctor_id));

    const newDiagnostic = await Diagnostics.create(diagnosticPayload);
    return getDiagnosticById(newDiagnostic.id_diagnostic);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getAllDiagnostics = async (): Promise<DiagnosticResponse[] | Error> => {
  try {
    const diagnostics = await Diagnostics.findAll({
      include: [
        { model: Clients, as: 'client' },
        { model: Doctors, as: 'doctor' }
      ]
    });
    return diagnostics.map(formatDiagnosticResponse);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getDiagnosticById = async (id: number): Promise<DiagnosticResponse | Error> => {
  try {
    const diagnostic = await Diagnostics.findByPk(id, {
      include: [
        { model: Clients, as: 'client' },
        { model: Doctors, as: 'doctor' }
      ]
    });
    if (!diagnostic) return new Error(NOT_FOUND(id));
    return formatDiagnosticResponse(diagnostic);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const getDiagnosticsByClientId = async (clientId: number): Promise<DiagnosticResponse[] | Error> => {
  try {
    const client = await Clients.findByPk(clientId);
    if (!client) return new Error(CLIENT_NOT_FOUND(clientId));

    const diagnostics = await Diagnostics.findAll({
      where: { client_id: clientId },
      include: [
        { model: Clients, as: 'client' },
        { model: Doctors, as: 'doctor' }
      ]
    });
    return diagnostics.map(formatDiagnosticResponse);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};

export const updateDiagnostic = async (id: number, diagnosticPayload: DiagnosticPayload): Promise<DiagnosticResponse | Error> => {
  const { error } = diagnosticSchema.validate(diagnosticPayload);
  if (error) return new Error(VALIDATION_ERROR(error.message));

  try {
    const diagnostic = await Diagnostics.findByPk(id);
    if (!diagnostic) return new Error(NOT_FOUND(id));

    const client = await Clients.findByPk(diagnosticPayload.client_id);
    if (!client) return new Error(CLIENT_NOT_FOUND(diagnosticPayload.client_id));
    if(!client.is_active) return new Error(CLIENT_NOT_ACTIVE(diagnosticPayload.client_id));

    const doctor = await Doctors.findByPk(diagnosticPayload.doctor_id);
    if (!doctor) return new Error(DOCTOR_NOT_FOUND(diagnosticPayload.doctor_id));
    if(!doctor.is_active) return new Error(DOCTOR_NOT_ACTIVE(diagnosticPayload.doctor_id));

    await diagnostic.update(diagnosticPayload);

    return getDiagnosticById(id);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    return new Error(SERVER_ERROR(err));
  }
};
