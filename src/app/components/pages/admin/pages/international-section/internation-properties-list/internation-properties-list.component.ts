import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild, ViewChildren } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from 'src/app/components/services/api-services.service';
import { PropertiesService } from 'src/app/components/services/properties.service';

@Component({
  selector: 'app-internation-properties-list',
  templateUrl: './internation-properties-list.component.html',
  styleUrls: ['./internation-properties-list.component.css']
})

export class InternationPropertiesListComponent {

  constructor(private pl: PropertiesService,
    private dw: ApiServicesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getDropDown()
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.getPropertyList(this.propertyfilter);
    }, 2000)
  }

  // tableHead: any = ['Name', 'Address', 'Sector', 'Holding Company', 'Build Completion Status', 'Featured', 'Status', 'Actions']

  tableHead: any = [
    {
      'colId': 'PropertyName',
      'colVal': 'Name',
    },
    {
      'colId': 'Address',
      'colVal': 'Address',
    },
    {
      'colId': 'SectorName',
      'colVal': 'Sector',
    },
    {
      'colId': 'HoldingCompanyName',
      'colVal': 'Holding Company'
    },
    {
      'colId': 'CompletionType',
      'colVal': 'Build Completion Status'
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


  propertyList: any = [];
  dropdownList: any = [];
  holdingDropdown: any = [];
  completionDropdown: any = [{ Id: 1, Name: "Under Construction" }, { Id: 2, Name: "Assets Completion" }]

  totalItem!: number;

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
    Type: '2'
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
      this.holdingDropdown = val[4].data;
    })
  }

  getSearch(search: any) {
    this.propertyfilter.Search = search.Search
    this.propertyfilter.PerPage = 'all';
    this.getPropertyList(this.propertyfilter);
  }

  getSelection(sector: any) {
    this.propertyfilter.HoldingCompanyId = sector.HoldingCompanyId
    this.propertyfilter.CompletionType = sector.CompletionType
    this.propertyfilter.SectorId = sector.SectorId
    this.ngOnInit();
  }

  pageChange(pageNo: number) {
    this.propertyfilter.PageNo = pageNo
    this.ngOnInit();
  }

  featureToggle(e:any){
    const formData = new FormData();
    formData.append('IsFeatured', e.status)
    formData.append('Type', this.propertyfilter.Type)
    this.setPropertyFeatureStatus(e.id.PropertyId, formData);
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

  getEditById(id: any) {
  }

}
