import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServicesService } from 'src/app/components/services/api-services.service';

@Component({
  selector: 'app-manage-attributes',
  templateUrl: './manage-attributes.component.html',
  styleUrls: ['./manage-attributes.component.css']
})
export class ManageAttributesComponent {

  tableHead: any = [
    {
      'colId': 'Title',
      'colVal': 'Name',
    },
    {
      'colId': 'AdditionalInformation',
      'colVal': 'Description',
    },
    {
      'colId': 'AddedBy',
      'colVal': 'Created By',
    },
    {
      'colId': 'CreatedOn',
      'colVal': 'Date Added'
    }
  ]

  allAttributes: any;
  totalItem: any;
  PageNo: any = 1;

  attributeFilter: any = {
    PageNo: '',
    PerPage: '',
    Search: '',
    PropertyId: '',
    SortBy: '',
    SortOrder: '',
  }

  constructor(private apiService: ApiServicesService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.getAttributeList(this.attributeFilter)
    }, 2000)
  }

  getAttributeList(attribute: any) {
    this.apiService.attributeList(attribute).subscribe((at: any) => {
      this.allAttributes = at.data.attributes
      this.totalItem = at.data.totalCount
      this.attributeFilter.PerPage = 10;
    })
  }

  getSearch(search: any) {
    this.attributeFilter.Search = search.Search
    this.attributeFilter.PerPage = 'all';
    this.ngOnInit();
  }

  pageChange(pageNo: number) {
    this.attributeFilter.PageNo = pageNo
    this.ngOnInit();
  }
}
