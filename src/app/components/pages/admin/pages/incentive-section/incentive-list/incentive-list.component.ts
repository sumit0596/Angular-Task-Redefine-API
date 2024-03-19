import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'node_modules/xlsx';
import { PropertiesService } from 'src/app/components/services/properties.service';

@Component({
  selector: 'app-incentive-list',
  templateUrl: './incentive-list.component.html',
  styleUrls: ['./incentive-list.component.css']
})
export class IncentiveListComponent {

  constructor(private fb: FormBuilder,
    private pl: PropertiesService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  fileName = "All Incentives.xlsx";
  searchForm!: FormGroup;
  searchClear: boolean | undefined;
  totalItem: any;
  searchText: any;
  PageNo: any = 1;
  propertyIncentivesList: any;

  propertyincentiveFilter: any = {
    PageNo: '',
    PerPage: 'all',
    Search: '',
    SortBy: '',
    SortOrder: '',
  }

  ngOnInit() {
    this.spinner.show();
    this.getSearchForm();

    setTimeout(() => {
      this.spinner.hide();
      this.getPropertyUnitList(this.propertyincentiveFilter);
    }, 2000)
  }

  getSearchForm() {
    this.searchForm = this.fb.group({
      Search: new FormControl('')
    })
  }


  exportData() {
    setTimeout(() => {

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.propertyIncentivesList);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
      this.ngOnInit()
    }, 1000);
  }


  searchList() {
    this.searchText = this.searchForm.value;
    this.propertyincentiveFilter.Search = this.searchText.Search
    this.propertyincentiveFilter.PerPage = 'all';
    if (this.searchText) {
      this.searchClear = true;
    }
    this.PageNo = 1;
    this.getPropertyUnitList(this.propertyincentiveFilter);
  }

  onClearSearch() {
    this.searchClear = false;
    this.propertyincentiveFilter.Search = '';
    this.ngOnInit();
  }

  ascending(columnName: any) {
    this.propertyincentiveFilter.SortOrder = 'Asc';
    this.propertyincentiveFilter.SortBy = columnName;
    this.getPropertyUnitList(this.propertyincentiveFilter);

  }

  decending(columnName: any) {
    this.propertyincentiveFilter.SortOrder = 'Desc';
    this.propertyincentiveFilter.SortBy = columnName;
    this.getPropertyUnitList(this.propertyincentiveFilter);
  }

  onPageChange(e: number) {
    this.PageNo = e;
    this.propertyincentiveFilter.PageNo = this.PageNo;
    this.ngOnInit()
  }

  getPropertyUnitList(propertyincentiveFilter: any) {
    this.pl.propertyIncentivesList(propertyincentiveFilter).subscribe((res: any) => {
      this.propertyIncentivesList = res.data.incentives;
      this.totalItem = res.data.totalCount;
      this.propertyincentiveFilter.PerPage = 10;
    })
  }

  createIncentive() {
    localStorage.removeItem('IncentiveId');
    this.router.navigate(['admin/create-incentives']);
   }

  editUnit(inId: any) {
    localStorage.setItem('IncentiveId', inId);
    this.router.navigate(['admin/create-incentives']);
  }

  delUnit(inId: number){
    this.pl.incentivetDelete(inId).subscribe((del:any) =>{
      del.status === 'success' ? (this.toastr.success(del.message), this.ngOnInit()) : null;
    })
  }


}
