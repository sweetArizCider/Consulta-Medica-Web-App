import { getAuthHeaders } from '@services/auth/auth.service';
import {BAD_REQUEST, DEFAULT_INTERNAL_ERROR, UNAUTHORIZED} from '@app/api/constants/errors/errors.constant';
import {MedicineRequiredPayload} from '@expressModels/medicinesRequired/medicinesRequired';
import { getDiagnosticById } from '../diagnostics/diagnostics.service';

const MEDICINES_REQUIRED_API_URL = '/api/medicinesRequired';

export const getMedicinesRequired = async() : Promise<any[] | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'GET',
    headers,
  };

  try {
    const response = await fetch(MEDICINES_REQUIRED_API_URL, requestOptions);

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
    console.error('Error fetching medicines required:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const createMedicineRequired = async (medicineRequiredPayload: MedicineRequiredPayload): Promise<any | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(medicineRequiredPayload),
  };

  try {
    const response = await fetch(MEDICINES_REQUIRED_API_URL, requestOptions);

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
    console.error('Error creating medicine required:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const updateMedicineRequired = async (id: number, medicineRequiredPayload: MedicineRequiredPayload): Promise<any | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers,
    body: JSON.stringify(medicineRequiredPayload),
  };

  try {
    const response = await fetch(`${MEDICINES_REQUIRED_API_URL}/${id}`, requestOptions);

    if (response.status === 400) {
      const errorMessage = await response.json();
      return new Error(errorMessage.error || BAD_REQUEST);
    }
    if (response.status === 401) {
      return new Error(UNAUTHORIZED);
    }
    if (response.status === 404) {
      return new Error(`Medicine Required with ID ${id} not found`);
    }
    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error updating medicine required:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }


}
