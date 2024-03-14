import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCreateService {

  private apiUrl = `${environment.apiBaseUrl}/user/register`;

  constructor(private http: HttpClient) { }

  userCreate(payload: any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);

       
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    
    // console.log(payload)

    return this.http.post(this.apiUrl, payload, { params });

  }

  


}
