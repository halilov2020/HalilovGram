import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterData } from 'src/app/_core/models/RegisterData';
import { AccountService } from '../../_core/api/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;
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

  createForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      gender: [null, [Validators.required]],
      passwords: this.formBuilder.group({
        password: [null, [Validators.required, Validators.minLength(8)]],
        confPassword: [null, [Validators.required]]
      }, {validators: this.confPasswordMatchesValidator()})
    });
  }
  confPasswordMatchesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.get('password').value !== control.get('confPassword').value
        ? {confPass: true}
        : null;
    };
  }
  submit(): void {
    this.submitPressed = true;
    if (this.registerForm.invalid) {
      return;
    }

    const registerData: RegisterData = new RegisterData(
     this.registerForm.value.firstName,
      this.registerForm.value.lastName,
      this.registerForm.value.email,
      this.registerForm.value.passwords.password,
      this.registerForm.value.gender,
    );

    this.accountService.register(registerData).subscribe(
      (response:any) => { 
        if(response.status){
          this.success = true;
        }
       },
      (error) => {
        console.log(error)
      }
      );
  }

  gotoLogin(){
    this.router.navigateByUrl("/auth/login");
  }

  get firstName(): AbstractControl {
    return this.registerForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.registerForm.get('lastName');
  }

  get email(): AbstractControl {
    return this.registerForm.get('email');
  }

  get passwords(): AbstractControl {
    return this.registerForm.get('passwords');
  }

  get password(): AbstractControl {
    return this.registerForm.get('passwords').get('password');
  }

  get confPassword(): AbstractControl {
    return this.registerForm.get('passwords').get('confPassword');
  }

  get gender(): AbstractControl {
    return this.registerForm.get('gender');
  }
}
