import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ApiServicesService } from '../../services/api-services.service';
import { UserDetailsService } from '../../services/user-details.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private loginUSer: LoginService, private router: Router, private userdet: UserDetailsService) { }
  
  userDataGet: any[] =[];
  FirstName:any
  LastName:any
  Email:any


  ngOnInit() {
    this.userDetails()
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('Token');
  }

  logoutUser() {
    this.loginUSer.userLogout();
    // this.session = false; 
    this.router.navigate(['/login']);
  }
  
  userDetails(){
    this.userdet.userData().subscribe((res:any)=>{
      this.userDataGet = res.data;
      this.FirstName = res.data.FirstName
      this.LastName = res.data.LastName
      this.Email = res.data.Email
    })
  }
}

