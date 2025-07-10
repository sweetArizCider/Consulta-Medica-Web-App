import Doctors from '@sequelizeModels/Doctors.model';
import { getAuthHeaders } from '@services/auth/auth.service';
import {BAD_REQUEST, DEFAULT_INTERNAL_ERROR, UNAUTHORIZED} from '@app/api/constants/errors/errors.constant';
import {DoctorPayload} from '@expressModels/doctors/doctors';

const DOCTORS_API_URL = '/api/doctors';

export const getDoctors = async() : Promise<Doctors[] | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'GET',
    headers,
  };

  try {
    const response = await fetch(DOCTORS_API_URL, requestOptions);

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
    console.error('Error fetching doctors:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const createDoctor = async (doctorPayload: DoctorPayload): Promise<Doctors | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(doctorPayload),
  };

  try {
    const response = await fetch(DOCTORS_API_URL, requestOptions);

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
    console.error('Error creating doctor:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const updateDoctor = async (id: number, doctorPayload: DoctorPayload): Promise<Doctors | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers,
    body: JSON.stringify(doctorPayload),
  };

  try {
    const response = await fetch(`${DOCTORS_API_URL}/${id}`, requestOptions);

    if (response.status === 400) {
      const errorMessage = await response.json();
      return new Error(errorMessage.error || BAD_REQUEST);
    }
    if (response.status === 401) {
      return new Error(UNAUTHORIZED);
    }
    if (response.status === 404) {
      return new Error(`Doctor with ID ${id} not found`);
    }
    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error updating doctor:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}