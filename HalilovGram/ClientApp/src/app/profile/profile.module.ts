import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserPostComponent } from './user-post/user-post.component';
import { TruncatePipe } from '../_shared/pipes/truncate.pipe';


@NgModule({
  declarations: [
    ProfileComponent,
    UserPostComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    HttpClientModule
  ],
  providers: []
})
export class ProfileModule { }
