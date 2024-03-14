import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  constructor(private frgotpass : ForgotPasswordService, private toastr: ToastrService){}

  forgotForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email])
  })

  forgotPass(){
    // console.log(this.forgotForm.value)
    this.frgotpass.userForgotPass(this.forgotForm.value).subscribe((data: any) =>{
      // console.log(data)
      if(data.status === 'success'){
        this.toastr.success(data.message);
      }
    })
  }

  getUserValidate() {
    return this.forgotForm.get('Email');
  }

}
