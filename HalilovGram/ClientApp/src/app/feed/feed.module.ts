import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed/feed.component';
import { UserPostComponent } from './user-post/user-post.component';
import { RouterModule } from '@angular/router';
import { TruncatePipe } from '../_shared/pipes/truncate.pipe';
import { LoaderComponent } from '../_shared/loader/loader.component';


@NgModule({
  declarations: [
    FeedComponent,
    UserPostComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    RouterModule,
  ],
  providers: [TruncatePipe]
})
export class FeedModule { }
