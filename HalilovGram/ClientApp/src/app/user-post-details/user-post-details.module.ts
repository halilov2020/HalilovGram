import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPostDetailsRoutingModule } from './user-post-details-routing.module';
import { UserPostDetailsComponent } from './user-post-details/user-post-details.component';
import { CommentComponent } from './comment/comment.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TimePassedPipe } from '../_shared/pipes/time-passed.pipe';


@NgModule({
  declarations: [UserPostDetailsComponent, CommentComponent, AddCommentComponent,TimePassedPipe],
  imports: [
    CommonModule,
    UserPostDetailsRoutingModule,
    ReactiveFormsModule
  ],
  providers: [TimePassedPipe]
})
export class UserPostDetailsModule { }
