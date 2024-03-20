import { Component, EventEmitter, Output } from '@angular/core';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-property-certification',
  templateUrl: './property-certification.component.html',
  styleUrls: ['./property-certification.component.css'],
  providers: [DatePipe]
})
export class PropertyCertificationComponent {

  @Output() nextTabSwitch = new EventEmitter()

  propertyId: any
  esgForm!: FormGroup;
  createForm: any;
  startDate: any;
  endDate: any;
  activatedTabsIndex: number = 5;

  esgConf: any;

  ratings = [
    { id: 1, name: '1 Star' },
    { id: 2, name: '2 Star' },
    { id: 3, name: '3 Star' },
    { id: 4, name: '4 Star' },
    { id: 5, name: '5 Star' },
    { id: 6, name: '6 Star' },
  ];

  levels = [
    { id: 1, name: 'Level 1 - Construction Waste' },
    { id: 2, name: 'Level 2 - Occupant Consumption' },
    { id: 3, name: 'Level 3 - Embodied Consumption' },
    { id: 4, name: 'Level 4 - Renovation Consumption' },
    { id: 5, name: 'Level 5 - Deconstruction Consumption' }
  ];

  levelsType = [
    { id: 1, name: 'Modelled' },
    { id: 2, name: 'Measured' }
  ];

  epcRating = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' },
    { id: 5, name: 'E' },
    { id: 6, name: 'F' },
    { id: 7, name: 'G' },
  ];

  constructor(private fields: DropdownListService,
    private fb: FormBuilder,
    private pl: PropertiesService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB')

  }

  htmlFields: any
  subHtmlFields: any
  esgData: any
  dynamicFieldStates: { [key: number]: boolean } = {};
  subFields: { [key: number]: boolean } = {};

  esgValues: any[] = []

  esgObj: any = {
    PropertyId: '',
    EsgFeatures: ''
  }


  public files: Array<NgxFileDropEntry> = [];
  fileArrays: Array<Array<NgxFileDropEntry>> = [];



  ngOnInit() {
    this.ratings;
    this.levels;
    this.epcRating;
    this.getFields();
    this.getPropertyData();
    this.getBuildingForm();
    this.spinner.show();
        setTimeout(() => {
      this.spinner.hide();

    }, 2000)
  }


  getBuildingForm() {
    this.esgForm = this.fb.group({
      Rating: new FormArray([]),
      LevelType: new FormArray([]),
      OffsetPercentage: new FormArray([]),
      ValidityStartDate: new FormArray([]),
      ValidityEndDate: new FormArray([]),
      AdditionalInformation: new FormArray([]),
    })
  }

  getPropertyData() {
    this.pl.propertyFetch().subscribe((s: any) => {
      this.propertyId = s.data.details.PropertyId
      this.esgData = s.data.esgfeatures

      this.esgData.forEach((data: any, index: number) => {
        const ratingControl = this.esgForm.get('Rating') as FormArray;
        const levelTypeControl = this.esgForm.get('LevelType') as FormArray;
        const offsetPercentageControl = this.esgForm.get('OffsetPercentage') as FormArray;
        const validityStartDateControl = this.esgForm.get('ValidityStartDate') as FormArray;
        const validityEndDateControl = this.esgForm.get('ValidityEndDate') as FormArray;
        const additionalInformationControl = this.esgForm.get('AdditionalInformation') as FormArray;
        const imgFile = data.File


        ratingControl.at(index)?.patchValue(data.Rating);
        levelTypeControl.at(index)?.patchValue(data.LevelType);
        offsetPercentageControl.at(index)?.patchValue(data.OffsetPercentage);
        validityStartDateControl.at(index)?.patchValue(data.ValidityStartDate);
        validityEndDateControl.at(index)?.patchValue(data.ValidityEndDate);
        additionalInformationControl.at(index)?.patchValue(data.AdditionalInformation);
        this.getFileFrom(imgFile, index)
        this.toggleDiv(true, index)
        this.toggleSubDiv(true, index)
      })
    })
  }


  getFields() {
    this.fields.esgFeaturesListing().subscribe((res: any) => {
      this.htmlFields = res.data;

      this.htmlFields.forEach((data: any) => {

        data.features.forEach((ff: any) => {

          (this.esgForm.get('Rating') as FormArray).push(new FormControl(null));
          (this.esgForm.get('LevelType') as FormArray).push(new FormControl(null));
          (this.esgForm.get('OffsetPercentage') as FormArray).push(new FormControl(null));
          (this.esgForm.get('ValidityStartDate') as FormArray).push(new FormControl(null));
          (this.esgForm.get('ValidityEndDate') as FormArray).push(new FormControl(null));
          (this.esgForm.get('AdditionalInformation') as FormArray).push(new FormControl(null));
          this.fileArrays[ff.EsgFeaturesId - 1] = [];
          this.esgValues.push({
            EsgFeaturesId: ff.EsgFeaturesId,

          });
        });
      });
    });
  }



  dropped(files: NgxFileDropEntry[], fi: number, arrgs: string) {
    this.files = files;
    this.fileArrays[fi] = [];
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.fileArrays[fi].push(droppedFile);
          const formData = new FormData();
          formData.append('File', file, file.name);
          formData.append('PropertyId', this.propertyId);
          formData.append('Type', arrgs);
          this.uploadMedia(formData, fi);
        })
      }
    }
  }

  getFileFrom(file: any, index: any) {
    if (file !== null) {
      this.fileArrays[index] = [];
      this.fileArrays[index].push(file.Name);
    }
  }

  public fileOver(e: any) {
    // console.log(e);
  }

  public fileLeave(e: any) {
    // console.log(e);
  }



  startDatePick(e: MatDatepickerInputEvent<Date>, index: number) {

    const formattedDate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
    this.startDate = formattedDate
    this.updateValue('ValidityStartDate', index, this.startDate);


  }

  endDatePick(e: MatDatepickerInputEvent<Date>, index: number) {
    const formattedDate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
    this.endDate = formattedDate
    this.updateValue('ValidityEndDate', index, this.endDate);

  }

  esgSubmit() {
    this.esgValues.forEach((data, index) => {

      this.updateValue('Rating', index);
      this.updateValue('LevelType', index);
      this.updateValue('OffsetPercentage', index);
      this.updateValue('AdditionalInformation', index);
    });

    this.esgObj.PropertyId = this.propertyId;
    this.esgObj.EsgFeatures = this.esgValues

    this.pl.addPropertyEsg(this.esgObj).subscribe((sent: any) => {
      if (sent.status === 'success') {
        this.toastr.success(sent.message);
        // this.ngOnInit();
        this.nextTabSwitch.emit(this.activatedTabsIndex);
      }
    })
  }

  updateValue(val: string, index: number, formattedDate?: string) {
    const control = this.esgForm.get(val) as FormArray;

    if (control && control.at(index)) {
      this.esgValues[index][val] = control.at(index).value;

      if (val === 'ValidityStartDate') {
        this.esgValues[index][val] = this.startDate;
      }
      if (val === 'ValidityEndDate') {
        this.esgValues[index][val] = this.endDate;
      }
    }
  }

  uploadMedia(formData: FormData, index: number) {
    this.pl.uploadPropertyImages(formData).subscribe((upfiles: any) => {
      if (upfiles.status === 'success') {
        const imageUrl = upfiles.data.Url;
        const imgId = upfiles.data.PropertyMediaId;
        this.updateFileUrl(imageUrl, imgId, index);
      }
    })

  }

  updateFileUrl(imageUrl: string, imageId: number, index: number) {

    if (this.esgValues[index]) {
      this.esgValues[index]['Url'] = imageUrl;
      this.esgValues[index]['PropertyMediaId'] = imageId;
    }
  }

  toggleDiv(checked: any, checkSection: number) {

    this.dynamicFieldStates[checkSection] = checked;
  }

  toggleSubDiv(checked: any, checkSection: number) {
    this.subFields[checkSection] = checked;
  }


}