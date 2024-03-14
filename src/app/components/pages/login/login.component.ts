import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['admin']);
    }
  }

  loginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required])
  });

  submitted = false;

  loginUser() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loginService.userAuth(this.loginForm.value).subscribe({
        next: (data: any) => {
          console.log(data);
          this.toastr.success(data.message);
          localStorage.setItem('Token', data.data.Token);
          localStorage.setItem('UserId', data.data.User.UserId);
          this.router.navigate(['admin']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastr.error('Unauthorized access. Please check your credentials.');
          }
        }
      });
    } else {
      this.toastr.warning('Form is invalid. Please check your input.');
    }
  }


  getUserValidate() {
    return this.loginForm.get('Email');
  }
}
