import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from '@routes/app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { loaderInterceptor } from '../services/loader/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideClientHydration(withEventReplay())
  ]
};
