import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowRoutingModule } from './follow-routing.module';
import { FollowersComponent } from './followers/followers.component';
import { FollowingsComponent } from './followings/followings.component';
import { FollowerCardComponent } from './follower-card/follower-card.component';


@NgModule({
  declarations: [FollowersComponent, FollowingsComponent, FollowerCardComponent],
  imports: [
    CommonModule,
    FollowRoutingModule
  ]
})
export class FollowModule { }
