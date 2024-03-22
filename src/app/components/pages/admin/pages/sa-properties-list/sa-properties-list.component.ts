import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServicesService } from 'src/app/components/services/api-services.service';

@Component({
  selector: 'app-sa-properties-list',
  templateUrl: './sa-properties-list.component.html',
  styleUrls: ['./sa-properties-list.component.css']
})
export class SaPropertiesListComponent implements OnInit {

  @ViewChild('closeButton') closeButton!: ElementRef;

  tableHead: any = [
    {
      'colId': 'BuildingCode',
      'colVal': 'Property Code',
    },
    {
      'colId': 'PropertyName',
      'colVal': 'Name',
    },
    {
      'colId': 'SectorName',
      'colVal': 'Sector',
    },
    {
      'colId': 'Address',
      'colVal': 'Address'
    },
    {
      'colId': 'IsFeatured',
      'colVal': 'Featured'
    },
    {
      'colId': 'PropertyStatus',
      'colVal': 'Status'
    }
  ]


  propertyList: any[] = [];
  dropdownList: any = [];
  totalItem!: number;

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
    CompletionType: '',
    Type: '1'
  }

  constructor(private pl: PropertiesService,
    private router: Router,
    private toastr: ToastrService,
    private dw: ApiServicesService,
    private spinner: NgxSpinnerService) {
    localStorage.removeItem('PropertyId');
  }

  ngOnInit() {
    this.getDropDown();
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

  getDropDown() {
    this.dw.getValues().subscribe((val: any) => {
      this.dropdownList = val[0].data;
    })
  }

  getSearch(search: any) {
    this.propertyfilter.Search = search.Search
    this.propertyfilter.PerPage = 'all';
    this.getPropertyList(this.propertyfilter);
  }

  getSelection(sector: any) {
    console.log(sector);
    this.propertyfilter.SectorId = sector.SectorId
    this.ngOnInit();
  }

  pageChange(pageNo: number) {
    this.propertyfilter.PageNo = pageNo
    this.ngOnInit();
  }

  featureToggle(e: any) {
    const formData = new FormData();
    formData.append('IsFeatured', e.status)
    formData.append('Type', this.propertyfilter.Type)
    this.setPropertyFeatureStatus(e.id.PropertyId, formData);
  }

  getEditById(id: any) {
    localStorage.setItem('PropertyId', id);
    this.router.navigate(['admin/create-properties']);
  }

  getViewById(id: any, page: any) {
    localStorage.setItem('PropertyId', id);
    this.router.navigate(['admin/view-property'], { queryParams: { pageData: JSON.stringify(page) } });
  }

  getDelById(id: any) {

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


  mdaForm = new FormGroup({
    BuildingCode: new FormControl('')
  })


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
}

