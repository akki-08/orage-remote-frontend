import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { backendUrl } from '../constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static accessToken: string | undefined = undefined;
  refresh = false;

  constructor(private http: HttpClient) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      request.url.includes(
        'https://raw.githubusercontent.com/oragetech/about-projects/main/Orage.Host.bat'
      )
    ) {
      // Pass the original request without modification
      return next.handle(request);
    }
    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`,
      },
    });

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.refresh) {
          this.refresh = true;
          return this.http
            .post(`${backendUrl}/0auth/refresh`, {}, { withCredentials: true })
            .pipe(
              switchMap((payload: any) => {
                AuthInterceptor.accessToken = payload.accessToken;
                return next.handle(
                  request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${AuthInterceptor.accessToken}`,
                    },
                  })
                );
              })
            );
        }
        this.refresh = false;
        return throwError(() => err);
      })
    );
  }
}
