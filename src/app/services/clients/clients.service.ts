import Clients from '@sequelizeModels/Clients.model';
import { getAuthHeaders } from '@services/auth/auth.service';
import {BAD_REQUEST, DEFAULT_INTERNAL_ERROR, UNAUTHORIZED} from '@app/api/constants/errors/errors.constant';
import {ClientPayload} from '@expressModels/clients/clients';

const CLIENTS_API_URL = '/api/clients';

export const getClients = async() : Promise<Clients[] | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'GET',
    headers,
  };

  try {
    const response = await fetch(CLIENTS_API_URL, requestOptions);

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

    return await response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const createClient = async (clientPayload: ClientPayload): Promise<Clients | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(clientPayload),
  };

  try {
    const response = await fetch(CLIENTS_API_URL, requestOptions);

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

    return await response.json();
  } catch (error) {
    console.error('Error creating client:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}

export const updateClient = async (id: number, clientPayload: ClientPayload): Promise<Clients | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers,
    body: JSON.stringify(clientPayload),
  };

  try {
    const response = await fetch(`${CLIENTS_API_URL}/${id}`, requestOptions);

    if (response.status === 400) {
      const errorMessage = await response.json();
      return new Error(errorMessage.error || BAD_REQUEST);
    }
    if (response.status === 401) {
      return new Error(UNAUTHORIZED);
    }
    if (response.status === 404) {
      return new Error(`Client with ID ${id} not found`);
    }
    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating client:', error);
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
}
