import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { PropertiesService } from 'src/app/components/services/properties.service';
import * as XLSX from '../../../../../../../node_modules/xlsx';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sa-properties-list',
  templateUrl: './sa-properties-list.component.html',
  styleUrls: ['./sa-properties-list.component.css']
})
export class SaPropertiesListComponent implements OnInit {

  @ViewChild('closeButton') closeButton!: ElementRef;

  propertyList: any[] = [];
  PageNo: any = 1;
  totalItem: any;
  searchClear: boolean | undefined;
  searchText: any;


  sectorList: any[] = []
  sectorSelect: any;

  errorMessage: string = '';

  detailsFilter: any = {
    BuildingCode: ''
  }

  propertyfilter: any = {
    PageNo: '',
    PerPage: 'all',
    Search: '',
    SectorId: '',
    PropertyId: '',
    SortBy: '',
    SortOrder: '',
    HoldingCompanyId: '',
    CompletionType: ''
  }

  IsFeatured: any;

  checked: boolean = true;

  constructor(private pl: PropertiesService,
    private sectors: DropdownListService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) {
    localStorage.removeItem('PropertyId');
  }

  ngOnInit() {
    this.getSectorList();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.getPropertyList(this.propertyfilter)
    }, 2000)
  }

  getPropertyList(propertyfilter: any) {
    this.pl.propertyList(propertyfilter).subscribe((res: any) => {
      this.propertyList = res.data.properties;
      this.totalItem = res.data.totalProperty;
      this.propertyfilter.PerPage = 10;
    })
  }


  getSectorList() {
    this.sectors.sectorList().subscribe((sector: any) => {
      this.sectorList = sector.data
    })
  }

  searchForm = new FormGroup({
    Search: new FormControl('')
  })


  filterForm = new FormGroup({
    RoleId: new FormControl('')
  })

  mdaForm = new FormGroup({
    BuildingCode: new FormControl('')
  })

  onPageChange(e: number) {
    this.PageNo = e;
    this.propertyfilter.PageNo = this.PageNo;
    this.ngOnInit()
  }

  onClearSearch() {
    this.searchForm.get('Search')?.setValue('');
    this.propertyfilter.Search = '';
    this.getPropertyList(this.propertyfilter);
    this.searchClear = false;
    this.ngOnInit()
  }

  filterSection() {
    const roleVal = this.filterForm.value
    Object.values(roleVal).forEach((val: any) => {
      this.propertyfilter.SectorId = val
    })

    this.ngOnInit()
  }

  clearSectorSelect() {
    this.sectorSelect = ''
    this.propertyfilter.SectorId = '';
    this.ngOnInit()
  }


  itemSelected(e: any) {
    // console.log(e)
  }

  fileName = "All Properties.xlsx";

  exportData() {
    setTimeout(() => {

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.propertyList);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);

      this.sectorSelect.PageNo = this.PageNo;
      this.ngOnInit()
    }, 1000);
  }

  searchUser() {
    this.searchText = this.searchForm.value;

    this.propertyfilter.Search = this.searchText['Search'];
    this.propertyfilter.PerPage = 'all';
    if (this.searchText) {
      this.searchClear = true;
    }
    this.PageNo = 1;
    this.ngOnInit()
  }

  modalClose() {
    var modalBackdrop = document.querySelector('.modal-backdrop.fade.show');
    if (modalBackdrop != null) {
      modalBackdrop.classList.remove('show');
    }
  }

  checkMda() {
    this.detailsFilter.BuildingCode = this.mdaForm.value;
    this.pl.mdaGetProperty(this.detailsFilter.BuildingCode).subscribe({
      next: (mda: any) => {
        if (mda.status === 'success') {
          this.closeButton.nativeElement.click();
        }
        this.pl.setBuildingCode(mda.data.details.BuildingCode)

        this.router.navigate(['admin/create-properties']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = error.error.message

        }
      }
    })

  }


  editSection(pageId: any) {
    localStorage.setItem('PropertyId', pageId);

    this.router.navigate(['admin/create-properties']);

  }

  viewSection(pageId: any, page: any) {
    localStorage.setItem('PropertyId', pageId);

    this.router.navigate(['admin/view-property'], { queryParams: { pageData: JSON.stringify(page) } });

  }

  toggleStatus(e: any, propertyId: number) {
    this.IsFeatured = e === true ? 1 : 0;
    const formData = new FormData();
    formData.append('IsFeatured', this.IsFeatured)
    this.setPropertyFeatureStatus(propertyId, formData);
  }


  setPropertyFeatureStatus(pid: number, formData: FormData) {
    this.pl.propertyFeatureChange(pid, formData).subscribe({
      next: (st: any) => {
        st.status === 'success' ? (this.getPropertyList(this.propertyfilter), this.toastr.success(st.message)) : null;
      }, error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message)
        this.getPropertyList(this.propertyfilter)
      }
    })
  }

}

