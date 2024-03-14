import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthsectionInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //  debugger;
   const token = localStorage.getItem('Token');
   const userId = localStorage.getItem('UserId');
   const newCloneReq = request.clone({
    setHeaders: {
      authorization : `Bearer ${token}`,
      userId : `${userId}`
    }
   })
    return next.handle(newCloneReq);
  }
}
