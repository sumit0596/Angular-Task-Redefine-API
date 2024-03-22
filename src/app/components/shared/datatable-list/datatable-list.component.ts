import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as XLSX from '../../../../../node_modules/xlsx';

@Component({
  selector: 'app-datatable-list',
  templateUrl: './datatable-list.component.html',
  styleUrls: ['./datatable-list.component.css']
})
export class DatatableListComponent {

  @Input() pageTitle: string = '';
  @Input() tableHeaderTitle: any = [] = [];
  @Input() tableBodyData: any = [] = [];
  @Input() dropdownList: any = [] = [];
  @Input() holdingdpList: any = [] = [];
  @Input() completionTypeList: any = [] = [];
  @Input() totalCount: any;
  @Input() perPage!: number;
  @Input() type!: string;
  @Input() filterChecked!: boolean;
  @Output() searchTextGet = new EventEmitter<string>();
  @Output() optionSelectGet = new EventEmitter<number[]>();
  @Output() pageNo = new EventEmitter<number>();
  @Output() clickEdit = new EventEmitter<number>();
  @Output() clickView = new EventEmitter<number>();
  @Output() clickDelete = new EventEmitter<number>();
  @Output() toggleChange = new EventEmitter<any>();

  fileName = "All International Properties.xlsx";
  searchForm!: FormGroup;
  filterForm!: FormGroup;
  searchText!: string;
  clearText!: string
  searchClear: boolean = false
  totalItem: any;
  PageNo: any;
  featureStatus!:number

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.getSearchForm();
    this.getFilterForm();
  }

  getSearchForm() {
    this.searchForm = this.fb.group({
      Search: new FormControl('')
    })
  }

  getFilterForm() {
    this.filterForm = this.fb.group({
      SectorId: new FormControl(''),
      HoldingCompanyId: new FormControl(''),
      CompletionType: new FormControl('')
    })
  }

  searchList() {
    this.searchText = this.searchForm.value;
    this.searchTextGet.emit(this.searchText)
    this.searchText ? this.searchClear = true : false
  }

  onClearSearch() {
    this.searchClear = false;
    this.searchForm.get('Search')?.setValue('')
    this.searchText = ''
    this.searchTextGet.emit(this.searchText);
  }

  onPageChange(e: number) {
    this.PageNo = e;
    this.pageNo.emit(this.PageNo)
  }

  onEdit(eid: number) {
    this.clickEdit.emit(eid);
  }

  onView(eid:number) {
    this.clickView.emit(eid);
  }
  onDelete(eid:number) {
    this.clickDelete.emit(eid);
  }

  filterSection() {
    this.optionSelectGet.emit(this.filterForm.value);
  }

  sectorSelect(e: any) {
    console.log(e)
  }

  holdingSelect(e: any) {
    console.log(e)
  }

  completionSelect(e: any) {
    console.log(e)
  }

  clearSectorSelect() {
    this.filterForm.get('SectorId')?.setValue('')
    this.filterForm.get('HoldingCompanyId')?.setValue('')
    this.filterForm.get('CompletionType')?.setValue('')
    this.optionSelectGet.emit(this.filterForm.value)
  }

  toggleStatus(e:any, id:number){
    this.featureStatus = e === true ? 1 : 0;
    this.toggleChange.emit({status : this.featureStatus,id})
  }

  exportData() {
    setTimeout(() => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableBodyData);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
      this.ngOnInit()
    }, 1000);
  }
}
