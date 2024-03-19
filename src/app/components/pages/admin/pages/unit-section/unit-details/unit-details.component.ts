import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.css'],
  providers: [DatePipe]
})
export class UnitDetailsComponent {

  constructor(private dw: DropdownListService,
    private pl: PropertiesService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private dateAdapter: DateAdapter<Date>) {
    this.unitId = localStorage.getItem('unitId')
    this.propertyId = localStorage.getItem('PropertyId')
    this.dateAdapter.setLocale('en-GB')
  }

  ngOnInit() {
    this.getIncentivesListing();
    this.getUnitDetails();
    this.unitForm();
  }



  unitCreateform!: FormGroup;
  unitId: any;
  propertyId: any;
  premisesList = [
    { id: 0, name: 'Premises' },
    { id: 1, name: 'White boxed' },
    { id: 2, name: 'TBC' },
  ];

  accessList = [
    { id: 0, name: 'Arrangements to be made prior to viewing' },
    { id: 1, name: 'Arrangements to be made prior to viewing with sufficient notice' },
    { id: 2, name: 'Keys on site with Building Manager' },
    { id: 3, name: 'Keys on site with Centre Management' },
    { id: 4, name: 'Keys on site with security' },
    { id: 5, name: 'Others' },
  ];

  percentageList = [
    { id: 1, value: '6%' },
    { id: 2, value: '6.25%' },
    { id: 3, value: '6.75%' },
    { id: 4, value: '7%' },
    { id: 5, value: '7.25%' },
    { id: 6, value: '7.50%' },
    { id: 7, value: '7.75%' },
    { id: 8, value: '8%' },
    { id: 9, value: '8.25%' },
    { id: 10, value: '8.50%' },
    { id: 11, value: '8.75%' },
    { id: 12, value: '9%' },
    { id: 13, value: '9.25%' },
    { id: 14, value: '9.50%' },
    { id: 15, value: '9.75%' },
    { id: 16, value: '10%' },
    { id: 17, value: '10.25%' },
    { id: 18, value: '10.50%' },
    { id: 19, value: '10.75%' },
    { id: 20, value: '11%' },
    { id: 21, value: '11.25%' },
    { id: 22, value: '11.50%' },
    { id: 23, value: '11.75%' },
    { id: 24, value: '12%' }
  ];

  incentiveList = [
    { id: 1, value: '100%' },
    { id: 2, value: '105%' },
    { id: 3, value: '110%' },
    { id: 4, value: '115%' },
    { id: 5, value: '120%' },
    { id: 6, value: '125%' },
    { id: 7, value: '130%' },
    { id: 8, value: '135%' },
    { id: 9, value: '140%' },
    { id: 10, value: '145%' },
    { id: 11, value: '150%' },
    { id: 12, value: '155%' },
    { id: 13, value: '160%' },
    { id: 14, value: '165%' },
    { id: 15, value: '170%' },
    { id: 16, value: '175%' },
    { id: 17, value: '180%' },
    { id: 18, value: '185%' },
    { id: 19, value: '190%' },
    { id: 20, value: '195%' },
    { id: 21, value: '200%' },
    { id: 22, value: '205%' },
    { id: 23, value: '210%' },
    { id: 24, value: '215%' },
    { id: 25, value: '220%' },
    { id: 26, value: '225%' },
    { id: 27, value: '230%' },
    { id: 28, value: '235%' },
    { id: 29, value: '240%' },
    { id: 30, value: '245%' },
    { id: 31, value: '250%' },
    { id: 32, value: '255%' },
    { id: 33, value: '260%' },
    { id: 34, value: '265%' },
    { id: 35, value: '270%' },
    { id: 36, value: '275%' },
    { id: 37, value: '280%' },
    { id: 38, value: '285%' },
    { id: 39, value: '290%' },
    { id: 40, value: '295%' },
    { id: 41, value: '300%' }
  ];

  incentiveListing: any

  togglechecked: boolean = false;
  toggleFields: boolean = false;
  showFileds: boolean = false;

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

  getIncentivesListing() {
    this.dw.incentivesListing().subscribe((list: any) => {
      this.incentiveListing = list.data
    })
  }

  getUnitDetails() {
    if (this.unitId !== null) {
      this.pl.propertyUnitDetails(this.unitId).subscribe({
        next: (res: any) => {
          this.unitCreateform.patchValue(res.data.details)
          this.unitCreateform.markAsUntouched()
          res.data.details.CIDLevey !== null ? (this.unitCreateform.get('CIDLevey')?.enable(), this.togglechecked = true) : (this.unitCreateform.get('CIDLevey')?.disable(), this.togglechecked = false);
          res.data.details.NetRental !== null ? (this.showFileds = true, this.toggleFields = true) : (this.showFileds = false, this.toggleFields = false)

        }, error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
    }
  }


  itemSelected(e: any) {
    // console.log(e);
  }

  unitForm() {
    this.unitCreateform = this.fb.group({
      PropertyId: new FormControl(this.propertyId),
      NameAndLocation: new FormControl('', [Validators.required]),
      UnitSize: new FormControl('', [Validators.required, Validators.pattern('^[0-9.]*$')]),
      Type: new FormControl(''),
      UnitAvailableDate: new FormControl('') || null,
      UnitDescription: new FormControl(''),
      BaseRental: new FormControl('', [Validators.required, Validators.pattern('^[0-9.]*$')]),
      BasementBays: new FormControl('', [Validators.required, Validators.pattern('^[0-9.]*$')]),
      Rates: new FormControl('', [Validators.required, Validators.pattern('^[0-9.]*$')]),
      CIDLevey: new FormControl('', [Validators.required, Validators.pattern('^[0-9.]*$')]),
      GrossRental: new FormControl(''),
      AccessId: new FormControl(''),
      AddtionalInformation: new FormControl(''),
      TenentAllowance: new FormControl(''),
      PropertyIncentives: new FormControl(['']),
      NetRental: new FormControl('', [Validators.required]),
      OperationalCost: new FormControl('', [Validators.required]),
      ThreeYearsLease: new FormControl(''),
      FiveYearsLease: new FormControl(''),
      BrokerIncentives: new FormControl(''),
      CommentDisclaimers: new FormControl(''),
    })
  }

  inputToggle(e: any) {
    this.togglechecked = e.checked;
    this.togglechecked === true ? this.unitCreateform.get('CIDLevey')?.enable() : this.unitCreateform.get('CIDLevey')?.disable();
  }

  createUnit() {
    this.unitCreateform.valid ? console.log(this.unitCreateform.value) : this.unitCreateform.markAllAsTouched();
    if (this.unitId !== null) {
      this.updateForm();
    } else {
      this.pl.propertyUnitAddStep1(this.unitCreateform.value).subscribe({
        next: (add: any) => {
          console.log(add);
          if (add.status === 'success') {
            this.toastr.success(add.message);
          }
        }, error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
    }
  }

  updateForm() {
    this.pl.propertyUnitUpdateStep1(this.unitCreateform.value, this.unitId).subscribe({
      next: (update: any) => {
        console.log(update);
        if (update.status === 'success') {
          this.toastr.success(update.message);
        }
      }, error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  toggleForm(e: any) {
    e === true ? this.toggleFields = true : this.toggleFields = false;
  }

  selectedDate(e: MatDatepickerInputEvent<Date>) {
    const datePick = this.datePipe.transform(e.value, 'yyyy-MM-dd');
    this.unitCreateform.get('UnitAvailableDate')?.setValue(datePick)
  }

  createNewincentive() {
    localStorage.removeItem('IncentiveId')
    this.router.navigate(['admin/create-incentives']);
  }
}
