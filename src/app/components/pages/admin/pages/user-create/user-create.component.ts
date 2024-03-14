import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from 'src/app/components/services/api-services.service';
import { UserCreateService } from 'src/app/components/services/user-create.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  providers: [DatePipe]
})
export class UserCreateComponent {
  optionValue: any;
  sectors: any[] = [];
  areas: any[] = [];
  psInterest: any[] = [];
  subscription: any[] = [];
  dateOfBirth: any;
  selectedDate: any;

  constructor(private toastr: ToastrService,
    private useradd: UserCreateService,
    private router: Router,
    private fieldValues: ApiServicesService,
    private datePipe: DatePipe,
    private dateAdapter: DateAdapter<Date>) { 
      this.dateAdapter.setLocale('en-GB')
    }

  // filter: any = {
  //     FirstName: '',
  //     LastName: '',
  //     Email: '',
  //     CellNumber: '',
  //     RoleId: '',
  //   }


  sectorsSelect: number | undefined;
  areasSelect: number | undefined;
  psInterestSelect: number | undefined;
  subscriptionSelect: number | undefined;



  ngOnInint() {

    this.createUser()
  }

  createForm = new FormGroup({
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    CellNumber: new FormControl('', [Validators.required]),
    RoleId: new FormControl('', [Validators.required]),
    CompanyName: new FormControl('', [Validators.required]),
    OfficeNumber: new FormControl('', [Validators.required]),
    Dob: new FormControl('', [Validators.required]),
    Sector: new FormControl('', [Validators.required]),
    Areas: new FormControl('', [Validators.required]),
    PersonalInterest: new FormControl('', [Validators.required]),
    SubscriptionPreferences: new FormControl('', [Validators.required]),
  })

  fieldValue() {
    this.fieldValues.getValues().subscribe(([sectors, areas, personalInterest, subscription]) => {
      this.sectors = sectors.data
      this.areas = areas.data
      this.psInterest = personalInterest.data;
      this.subscription = subscription.data
      // console.log(this.sectors)

    })
  }


  datePick(e: MatDatepickerInputEvent<Date>) {
    const formattedDate = this.datePipe.transform(e.value, 'dd-MM-yyyy');
    this.selectedDate = this.createForm.controls['Dob'].setValue(formattedDate);
    console.log(formattedDate);
  }


  createUser() {
    // console.log(this.createForm.value)

      this.useradd.userCreate(this.createForm.value).subscribe((res: any) => {
        // console.log(res)
        this.toastr.success(res.message);
        this.router.navigate(['/admin/user-manage']);

      })
   
      // this.toastr.warning('Form is invalid. Please check your input.');
  
  }

  onRoleChange() {
    this.optionValue = this.createForm.get('RoleId')?.value;
  }

  selectorValues() {
    this.fieldValue()
  }

  itemSelected(e: any) {
    console.log(e)
  }


}
