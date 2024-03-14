import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserManageComponent } from './pages/user-manage/user-manage.component';
import { AdminComponent } from './admin.component';
import { BrowserModule } from '@angular/platform-browser'
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { AuthGuard } from '../../guard/auth.guard';
import { FormsModule } from '@angular/forms';
import { UserUpdateComponent } from './pages/user-update/user-update.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SaPropertiesListComponent } from './pages/sa-properties-list/sa-properties-list.component';
import { PropertyCreateComponent } from './pages/property-create/property-create.component';
import { TabsComponent } from '../../shared/tabs/tabs.component';
import { PropertyDetailsComponent } from './pages/property-create/steps/property-details/property-details.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PropertyMediaComponent } from './pages/property-create/steps/property-media/property-media.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { PropertyContactsComponent } from './pages/property-create/steps/property-contacts/property-contacts.component';
import { PropertyFeaturesComponent } from './pages/property-create/steps/property-features/property-features.component';
import { PropertyCertificationComponent } from './pages/property-create/steps/property-certification/property-certification.component';
import { PeopertyConfirmComponent } from './pages/property-create/steps/peoperty-confirm/peoperty-confirm.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageAttributesComponent } from './pages/manage-attributes/manage-attributes.component';
import { UnitListComponent } from './pages/unit-section/unit-list/unit-list.component';

const adminRoutes: Routes = [
  {
    path: 'admin', canActivate: [AuthGuard], component: AdminComponent,
    children: [
      { path: 'manage-users', component: UserManageComponent },
      { path: 'user-create', component: UserCreateComponent },
      { path: 'user-update/:id', component: UserUpdateComponent },
      { path: 'manage-properties', component: SaPropertiesListComponent },
      { path: 'create-properties', component: PropertyCreateComponent },
      { path: 'manage-attributes', component: ManageAttributesComponent },
      { path: 'view-property', component: PeopertyConfirmComponent },
    ]
  },

];

@NgModule({
  declarations: [UserManageComponent,
    UserCreateComponent, UserUpdateComponent,
    SaPropertiesListComponent, PropertyCreateComponent,
    TabsComponent,
    PropertyDetailsComponent,
    PropertyMediaComponent, 
    PropertyContactsComponent, 
    PropertyFeaturesComponent, 
    PropertyCertificationComponent, 
    PeopertyConfirmComponent, 
    ManageAttributesComponent, UnitListComponent],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    RouterModule.forChild(adminRoutes),
    BrowserModule,
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    AngularEditorModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    NgxFileDropModule,
    CdkDropList,
    NgbModalModule,
    CdkDrag
  ],
  exports: [RouterModule]
})
export class AdminModule { }
