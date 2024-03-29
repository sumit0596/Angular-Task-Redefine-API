import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],

})
export class PropertyDetailsComponent {

  @Output() nextTabSwitch = new EventEmitter()

  constructor(private pl: PropertiesService,
    private dropdowns: DropdownListService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  BuildingCode: any;
  PropertyId: any;

  sectorList: any[] = []
  provinceList: any[] = []
  attributes: any[] = []
  propertyDetailsSt: any;
  propertyDetailsList: any;
  mdaStatus: any;

  detailsFilter: any = {
    BuildingCode: ''
  }


  sectorSelect: any;
  provinceSelect: any;
  atributesSelect: any[] = [];


  color: ThemePalette = 'accent';
  basementChecked: boolean = false;
  shadedChecked: boolean = false;
  openBaysChecked: boolean = false;
  activatedTabsIndex: number = 1;
  disabled = true
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




  propertyDetailsForm = new FormGroup({
    BuildingCode: new FormControl(''),
    PropertyName: new FormControl('', Validators.required),
    SectorId: new FormControl({ value: '', disabled: true }),
    Grade: new FormControl(''),
    Gla: new FormControl('', [Validators.required]),
    WebsiteUrl: new FormControl(''),
    PropertyDescription: new FormControl(''),
    Latitude: new FormControl('', [Validators.required]),
    Longitude: new FormControl('', [Validators.required]),
    City: new FormControl('', Validators.required),
    PostCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    Suburb: new FormControl('', Validators.required),
    Address: new FormControl('', Validators.required),
    Province: new FormControl('', Validators.required),
    Country: new FormControl('South Africa'),
    ParkingRatio: new FormControl('', Validators.required),
    BasementBays: new FormControl({ value: '', disabled: true }),
    ShadedBays: new FormControl({ value: '', disabled: true }),
    OpenBays: new FormControl({ value: '', disabled: true }),
    AnnualFootCount: new FormControl(''),
    AnchorTenant: new FormControl(''),
    TotalTenants: new FormControl(''),
    PropertyAttributes: new FormControl(''),
  })


  ngOnInit() {
    const rr = this.pl.getBuildingCode()
    this.detailsFilter.BuildingCode = rr
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.getSectorList();
      this.getProvinceList();
      this.getAttributeLits();
      this.getDetailsProperty();
      this.getPropertyMdaDetails()
    }, 2000)

  }



  getSectorList() {
    this.dropdowns.sectorList().subscribe((sector: any) => {
      this.sectorList = sector.data
    })
  }

  getProvinceList() {
    this.dropdowns.provinceList().subscribe((province: any) => {
      this.provinceList = province.data
    })
  }

  getAttributeLits() {
    this.dropdowns.propertyAttributrListing().subscribe((attributes: any) => {
      this.attributes = attributes.data
    })
  }

  getPropertyMdaDetails() {
    if (this.detailsFilter.BuildingCode !== null) {
      this.pl.mdaGetProperty(this.detailsFilter).subscribe({
        next: (mdaDetails: any) => {
          this.propertyDetailsForm.patchValue(mdaDetails.data.details)
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
          }
        }
      })
    }
  }


  getFormData() {
    if (this.propertyDetailsForm.valid) {
      this.pl.addPropertyStep1(this.propertyDetailsForm.value).subscribe((res: any) => {
        this.mdaStatus = res.status;
        if (res.status === 'success') {
          localStorage.setItem('PropertyId', res.data.PropertyId);
          this.getDetailsProperty();
          this.toastr.success(res.message);
          this.nextTabSwitch.emit(this.activatedTabsIndex);
        }
      })
    } else {
      this.validateForm();
    }

  }


  getDetailsProperty() {
    const propertyId = localStorage.getItem('PropertyId');
    if (propertyId !== null) {
      localStorage.removeItem('buildingCode')
      this.pl.propertyDetails(propertyId).subscribe((pd: any) => {
        this.propertyDetailsSt = pd.status;
        this.propertyDetailsList = pd.data.details

        this.propertyDetailsForm.patchValue(pd.data.details)

        this.atributesSelect = [];
        pd.data['PropertyAttributes'].forEach((PropertyAttributes: any) => {
          this.atributesSelect.push(PropertyAttributes.Id);
        });

        const BasementBays = pd.data?.details['BasementBays']
        const ShadedBays = pd.data?.details['ShadedBays']
        const OpenBays = pd.data?.details['OpenBays']


        if (BasementBays !== '0.00') {
          this.basementChecked = true;
          this.propertyDetailsForm.get('BasementBays')?.enable();
        }

        if (ShadedBays !== '0.00') {
          this.shadedChecked = true;
          this.propertyDetailsForm.get('ShadedBays')?.enable();
        }

        if (OpenBays !== '0.00') {
          this.openBaysChecked = true;
          this.propertyDetailsForm.get('OpenBays')?.enable();
        }
      })
    }
  }

  itemSelected(e: any) {
    // console.log(e)
  }

  buttonToggle(f: MatSlideToggleChange, toggleType: string) {

    switch (toggleType) {
      case 'basementChecked':
        this.basementChecked = f.checked;
        if (this.basementChecked) {
          this.propertyDetailsForm.get('BasementBays')?.enable();
        } else {
          this.propertyDetailsForm.get('BasementBays')?.disable();
        }
        break;
      case 'shadedChecked':
        this.shadedChecked = f.checked;
        if (this.shadedChecked) {
          this.propertyDetailsForm.get('ShadedBays')?.enable();
        } else {
          this.propertyDetailsForm.get('ShadedBays')?.disable();
        }
        break;
      case 'openBaysChecked':
        this.openBaysChecked = f.checked;
        if (this.openBaysChecked) {
          this.propertyDetailsForm.get('OpenBays')?.enable();
        } else {
          this.propertyDetailsForm.get('OpenBays')?.disable();
        }
        break;
      default:
        break;
    }

  }


  updateFormData() {
    const propertyId = localStorage.getItem('PropertyId');
    if (this.propertyDetailsForm.valid) {
      this.pl.updatePropertyStep1(this.propertyDetailsForm.value, propertyId).subscribe((res: any) => {
        this.mdaStatus = res.status;
        if (res.status === 'success') {
          this.toastr.success(res.message);
          this.nextTabSwitch.emit(this.activatedTabsIndex);
        }
      })
    } else {
      this.validateForm();
    }
  }


  validateForm() {
    Object.values(this.propertyDetailsForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }



}
