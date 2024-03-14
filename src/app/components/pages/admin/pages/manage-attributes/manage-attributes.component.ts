import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiServicesService } from 'src/app/components/services/api-services.service';

@Component({
  selector: 'app-manage-attributes',
  templateUrl: './manage-attributes.component.html',
  styleUrls: ['./manage-attributes.component.css']
})
export class ManageAttributesComponent {
  
  allAttributes:any;
  totalItem: any;
  PageNo: any = 1;
  searchClear: boolean | undefined;
  searchText: any;
  
  attributeFilter: any = {
    PageNo: '',
    PerPage: 'all',
    Search: '',
    PropertyId: '',
    SortBy: '',
    SortOrder: '',
  }

  constructor(private apiService: ApiServicesService){}

  ngOnInit(){
    this.getAttributeList(this.attributeFilter)
  }

  searchForm = new FormGroup({
    Search: new FormControl('')
  })


  getAttributeList(attribute:any){
    this.apiService.attributeList(attribute).subscribe((at:any)=>{
      this.allAttributes = at.data.attributes
      this.totalItem = at.data.totalCount
      this.attributeFilter.PerPage = 10;
    })
  }

  onPageChange(e: number) {
    this.PageNo = e;
    this.attributeFilter.PageNo = this.PageNo;
    this.ngOnInit()
  }

  onClearSearch() {
    this.searchForm.get('Search')?.setValue('');
    this.attributeFilter.Search = '';
    this.getAttributeList(this.attributeFilter)
    this.searchClear = false;
    this.ngOnInit()
  }

  searchUser() {
    this.searchText = this.searchForm.value;

    this.attributeFilter.Search = this.searchText['Search'];
    this.attributeFilter.PerPage = 'all';
    if (this.searchText) {
      this.searchClear = true;
    }
    this.PageNo = 1;
    this.ngOnInit()
  }

}
