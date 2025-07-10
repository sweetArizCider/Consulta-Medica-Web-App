import {UserAttributes, UserLoginPayload, UserPayload} from '@expressModels/users/users';
import {BAD_REQUEST, UNAUTHORIZED, DEFAULT_INTERNAL_ERROR} from '@app/api/constants/errors/errors.constant';


export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('JWT');
}

export const saveTokenToLocalStorage = (token : string ) : void => {
  localStorage.setItem('JWT', token);
}

export const  getAuthHeaders = (): HeadersInit => {
  const token = getTokenFromLocalStorage();
  return token
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export const clearTokenFromLocalStorage = (): void => {
  localStorage.removeItem('JWT');
}

export const logout = () : void => {
  clearTokenFromLocalStorage();
  window.location.href = '/login';
}

export const login = async ( userLoginPayload: UserLoginPayload ): Promise<Response | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(userLoginPayload),
  };

  try {
    const response = await fetch('/api/login', requestOptions);
    if( response.status === 400) {
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
    console.error('Login error:', error);
    throw error;
  }
}

export const register = async (userPayload: UserPayload): Promise<Response | Error> => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(userPayload),
  };

  try {
    const response = await fetch('/api/register', requestOptions);

    if (response.status === 400) {
      const errorMessage = await response.json();
      return new Error(errorMessage.error || BAD_REQUEST);
    }

    if (response.status === 500) {
      return new Error(DEFAULT_INTERNAL_ERROR);
    }

    return await response.json();

  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export const getCurrentUserFromToken = async () => {
  const headers = getAuthHeaders();
  const requestOptions: RequestInit = {
    method: 'OPTIONS',
    headers,
  };
  try {
    const response = await fetch('/api/health', requestOptions);
    if (response.status === 401) {
      return null
    }

    const token = getTokenFromLocalStorage();
    if (!token) {
      return null;
    }

    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const user : UserAttributes = JSON.parse(decodedPayload);

    return user;

  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}
