import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewPostRoutingModule } from './new-post-routing.module';
import { NewPostComponent } from './new-post/new-post.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { Http } from '@angular/common/http';


@NgModule({
  declarations: [NewPostComponent],
  imports: [
    CommonModule,
    NewPostRoutingModule,
    ReactiveFormsModule,
  ]
})
export class NewPostModule { }
