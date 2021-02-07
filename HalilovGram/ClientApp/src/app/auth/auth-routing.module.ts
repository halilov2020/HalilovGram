import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnSavedChangesGuard } from '../_core/guards/un-saved-changes.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // https://environment.server/auth/...
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    canDeactivate: [UnSavedChangesGuard],
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
