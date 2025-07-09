import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

// Contador global de peticiones activas
let activeRequests = 0;

// Mensajes de carga por endpoint
const loadingMessages: { [key: string]: string } = {
  '/medicinesRequired': 'Cargando medicinas requeridas...',
  '/medicines': 'Cargando medicinas...',
  '/clients': 'Cargando clientes...',
  '/doctors': 'Cargando médicos...',
  '/diagnostics': 'Cargando diagnósticos...',
  '/users': 'Cargando usuarios...',
  'POST': 'Guardando información...',
  'PUT': 'Actualizando información...',
  'DELETE': 'Eliminando registro...'
};

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  
  // Incrementar contador de peticiones activas
  activeRequests++;
  
  // Determinar el mensaje basado en la URL o método
  const message = getLoadingMessage(req);
  
  // Mostrar loader si es la primera petición
  if (activeRequests === 1) {
    loaderService.show(message);
  } else {
    loaderService.updateMessage(message);
  }

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          // Actualizar mensaje cuando la respuesta es exitosa
          loaderService.updateMessage('Completado');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error en la petición HTTP:', error);
        loaderService.updateMessage('Error en la solicitud');
      }
    }),
    finalize(() => {
      // Decrementar contador de peticiones activas
      activeRequests--;
      
      // Ocultar loader si no hay más peticiones activas
      if (activeRequests === 0) {
        setTimeout(() => {
          loaderService.hide();
        }, 200);
      }
    })
  );
};

function getLoadingMessage(req: HttpRequest<any>): string {
  // Buscar mensaje por URL
  for (const [path, message] of Object.entries(loadingMessages)) {
    if (req.url.includes(path) && path !== 'POST' && path !== 'PUT' && path !== 'DELETE') {
      return message;
    }
  }

  // Buscar mensaje por método HTTP
  if (loadingMessages[req.method]) {
    return loadingMessages[req.method];
  }

  // Mensaje por defecto
  return 'Procesando solicitud...';
}
