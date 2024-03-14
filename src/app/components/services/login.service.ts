import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${environment.apiBaseUrl}/user/login`;
  

  constructor(private http: HttpClient) { }

  userAuth(d: any): Observable<any> {
    const params = new HttpParams().set('ApiToken', environment.apiToken);
    const body = d;
    return this.http.post(this.apiUrl, body, { params });
  }

  getToken(): any{
    return localStorage.getItem('Token');
  }

  isLoggedIn(){
    return this.getToken() !== null;
  }

  userLogout(){
    localStorage.removeItem('Token')
    localStorage.removeItem('UserId')
  }
 
  
}
