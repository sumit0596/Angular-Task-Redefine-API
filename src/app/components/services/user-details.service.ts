import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private apiUrl = `${environment.apiBaseUrl}/user/details/`;


  constructor(private http: HttpClient) { }

  
  userData(): Observable<any>{
    const usrId = localStorage.getItem('UserId');
    const url = `${this.apiUrl}${usrId}`;
    const params = new HttpParams().set('ApiToken', environment.apiToken);
    return this.http.get(url, { params });
  }




}
