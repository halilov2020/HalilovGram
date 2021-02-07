import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileEditRoutingModule } from './profile-edit-routing.module';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProfileEditComponent],
  imports: [
    CommonModule,
    ProfileEditRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProfileEditModule { }
