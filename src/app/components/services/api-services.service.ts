import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiServicesService {


  private apiUrl = `${environment.apiBaseUrl}/adminleftmenu/list`;
  private roleUrl = `${environment.apiBaseUrl}/role/listing`;
  private valuesUrl = `${environment.apiBaseUrl}/sector/list`;
  private areaUrl = `${environment.apiBaseUrl}/area/list`;
  private personalIntUrl = `${environment.apiBaseUrl}/personal_interest/list`;
  private subscriptionIntUrl = `${environment.apiBaseUrl}/subscription_preference/list`;



  constructor(private http: HttpClient) { }

  getMenu(): Observable<any> {
    const params = new HttpParams().set('ApiToken', environment.apiToken);
    return this.http.get<any>(this.apiUrl, { params });

  }

  getRole(): Observable<any> {
    const params = new HttpParams().set('ApiToken', environment.apiToken);
    return this.http.get<any>(this.roleUrl, { params });
  }

  getValues(): Observable<any> {
    const params = new HttpParams().set('ApiToken', environment.apiToken);
    const sector = this.http.get<any>(this.valuesUrl, { params });
    const areas = this.http.get<any>(this.areaUrl, { params });
    const personalInterest = this.http.get<any>(this.personalIntUrl, { params });
    const subscription = this.http.get<any>(this.subscriptionIntUrl, { params });
    return forkJoin([sector, areas, personalInterest,subscription]);
  }

  
  attributeList(payload: any): Observable<any> {
    let params = new HttpParams()
      .set('ApiToken', environment.apiToken)


    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http.get(`${environment.apiBaseUrl}` + '/attributes/listing',  { params })
  }


  ngOninit() {

  }
}
