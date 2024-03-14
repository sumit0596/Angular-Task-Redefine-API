import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownListService {

  private baseUrl = `${environment.apiBaseUrl}`;
  private sectorUrl = `${environment.apiBaseUrl}/sector/list`;
  private provinceUrl = `${environment.apiBaseUrl}/province/list`;
  private propertyUrl = `${environment.apiBaseUrl}/property`;


  constructor(private http: HttpClient) { }

  sectorList(): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.sectorUrl, {params})
  }

  provinceList(): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.provinceUrl, {params})
  }

  propertLeasingList(piid:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.propertyUrl + `/leasingexecutive/${piid}`, {params})
  }


  brokerLiaisonList(piid:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.propertyUrl + `/brokerliaison/${piid}`, {params})
  }

  featureAmenitiesSector(val:number): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.baseUrl+ `/featureamenitiessector/listing/${val}`, { params })
  }

  esgFeaturesListing(): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.baseUrl+ `/features/esgfeatureslisting`, { params })
  }

  propertyAttributrListing(): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.baseUrl+ `/attributes/list`, { params })
  }
}
