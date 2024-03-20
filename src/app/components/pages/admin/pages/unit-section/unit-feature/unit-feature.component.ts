import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from 'src/app/components/services/properties.service';

@Component({
  selector: 'app-unit-feature',
  templateUrl: './unit-feature.component.html',
  styleUrls: ['./unit-feature.component.css']
})
export class UnitFeatureComponent {



  constructor(private pl: PropertiesService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder) {
    this.propertyId = localStorage.getItem('PropertyId')
    this.unitId = localStorage.getItem('unitId')
  }

  objj: any = {
    PropertyId: '',
    PropertyUnitId: '',
    FeatureAmenitiesAddtionalDetails: '',
    FeaturesAmenitiesSectorId: ''
  }

  propertyId: any;
  featureForm!: FormGroup;
  htmlFieldLabel: any;
  checked: boolean = false;
  unitId: any;
  dataSet: any[] = [];
  sectionCheck: { [key: number]: boolean } = {};


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

  ngOnInit() {
    this.spinner.show();
    this.featureUnitForm();
    setTimeout(() => {
      this.spinner.hide();
      this.getFeatureAmenitiesByUnit();
      this.getUnitDetails();
    }, 2000)
  }

  featureUnitForm() {
    this.featureForm = this.fb.group({
      FeatureAmenitiesAddtionalDetails: new FormControl(''),
      FeaturesAmenitiesSectorId: new FormArray([]),
      Value: new FormArray([]),
    })
  }

  getFeatureAmenitiesByUnit() {
    this.pl.getPropertyFeatureAmenitiesForUnit(this.propertyId).subscribe({
      next: (res: any) => {
        this.htmlFieldLabel = res.data
        this.htmlFieldLabel.forEach((ff: any, index: number) => {
          (this.featureForm.get('Value') as FormArray).push(new FormControl(null));
          const vc = (this.featureForm.get('Value') as FormArray).at(index);
          vc.patchValue(ff.Value)
          this.checked = true
          this.sectionCheck[index] = true
          this.dataSet.push({
            FeaturesAmenitiesSectorId: ff.FeaturesAmenitiesSectorId
          });
        })
      }
    })
  }

  getUnitDetails() {
    if (this.unitId !== null) {
      this.pl.propertyUnitDetails(this.unitId).subscribe({
        next: (res: any) => {
          this.featureForm.patchValue(res.data.details)
        }, error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
    }
  }

  toggleDiv(e: any, id: any) {
    this.sectionCheck[id] = e.checked
  }

  featureData() {
    this.dataSet.forEach((data, index) => {

      const control = this.featureForm.get('Value') as FormArray;
      if (control && control.at(index)) {
        this.dataSet[index].Value = control.at(index).value;
      }
    });

    this.objj.FeatureAmenitiesAddtionalDetails = this.featureForm.value.FeatureAmenitiesAddtionalDetails
    this.objj.FeaturesAmenitiesSectorId = this.dataSet
    this.objj.PropertyId = this.propertyId
    this.objj.PropertyUnitId = this.unitId

    this.updateFeatureAmenitis(this.objj)
  }

  updateFeatureAmenitis(getUpdatedData: any) {
    this.pl.addPropertyFeatureAmenities(getUpdatedData).subscribe({
      next: (update: any) => {
        if (update.status === 'success') {
          this.toastr.success(update.message);
          this.router.navigate(['admin/view-property']);
        }
      }, error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  // clickYes(){
  //   localStorage.removeItem('unitId')
  //   this.router.navigate(['admin/create-unit']);
  // }
}
