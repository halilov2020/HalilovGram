import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/_core/api/settings.service';
import { UserControllerService } from 'src/app/_core/api/user-controller.service';
import { ChangePasswordData } from 'src/app/_core/models/ChangePasswordData';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  submitPressed:boolean = false;
  success:boolean = false;
  changePasswordGroup:FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private settingsService:SettingsService,
    private userService:UserControllerService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.changePasswordGroup = this.formBuilder.group({
      password: [null, [Validators.required]],
      passwords: this.formBuilder.group({
        newPassword: [null, [Validators.required, Validators.minLength(8)]],
        confPassword: [null, [Validators.required]]
      }, {validators: this.confPasswordMatchesValidator()})
    });
  }
  
  confPasswordMatchesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.get('newPassword').value !== control.get('confPassword').value
        ? {confPass: true}
        : null;
    };
  }
  changePassword(){
    this.submitPressed = true;
    if(this.changePasswordGroup.invalid){
      return;
    }
    const changePassword:ChangePasswordData = new ChangePasswordData(
      this.changePasswordGroup.value.password,
      this.changePasswordGroup.value.passwords.newPassword
    );

    this.settingsService.changePassword(changePassword).subscribe(
      (response:any) => {
        console.log(response);
        this.success = true;
      }
    );
  }

  deleteAccount(){
    this.userService.deleteAccount().subscribe(
      (response:any) => {
        if(response.status){
          window.localStorage.removeItem("token");
          window.location.reload;
        }
      }
    );
  }

  get password():AbstractControl {
    return this.changePasswordGroup.get('password');
  }
  get passwords():AbstractControl {
    return this.changePasswordGroup.get('passwords');
  }
  get newPassword():AbstractControl {
    return this.changePasswordGroup.get('passwords').get('newPassword');
  }
  get confPassword():AbstractControl {
    return this.changePasswordGroup.get('passwords').get('confPassword');
  }
}
