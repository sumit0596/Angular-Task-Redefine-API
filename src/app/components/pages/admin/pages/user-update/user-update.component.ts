import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiServicesService } from 'src/app/components/services/api-services.service';
import { UserListService } from 'src/app/components/services/user-list.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment: any = _moment;

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
  providers: [DatePipe]

})
export class UserUpdateComponent {

  d: any;

  optionValue: any;
  getFormValues: any;

  sectors: any[] = [];
  areas: any[] = [];
  psInterest: any[] = [];
  subscription: any[] = [];

  sectorsSelected: any[] = []

  sectorsSelect: any[] = []
  areasSelect: any[] = []
  psInterestSelect: any[] = []
  subscriptionSelect: any[] = []

  dateOfBirth: any;
  showBrokerExpanded: boolean = false;
  selectedDate: any;
  datetest: any


  constructor(private router: ActivatedRoute,
    private route: Router,
    private userlist: UserListService,
    private fieldValues: ApiServicesService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');

  }

  ngOnInit() {
    this.d = this.router.snapshot.params['id'];
    this.userlist.userDetailsGet(this.d).subscribe((res: any) => {
      this.getFormValues = res.data;

      console.log('update:', this.getFormValues)
      this.updateForm.patchValue({
        FirstName: res.data['FirstName'],
        LastName: res.data['LastName'],
        Email: res.data['Email'],
        CellNumber: res.data['CellNumber'],
        RoleId: res.data['RoleId'],
        Status: '1',
        Dob:res.data['Dob'],
        CompanyName: res.data['CompanyName'],
        OfficeNumber: res.data['OfficeNumber'],
        Sector: '',
        Areas: '',
        PersonalInterest: '',
        SubscriptionPreferences: ''
      });

      const datetest = res.data.Dob;


      const dateObject = moment(datetest, 'DD-MM-YYYY').toDate();
      this.selectedDate = new FormControl(new Date(dateObject));


      if (this.getFormValues.RoleName === 'Broker') {
        this.showBrokerExpanded = true;
      }

      res.data['Sector'].forEach((sector: any) => {
        this.sectorsSelect.push(sector.Id);
      });

      res.data['Areas'].forEach((area: any) => {
        this.areasSelect.push(area.Id);
      });

      res.data['PersonalInterest'].forEach((personalInterest: any) => {
        this.psInterestSelect.push(personalInterest.Id);
      });

      res.data['SubscriptionPreferences'].forEach((subscriptionPreference: any) => {
        this.subscriptionSelect.push(subscriptionPreference.Id);
      });


      this.fieldValues.getValues().subscribe(([sectors, areas, personalInterest, subscription]) => {
        this.sectors = sectors.data
        this.areas = areas.data
        this.psInterest = personalInterest.data;
        this.subscription = subscription.data

      })

    })
    // this.fieldValue()
  }


  updateForm = new FormGroup({
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    CellNumber: new FormControl('', [Validators.required]),
    RoleId: new FormControl('', [Validators.required]),
    Status: new FormControl('1'),
    CompanyName: new FormControl('', [Validators.required]),
    OfficeNumber: new FormControl('', [Validators.required]),
    Dob: new FormControl('', [Validators.required]),
    Sector: new FormControl('', [Validators.required]),
    Areas: new FormControl('', [Validators.required]),
    PersonalInterest: new FormControl('', [Validators.required]),
    SubscriptionPreferences: new FormControl('', [Validators.required]),

  })



  datePick(e: MatDatepickerInputEvent<Date>) {
    const formattedDate = this.datePipe.transform(e.value, 'dd-MM-yyyy');
    this.selectedDate = this.updateForm.controls['Dob'].setValue(formattedDate);
    console.log(formattedDate);
  }


  updateUser() {
    console.log('data', this.updateForm.value)
    const formValues = this.updateForm.value;



    this.userlist.userUpdateDetails(this.d, formValues).subscribe((up: any) => {
      // console.log(up)
      this.toastr.success(up.message);
    })
    this.route.navigate(['/admin/user-manage']);
  }

  itemSelected(e: any) {
    console.log(e)
  }

  toggleOptionValue() {
    const selectedRoleId: any = this.updateForm.get('RoleId')?.value;
    this.showBrokerExpanded = selectedRoleId === '2';

    // console.log(this.showBrokerExpanded)
    this.getFormValues = '';
  }
}
