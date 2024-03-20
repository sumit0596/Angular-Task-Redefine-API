import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PropertyCreateComponent } from '../../property-create.component';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-property-features',
  templateUrl: './property-features.component.html',
  styleUrls: ['./property-features.component.css']
})
export class PropertyFeaturesComponent {

  constructor(private pl: PropertiesService,
    private fieldslist: DropdownListService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  @Output() nextTabSwitch = new EventEmitter()
  activatedTabsIndex: number = 4;

  unitId: any;
  sectorId: any;
  propertyId: any
  htmlFieldLabel: any

  inputFields: { [key: number]: boolean } = {};


  objj: any = {
    PropertyId: '',
    FeatureAmenitiesAddtionalDetails: ''
  }

  dataSet: any[] = [];
  features: any

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
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.getPropertyData();
    }, 2000)
  }

  getPropertyData() {
    this.pl.propertyFetch().subscribe((s: any) => {
      this.sectorId = s.data.details.SectorId
      this.propertyId = s.data.details.PropertyId
      this.features = s.data.featureamenities.features
      console.log(this.features);

      this.features.forEach((ff: any) => {
        if (ff.Checked === 1) {
          this.inputFields[ff.Id] = true;
        }
      })

      this.featureForm.patchValue(s.data.featureamenities)
      this.featureForm.patchValue(s.data.featureamenities.features)

      this.getValues(this.features.Id);
      this.getFeatureAmenitiesSector();
    });

  }


  getValues(FeaturesAmenitiesSectorId: number) {

    const matchingData = this.features.find((data: any) => data.Id === FeaturesAmenitiesSectorId);

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



  toggleDiv(checked: any, checkSection: number, index: any) {
    this.inputFields[checkSection] = checked;

  }

  featureData() {

    this.dataSet.forEach((data, index) => {

      const control = this.featureForm.get('Value') as FormArray;
      if (control && control.at(index)) {
        this.dataSet[index].Value = control.at(index).value;
      }
    });

    const selectedData = this.dataSet.filter((data, index) => {
      return this.inputFields[data.FeaturesAmenitiesSectorId];

    });

    this.objj.FeatureAmenitiesAddtionalDetails = this.featureForm.value.FeatureAmenitiesAddtionalDetails
    this.objj.FeaturesAmenitiesSectorId = selectedData
    this.objj.PropertyId = this.propertyId

    this.pl.addPropertyFeatureAmenities(this.objj).subscribe((res: any) => {
      if (res.status === 'success') {
        this.toastr.success(res.message);
        this.nextTabSwitch.emit(this.activatedTabsIndex);
      }
    })

  }

}
