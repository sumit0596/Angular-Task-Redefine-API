import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PropertyCreateComponent } from '../../property-create.component';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-property-features',
  templateUrl: './property-features.component.html',
  styleUrls: ['./property-features.component.css']
})
export class PropertyFeaturesComponent {

  constructor(private pl: PropertiesService,
    private fieldslist: DropdownListService,
    private toastr: ToastrService) { }

  @Output() nextTabSwitch = new EventEmitter()
  activatedTabsIndex: number = 4;


  sectorId: any;
  propertyId : any
  htmlFieldLabel: any

  dynamicFieldStates: { [key: number]: boolean } = {};


  objj: any = {
    PropertyId: '',
    FeatureAmenitiesAddtionalDetails: ''
  }

  dataSet: any[] = [];
  fa: any

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '174px',
    minHeight: '100',
    maxHeight: '100',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
      ]
    ]
  };





  featureForm = new FormGroup({
    FeatureAmenitiesAddtionalDetails: new FormControl(''),
    Value: new FormArray([]),
  })


  ngOnInit() {
    this.getPropertyData();
  }

  getPropertyData() {
    this.pl.propertyFetch().subscribe((s: any) => {
      this.sectorId = s.data.details.SectorId
      this.propertyId = s.data.details.PropertyId
      this.fa = s.data.featureamenities.features
      // console.log(this.fa);
      
      this.fa.forEach((ff: any) => {
        if(ff.Checked === 1){
          this.dynamicFieldStates[ff.Id] = true;
        }
      })
      
      this.featureForm.patchValue({
        FeatureAmenitiesAddtionalDetails: s.data.featureamenities['FeatureAmenitiesAddtionalDetails']
    })

      this.getValues(this.fa.Id);
      this.getFeatureAmenitiesSector();
    });

  }


  getValues(FeaturesAmenitiesSectorId: number) {

    const matchingData = this.fa.find((data: any) => data.Id === FeaturesAmenitiesSectorId);

    if (matchingData) {
      return matchingData.Value;
    } else {
      return '';
    }
  }


  getFeatureAmenitiesSector() {
    this.fieldslist.featureAmenitiesSector(this.sectorId).subscribe((list: any) => {
      this.htmlFieldLabel = list.data
      this.htmlFieldLabel.forEach((ff: any) => {

        (this.featureForm.get('Value') as FormArray).push(new FormControl(null));

        this.dataSet.push({
          FeaturesAmenitiesSectorId: ff.FeaturesAmenitiesSectorId,
          Description: ff.Description,
        });
      })

    })
  }


  toggleDiv(checked: any, checkSection: number, index:any) {
    this.dynamicFieldStates[checkSection] = checked;
    
  }

  featureData() {

  
    this.dataSet.forEach((data, index) => {

      const control = this.featureForm.get('Value') as FormArray;
      if (control && control.at(index)) {
        this.dataSet[index].Value = control.at(index).value;
      }
    });

    const selectedData = this.dataSet.filter((data, index) => {
      return this.dynamicFieldStates[data.FeaturesAmenitiesSectorId];
      
    });

    
    this.objj.FeatureAmenitiesAddtionalDetails = this.featureForm.value.FeatureAmenitiesAddtionalDetails 
    this.objj.FeaturesAmenitiesSectorId =selectedData
    this.objj.PropertyId = this.propertyId

    // console.log(this.objj);
    
    this.pl.addPropertyFeatureAmenities(this.objj).subscribe((res:any)=>{
      if (res.status === 'success') {
        this.toastr.success(res.message);
        this.nextTabSwitch.emit(this.activatedTabsIndex);
      }
    })

  }

}
