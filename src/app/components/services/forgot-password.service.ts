import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private apiUrl = `${environment.apiBaseUrl}/user/forgot-password`;

  constructor(private http: HttpClient) { }

  userForgotPass(fpass: any): Observable<any> {
    const params = new HttpParams().set('ApiToken', environment.apiToken);
    const body = fpass;
    return this.http.post(this.apiUrl, body, { params });
  }
}
