import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  // Añadir withCredentials a todas las peticiones
  const authReq = req.clone({
    withCredentials: true,
  });

  // Salir temprano si estamos en rutas de login o register
  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(authReq);
  }

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Excluir la ruta de refresh para evitar bucles infinitos
        if (authReq.url.includes('/refresh')) {
          authService.logout();
          return throwError(() => error);
        }

        if (isRefreshing) {
          // Si ya se está refrescando el token, esperar a que termine
          return authService
            .waitForTokenRefresh()
            .pipe(switchMap(() => next(authReq)));
        }

        isRefreshing = true;
        return authService.refresh().pipe(
          switchMap(() => {
            isRefreshing = false;
            authService.notifyTokenRefreshed();
            return next(authReq);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
