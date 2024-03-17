import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PropertiesService } from 'src/app/components/services/properties.service';
import * as XLSX from 'node_modules/xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css']
})
export class UnitListComponent {

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

  public propertyId = localStorage.getItem('PropertyId');

  fileName = "All Units.xlsx";

  searchForm!: FormGroup;
  propertyUnitList: any;
  totalItem: any;
  searchText: any;
  searchClear: boolean | undefined;
  PageNo: any = 1;
  checked: boolean = true;
  checkedIn: boolean = false;
  allComplete: boolean = false;
  showSelectedGroup: boolean = false;

  constructor(private pl: PropertiesService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPropertyUnitList(this.propertyUnitfilter);
    this.getSearchForm();
  }

  getPropertyUnitList(propertyUnitfilter: any) {
    this.propertyUnitfilter.PropertyId = this.propertyId;
    this.pl.propertyUnitList(propertyUnitfilter).subscribe((res: any) => {
      console.log(res);

      this.propertyUnitList = res.data.units;
      this.totalItem = res.data.totalCount;
      this.propertyUnitfilter.PerPage = 10;
    })
  }


  getSearchForm() {
    this.searchForm = this.fb.group({
      Search: new FormControl('')
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
    console.log(e);

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
    });
  }

  checkIn(e: any, unitId: number) {
    if (e === true) {
      this.propertyUnitStatus.Units.push(unitId);
    } else {
      this.propertyUnitStatus.Units.pop(unitId);

    }
    
    if (this.propertyUnitStatus.Units.length >= 2) {
      this.showSelectedGroup = true
    } else {
      this.showSelectedGroup = false

    }

  }


  setPropertyStatusChange(getStatusInput: any) {
    this.pl.propertyUnitStatusChange(getStatusInput).subscribe((st: any) => {
      console.log(st);
      if (st.status === 'success') {
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

  resetCheckBox(){
    this.allComplete = false;
  }

  createUnit(){
    localStorage.removeItem('unitId')
    this.router.navigate(['admin/unit-create/unit-details']);
  }

  editUnit(unitId:any){
    this.router.navigate(['admin/unit-create/unit-details']);
    this.pl.unitId = unitId;
  }


}

