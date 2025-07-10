import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Interface para el payload de registro
 */
export interface RegisterPayload {
  username: string;
  email: string;
  password_hash: string;
  photo_profile_url?: string;
}

/**
 * Interface para los datos del formulario de registro
 */
export interface RegisterFormData {
  nombre: string;
  primerApellido: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo_profile_url?: string;
}

/**
 * Interface para la respuesta del registro
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Servicio para manejar el registro de usuarios
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/register';

  /**
   * Registra un nuevo usuario
   * @param payload Datos del usuario a registrar
   * @returns Observable con la respuesta del servidor
   */
  register(payload: RegisterPayload): Observable<RegisterResponse> {
    console.log('Enviando a:', this.apiUrl, 'Payload:', payload);
    
    return this.http.post<any>(this.apiUrl, payload)
      .pipe(
        map(response => {
          console.log('Respuesta exitosa:', response);
          return {
            success: true,
            message: 'Usuario registrado exitosamente',
            data: response
          };
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param error Error de HTTP
   * @returns Observable con el error formateado
   */
  private handleError = (error: HttpErrorResponse): Observable<RegisterResponse> => {
    console.log('Error HTTP completo:', error);
    console.log('Status:', error.status);
    console.log('Error body:', error.error);
    
    let errorMessage = 'Error al registrar usuario';
    
    // Simplificar el manejo de errores
    if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error && error.error.error) {
      errorMessage = error.error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({
      success: false,
      message: errorMessage,
      data: null
    }));
  };
}
