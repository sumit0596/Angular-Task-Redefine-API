import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  private apiUrl = `${environment.apiBaseUrl}/user`;


 
  constructor(private http: HttpClient) { }

  userList( payload: any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);
    
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http.get(this.apiUrl + '/list', { params });
    
  }

  userListDelete( dl: any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);

    return this.http.delete(`${this.apiUrl}/delete/${dl}`, {params });

  }

  userDetailsGet(id:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);
    return this.http.get(this.apiUrl + `/details/${id}`, { params });
  }

  userUpdateDetails(id:any, payload: any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);


    return this.http.put(this.apiUrl + `/update/${id}`, payload, {params:params});
  }

}
