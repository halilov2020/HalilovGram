import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPostModule } from './new-post/new-post.module';
import { AuthGuard } from './_core/guards/auth.guard';

const routes: Routes = [
  {
    path:"auth",
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: "feed",
    canActivate: [AuthGuard],
    loadChildren: () => import("./feed/feed.module").then(m => m.FeedModule)
  },
  {
    path: "profile",
    canActivate:[AuthGuard],
    loadChildren: () => import("./profile/profile.module").then(m => m.ProfileModule)
  },
  {
    path: "edit",
    canActivate: [AuthGuard],
    loadChildren: () => import("./profile-edit/profile-edit.module").then(m => m.ProfileEditModule)
  },
  {
    path: "user-post-details",
    canActivate: [AuthGuard],
    loadChildren: () => import("./user-post-details/user-post-details.module").then(m => m.UserPostDetailsModule)
  },
  {
    path:"follow",
    canActivate: [AuthGuard],
    loadChildren: () => import("./follow/follow.module").then(m => m.FollowModule)
  },
  {
    path: "new-post",
    canActivate: [AuthGuard],
    loadChildren: () => import("./new-post/new-post.module").then(m => m.NewPostModule)
  },
  {
    path:"settings",
    canActivate: [AuthGuard],
    loadChildren: () => import("./settings/settings.module").then(m => m.SettingsModule)
  },
  {
    path:"users",
    canActivate: [AuthGuard],
    loadChildren: () => import("./users/users.module").then(m => m.UsersModule)
  },
  {
    path:"**",
    loadChildren: () => import("./page-not-found/page-not-found.module").then(m => m.PageNotFoundModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
