import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http'; // Import this

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(withInterceptors([(req: HttpRequest<unknown>, next: HttpHandlerFn) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    }]))
  ]
};
