import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/_core/models/LoginData';
import { AccountService } from '../../_core/api/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  submitPressed:boolean = false;
  success:boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private accountService: AccountService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm():void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    });
  }
  
  submit():void {
    this.submitPressed = true;
    if(this.loginForm.invalid){
      return;
    }

    const loginData: LoginData = new LoginData(
      this.loginForm.value.email,
      this.loginForm.value.password
    );

    this.accountService.login(loginData).subscribe(
      (response:any)=>{
        window.localStorage.setItem("token", response.token);
        this.success = true;
        this.router.navigate(["/feed"]);
    });
    
  }

  gotoRegister() {
    this.router.navigateByUrl("/auth/register");
  }
  get email():AbstractControl {
    return this.loginForm.get('email');
  }

  get password():AbstractControl{
    return this.loginForm.get('password');
  }
}
