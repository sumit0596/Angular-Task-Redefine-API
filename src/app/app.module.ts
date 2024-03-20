import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './components/pages/admin/admin.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthsectionInterceptor } from './components/services/authsection.interceptor';
import { LeftmenuComponent } from './components/shared/leftmenu/leftmenu.component';
import { AuthGuard } from './components/guard/auth.guard';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminModule } from './components/pages/admin/admin.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    WelcomeComponent,
    FooterComponent,
    AdminComponent,
    LeftmenuComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AdminModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }), 
    ToastrModule.forRoot(),
  ],
  exports: [RouterModule,],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthsectionInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
