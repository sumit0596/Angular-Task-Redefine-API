import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertiesService } from 'src/app/components/services/properties.service';

@Component({
  selector: 'app-peoperty-confirm',
  templateUrl: './peoperty-confirm.component.html',
  styleUrls: ['./peoperty-confirm.component.css']
})
export class PeopertyConfirmComponent {

  constructor(private pl : PropertiesService,
    private route: ActivatedRoute){}

  getDetailsData:any ;
  getPropertyAttributes:any
  getPropertyMedia:any
  getPropertyEsg:any
  getPropertyFeatureamenities:any;

  viewUnitPage : boolean = false;

  ngOnInit(){
    this.getPropertyConfrim()
    this.viewUnit();
    
  }




  getPropertyConfrim(){
    const propertyId = localStorage.getItem('PropertyId');

    this.pl.propertyConfirm(propertyId).subscribe((cnf:any)=>{
     
      this.getDetailsData = cnf.data.details
      this.getPropertyAttributes = cnf.data.attributes
      this.getPropertyFeatureamenities = cnf.data.featureamenities
      this.getPropertyMedia = cnf.data.media
      this.getPropertyEsg = cnf.data.esgfeatures
    })
  }

  getFileName(url: string): string {
    const parts = url.split('/');
    let fileName = parts[parts.length - 1];
    const cleanFileName = fileName.replace(/^Image-\d+-/, '');
    return cleanFileName;
  }


  viewUnit(){
    this.route.queryParams.subscribe(params => {
      if (params['pageData']) {
        const pageData = JSON.parse(params['pageData']);
        if(pageData === 'selectView'){
          this.viewUnitPage = true
        }
      }
    
    })
  }
}
