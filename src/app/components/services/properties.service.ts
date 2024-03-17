import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  private buildingCode: string = '';
  details:any[]=[]
  
  private getUnitId: any;

  setBuildingCode(code: string) {
    this.buildingCode = code;
    if (localStorage) {
      localStorage.setItem('buildingCode', code);
    }
  }

  getBuildingCode() {
    return this.buildingCode;
  }
  

  private apiUrl = `${environment.apiBaseUrl}/property`;
  private mdaApiUrl = `${environment.apiBaseUrl}/mda/property/details`;


  constructor(private http: HttpClient) {
    this.buildingCode = this.getTheBuildingCode()
  }

  get unitId(): any {
    return this.getUnitId;
  }

  set unitId(value: any) {
    this.getUnitId = value;
    localStorage.setItem("unitId", value);
  }

  propertyList(payload: any): Observable<any> {
    let params = new HttpParams()
      .set('ApiToken', environment.apiToken)


    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http.get(this.apiUrl + '/list',  { params })
  }


  mdaGetProperty(payload: any): Observable<any> {

    let params = new HttpParams()
      .set('ApiToken', environment.apiToken)

    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http.get(this.mdaApiUrl, { params })
  }

  private getTheBuildingCode(): any {
    return localStorage.getItem('buildingCode');
  }

  addPropertyStep1(payload:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);

    
    return this.http.post(this.apiUrl + '/add/step1', payload, { params });

  }

  updatePropertyStep1(payload:any,id:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);

    
    return this.http.put(this.apiUrl + `/update/step1/${id}`, payload, { params });

  }

  propertyDetails(piid:any){
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.apiUrl+ `/details/${piid}`, { params })
  }

  uploadPropertyImages(val:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)
    
  
    return this.http.post(this.apiUrl+ '/uploadfile',val, { params })
  }

  uploadPropertyMediaLink(payload:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)
    
  
    return this.http.post(this.apiUrl+ '/add/link',payload, { params })
  }


  propertyImagesDelete(del:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)
    
  
    return this.http.delete(this.apiUrl+ `/file/delete/${del}`, { params })
  }

  propertyImagesPosition(move:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)
    
  
    return this.http.post(this.apiUrl+ `/file/position`,move, { params })
  }

  addPropertyStep3(val:any, piid:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.put(this.apiUrl+ `/add/step3/${piid}`,val, { params })
  }

  addPropertyFeatureAmenities(payload:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.put(this.apiUrl+ `/add/addupdatefeatureamenities`,payload, { params })
  }

  addPropertyEsg(payload:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.post(this.apiUrl+ `/add/esgfeatures`,payload, { params })
  }

  propertyFetch(): Observable<any> {
    const propertyId = localStorage.getItem('PropertyId');
    return this.propertyDetails(propertyId);

  }

  propertyConfirm(id:any): Observable<any> {
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.apiUrl+ `/confirmation/${id}`, { params })

  }

  propertyUnitList(payload:any): Observable<any> {
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http.get(this.apiUrl+ `/unit/list`, { params })
  } 

  propertyUnitStatusChange(payload:any): Observable<any> {
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)


    return this.http.post(this.apiUrl+ `/unit/statusupdate`,payload, { params })
  } 

  propertyUnitDetails(unitId:number): Observable<any> {
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken)

    return this.http.get(this.apiUrl+ `/unit/details/${unitId}`, { params })
  } 

  propertyUnitAddStep1(payload:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);

    
    return this.http.post(this.apiUrl + `/unit/add`, payload, { params });

  }


  propertyUnitUpdateStep1(payload:any,id:any): Observable<any>{
    let params = new HttpParams()
    .set('ApiToken', environment.apiToken);

    
    return this.http.put(this.apiUrl + `/unit/update/${id}`, payload, { params });

  }



}
