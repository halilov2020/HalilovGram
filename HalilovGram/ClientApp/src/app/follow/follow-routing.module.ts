import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FollowersComponent } from './followers/followers.component';
import { FollowingsComponent } from './followings/followings.component';

const routes: Routes = [
  // https://environment.server/follow/...

  {
    path:'followers',
    component: FollowersComponent,
  },
  {
    path: 'followings',
    component: FollowingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowRoutingModule { }
