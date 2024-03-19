import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PropertiesService } from 'src/app/components/services/properties.service';
import * as XLSX from 'node_modules/xlsx';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css']
})
export class UnitListComponent {
  @ViewChild('closeButton') closeButton!: ElementRef;
  @ViewChild('closeButton2') closeButton2!: ElementRef;

  propertyUnitfilter: any = {
    PageNo: '',
    PerPage: 'all',
    Search: '',
    SectorId: '',
    PropertyId: '',
    SortBy: '',
  }

  propertyUnitStatus: any = {
    PropertyId: '',
    Status: '',
    Units: []
  }

  brokercommission: any = {
    PropertyId: '',
    Units: []
  }

  tenantIncentive: any = {
    PropertyId: '',
    Incentives: [],
    Units: []
  }

  public propertyId = localStorage.getItem('PropertyId');

  fileName = "All Units.xlsx";

  searchForm!: FormGroup;
  incentiveForm!: FormGroup;
  tenantIncentiveForm!: FormGroup;

  propertyUnitList: any;
  totalItem: any;
  searchText: any;
  searchClear: boolean | undefined;
  PageNo: any = 1;
  checked: boolean = true;
  checkedIn: boolean = false;
  allComplete: boolean = false;
  showSelectedGroup: boolean = false;
  incentiveListing: any

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

  constructor(private pl: PropertiesService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private dw: DropdownListService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.getPropertyUnitList(this.propertyUnitfilter);
    this.getIncentivesListing();
    this.getSearchForm();
    this.getIncentiveForm();
    this.gettenantIncentiveForm();
  }

  getPropertyUnitList(propertyUnitfilter: any) {
    this.propertyUnitfilter.PropertyId = this.propertyId;
    this.pl.propertyUnitList(propertyUnitfilter).subscribe((res: any) => {
      setTimeout(() => {
        this.spinner.hide();
        this.propertyUnitList = res.data.units;
        this.totalItem = res.data.totalCount;
        this.propertyUnitfilter.PerPage = 10;
      }, 2000);
    
    })
  }

  getIncentivesListing() {
    this.dw.incentivesListing().subscribe((list: any) => {
      this.incentiveListing = list.data
    })
  }

  getSearchForm() {
    this.searchForm = this.fb.group({
      Search: new FormControl('')
    })
  }

  getIncentiveForm() {
    this.incentiveForm = this.fb.group({
      BrokerIncentives: new FormControl(''),
      CommentDisclaimers: new FormControl('')
    })
  }

  gettenantIncentiveForm() {
    this.tenantIncentiveForm = this.fb.group({
      Incentives: new FormControl(''),
    })
  }


  searchList() {
    this.searchText = this.searchForm.value;
    this.propertyUnitfilter.Search = this.searchText.Search
    this.propertyUnitfilter.PerPage = 'all';


    if (this.searchText) {
      this.searchClear = true;
    }

    this.PageNo = 1;
    this.getPropertyUnitList(this.propertyUnitfilter);
  }

  onClearSearch() {
    this.searchClear = false;
    this.propertyUnitfilter.Search = '';
    this.ngOnInit();
  }

  onPageChange(e: number) {
    this.PageNo = e;
    this.propertyUnitfilter.PageNo = this.PageNo;
    this.ngOnInit()
  }


  exportData() {
    setTimeout(() => {

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.propertyUnitList);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
      this.ngOnInit()
    }, 1000);
  }

  toggleStatus(e: any, unitId: number) {
    this.propertyUnitStatus.PropertyId = this.propertyId;
    this.propertyUnitStatus.Status = e === true ? 1 : 2;
    this.propertyUnitStatus.Units.push(unitId);
    this.setPropertyStatusChange(this.propertyUnitStatus);
  }

  checkAll(e: any) {
    e ? (this.checkedIn = true, this.showSelectedGroup = true) : (this.checkedIn = false, this.showSelectedGroup = false);
    this.propertyUnitStatus.PropertyId = this.propertyId;
    this.propertyUnitList.forEach((c: any) => {
      this.propertyUnitStatus.Units.push(c.PropertyUnitId);
      this.brokercommission.Units.push(c.PropertyUnitId);
      this.tenantIncentive.Units.push(c.PropertyUnitId);
    });
  }

  checkIn(e: any, unitId: number) {
    if (e === true) {
      this.propertyUnitStatus.Units.push(unitId);
      this.brokercommission.Units.push(unitId);
      this.tenantIncentive.Units.push(unitId);
    } else {
      this.propertyUnitStatus.Units.pop(unitId);
      this.brokercommission.Units.pop(unitId);
      this.tenantIncentive.Units.pop(unitId);
    }

    if (this.propertyUnitStatus.Units.length >= 2) {
      this.showSelectedGroup = true
    } else {
      this.showSelectedGroup = false

    }

  }


  setPropertyStatusChange(getStatusInput: any) {
    this.pl.propertyUnitStatusChange(getStatusInput).subscribe((st: any) => {
      if (st.status === 'success') {
        this.toastr.success(st.message);
        this.getPropertyUnitList(this.propertyUnitfilter)
        this.checkAll(false)
        this.resetCheckBox()
      }
    })
  }

  ascending(columnName: any) {
    this.propertyUnitfilter.SortOrder = 'Asc';
    this.propertyUnitfilter.SortBy = columnName;
    this.getPropertyUnitList(this.propertyUnitfilter);

  }

  decending(columnName: any) {
    this.propertyUnitfilter.SortOrder = 'Desc';
    this.propertyUnitfilter.SortBy = columnName;
    this.getPropertyUnitList(this.propertyUnitfilter);

  }

  makeAvailable() {
    this.propertyUnitStatus.Status = 1;
    this.setPropertyStatusChange(this.propertyUnitStatus);
  }
  makeUnAvailable() {
    this.propertyUnitStatus.Status = 2;
    this.setPropertyStatusChange(this.propertyUnitStatus);
  }

  resetCheckBox() {
    this.allComplete = false;
  }

  createUnit() {
    localStorage.removeItem('unitId')
    this.router.navigate(['admin/create-unit']);
  }

  editUnit(unitId: any) {
    this.router.navigate(['admin/create-unit']);
    this.pl.unitId = unitId;
  }

  itemSelected(e: any) {

  }

  brokerCommisionClick(unitId: any) {
    this.brokercommission.Units.push(unitId);
    this.tenantIncentive.Units.push(unitId);
    console.log(unitId);
  }
  

  incentiveFormSubmit() {
    this.brokercommission.PropertyId = this.propertyId;
    this.brokercommission.BrokerIncentives = this.incentiveForm.value.BrokerIncentives
    this.brokercommission.CommentDisclaimers = this.incentiveForm.value.CommentDisclaimers
    this.setBrokerCommisionUpdate(this.brokercommission)
  }

  tenantIncentiveFormSubmit(){
    this.tenantIncentive.PropertyId = this.propertyId;
    this.tenantIncentive.Incentives.push(this.tenantIncentiveForm.value.Incentives);
    this.settenantIncentiveUpdate(this.tenantIncentive);
    
  }

  setBrokerCommisionUpdate(broker: any) {
    this.pl.brokerCommisionUpdate(broker).subscribe((st: any) => {
      if (st.status === 'success') {
        this.toastr.success(st.message);
        this.getPropertyUnitList(this.propertyUnitfilter)
        this.checkAll(false)
        this.resetCheckBox()
        this.closeButton.nativeElement.click();
      }
    })
  }

  settenantIncentiveUpdate(ti: any) {
    this.pl.tenantIncentiveUpdate(ti).subscribe((st: any) => {
      if (st.status === 'success') {
        this.toastr.success(st.message);
        this.getPropertyUnitList(this.propertyUnitfilter)
        this.checkAll(false)
        this.resetCheckBox()
        this.closeButton2.nativeElement.click();
      }
    })
  }


}
