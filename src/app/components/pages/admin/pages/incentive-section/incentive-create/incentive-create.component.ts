import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incentive-create',
  templateUrl: './incentive-create.component.html',
  styleUrls: ['./incentive-create.component.css'],
})
export class IncentiveCreateComponent {

  constructor(private fb: FormBuilder,
    private pl: PropertiesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router) {
    this.incentiveId = localStorage.getItem('IncentiveId')
  }

  public files: NgxFileDropEntry[] = [];
  brochureFileName: any
  termAndConditionFileName: any
  incentiveId: any;
  incentiveForm!: FormGroup
  value: any
  getDatailList: any;

  deletItem:any ={
    Type:''
  }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      this.getIncentiveDetails();
    }, 2000);
    this.getIncentiveForm();

  }


  getIncentiveDetails() {
    if (this.incentiveId !== null) {
      this.pl.incentivetDetails(this.incentiveId).subscribe({
        next: (res: any) => {
          console.log(res);
          this.getDatailList = res.data;
          this.incentiveForm.patchValue(res.data)
        }
      })
    }
  }

  getIncentiveForm() {
    this.incentiveForm = this.fb.group({
      Title: new FormControl('', [Validators.required]),
      AdditionalInformation: new FormControl(''),
      Visibility: new FormControl('', [Validators.required]),
      Brochure: new FormControl(null),
      TermAndCondition: new FormControl(null),
    })
  }

  dropped(files: NgxFileDropEntry[], arrgs: string) {
    this.files = files

    for (const droppedFile of files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          arrgs === 'Brochure' ? (this.brochureFileName = fileEntry.name, this.incentiveForm.get('Brochure')?.setValue(file)) : null;
          arrgs === 'TermAndCondition' ? (this.termAndConditionFileName = fileEntry.name, this.incentiveForm.get('TermAndCondition')?.setValue(file)) : null;
        })
      }
    }
  }

  fileLeave(e: any) {
    // console.log('fileleave',e);
  }

  openFileSelector(el: any) {
    // console.log('fileselect',el);
  }

  incentiveFormSubmit() {
    if (this.incentiveForm.valid) {
      const formData = new FormData();
      formData.append('Title', this.incentiveForm.get('Title')?.value);
      formData.append('AdditionalInformation', this.incentiveForm.get('AdditionalInformation')?.value);
      formData.append('Visibility', this.incentiveForm.get('Visibility')?.value);
      if (this.files.length > 0) {
        formData.append('Brochure', this.incentiveForm.get('Brochure')?.value);
        formData.append('TermAndCondition', this.incentiveForm.get('TermAndCondition')?.value);
      }
      this.addPropertyIncentives(formData)
    } else {
      this.incentiveForm.markAllAsTouched()
    }
  }

  valueGet(e: any) {
    this.incentiveForm.get('Visibility')?.setValue(e.value)
  }

  addPropertyIncentives(incentive: any) {
    if (this.incentiveId !== null) {
      this.updatePropertyIncentives(incentive);
    } else {
      this.pl.propertyIncentivesAdd(incentive).subscribe({
        next: (res: any) => {
          res.status === 'success' ? (this.toastr.success(res.message), this.router.navigate(['admin/manage-incentives'])) : null;
        }, error: (error: HttpErrorResponse) => {
          console.log(error);
          this.toastr.error(error.error.message)
        }
      })
    }
  }

  updatePropertyIncentives(incentive: any) {
    this.pl.propertyIncentivesUpdate(incentive, this.incentiveId).subscribe({
      next: (res: any) => {
        res.status === 'success' ? (this.toastr.success(res.message), this.router.navigate(['admin/manage-incentives'])) : null
      }, error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  onDeleteMedia(inId: number, type: number) {
    this.pl.propertyIncentivesDelFile(inId, type).subscribe({
      next: (del: any) => {
        del.status === 'success' ? (this.toastr.success(del.message), this.ngOnInit()) : null
       
      }
    })
  }
}
