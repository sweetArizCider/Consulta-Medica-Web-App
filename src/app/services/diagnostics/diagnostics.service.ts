import Diagnostics from '@sequelizeModels/Diagnostics.model';
import { getAuthHeaders } from '@services/auth/auth.service';
import {BAD_REQUEST, DEFAULT_INTERNAL_ERROR, UNAUTHORIZED} from '@app/api/constants/errors/errors.constant';
import {DiagnosticPayload} from '@expressModels/diagnostics/diagnostics';

const DIAGNOSTICS_API_URL = '/api/diagnostics';

export const getDiagnostics = async() : Promise<any[] | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'GET',
    headers,
  };

  try {
    const response = await fetch(DIAGNOSTICS_API_URL, requestOptions);

    if (response.status === 500) {
      const errorMessage = await response.json();
      return new Error(errorMessage.error || BAD_REQUEST);
    }
    if (response.status === 401) {
      return new Error(UNAUTHORIZED);
    }
    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const createDiagnostic = async (diagnosticPayload: DiagnosticPayload): Promise<any | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(diagnosticPayload),
  };

  try {
    const response = await fetch(DIAGNOSTICS_API_URL, requestOptions);

    if (response.status === 400) {
      const errorMessage = await response.json();
      return new Error(errorMessage.error || BAD_REQUEST);
    }
    if (response.status === 401) {
      return new Error(UNAUTHORIZED);
    }
    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error creating diagnostic:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const updateDiagnostic = async (id: number, diagnosticPayload: DiagnosticPayload): Promise<any | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers,
    body: JSON.stringify(diagnosticPayload),
  };

  try {
    const response = await fetch(`${DIAGNOSTICS_API_URL}/${id}`, requestOptions);

    if (response.status === 400) {
      const errorMessage = await response.json();
      return new Error(errorMessage.error || BAD_REQUEST);
    }
    if (response.status === 401) {
      return new Error(UNAUTHORIZED);
    }
    if (response.status === 404) {
      return new Error(`Diagnostic with ID ${id} not found`);
    }
    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error updating diagnostic:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const getDiagnosticById = async(id: number) : Promise<any | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'GET',
    headers,
  };

  try {
    const response = await fetch(`${DIAGNOSTICS_API_URL}?id=${id}`, requestOptions);

    if (response.status === 404) {
      return new Error('Diagnostic not found');
    }
    if (response.status === 400) {
      return new Error('Invalid diagnostic ID');
    }
    if (response.status === 401) {
      return new Error(UNAUTHORIZED);
    }
    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching diagnostic by ID:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}