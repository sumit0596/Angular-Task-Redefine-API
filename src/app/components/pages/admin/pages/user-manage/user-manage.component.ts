import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from 'src/app/components/services/api-services.service';
import { UserListService } from 'src/app/components/services/user-list.service';
import * as XLSX from '../../../../../../../node_modules/xlsx';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent {

  totalUsers: any;
  // PageNo: number = 1;
  searchClear: boolean | undefined;
  roleSelect: number[] = [];

  allUsers: any[] = [];

  searchText: any;
  PageNo: any = 1;

  filter: any = {
    PageNo: 1,
    PerPage: 'all',
    Search: '',
    SortBy: '',
    SortOrder: '',
    RoleId: '',
  };

  role:any []= []

  constructor(private userlist: UserListService, 
    private toastr: ToastrService,
    private roleService: ApiServicesService,
    private router: Router) { }

  ngOnInit() {
    this.getRoles()
    this.searchClear = false;
    this.getUserList(this.filter);
  }

  searchForm = new FormGroup({
    Search: new FormControl('')
  })

  filterForm = new FormGroup({
    RoleId: new FormControl('')
  })

  getUserList(filter: any) {
    this.userlist.userList(filter).subscribe((res: any) => {
      this.allUsers = res.data.users
      this.totalUsers = res.data.totalUsers
      this.filter.PerPage = 10
      // console.log('all user:', this.allUsers)
    })
  }

  getRoles(){
    this.roleService.getRole().subscribe((role:any)=>{
      this.role = role.data.roles
      // console.log(this.role)
    })
  }

  onPageChange(event: number) {
    this.PageNo = event;
    this.filter.PageNo = this.PageNo;
    this.getUserList(this.filter);
  }


  searchUser() {
    this.searchText = this.searchForm.value;

    this.filter.Search = this.searchText['Search'];
    this.filter.PerPage = 'all';
    if (this.searchText) {
      this.searchClear = true;
    }
    this.PageNo = 1;
    // console.log(this.filter.Search );
    this.getUserList(this.filter);

    

  }

  filterSection(){
    this.filter.RoleId = this.filterForm.value
    this.getUserList(this.filter.RoleId);
  }

  ascending(columnName:any){
    this.filter.SortOrder = 'Asc';
    this.filter.SortBy = columnName;
    this.getUserList(this.filter);
  }

  decending(columnName:any){
    this.filter.SortOrder = 'Desc';
    this.filter.SortBy = columnName;
    this.getUserList(this.filter);
  }

  clearRoleSelect() {
    this.roleSelect = [];
    this.getUserList(this.roleSelect);
  }

  onClearSearch() {
    this.searchForm.get('Search')?.setValue('');
    this.filter.Search = '';
    this.getUserList(this.filter);
    this.searchClear = false;
  }

  onDelete(a: any) {
    this.userlist.userListDelete(a).subscribe((del: any) => {
      // console.log(del)
      this.toastr.success(del.message);
    });
    return this.ngOnInit()
  }

  
  createNewUser(){
    this.router.navigate(['/admin/user-create']);
    // this.fieldValue()

  }
  

  itemSelected(e: any) {
    console.log(e)
  }

  fileName = "All User.xlsx";

  exportData() {  
    setTimeout(() => {
 
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allUsers);
      
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
      
      this.filter.PageNo = this.PageNo;
      this.getUserList(this.filter);
    }, 1000);
  }
  
}
