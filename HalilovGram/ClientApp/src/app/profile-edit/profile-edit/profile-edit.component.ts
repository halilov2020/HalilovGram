import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserControllerService } from 'src/app/_core/api/user-controller.service';
import { EditData } from 'src/app/_core/models/EditData';
import { ProfileUser } from 'src/app/_core/models/ProfileUser';
import { TokenDecoderService } from 'src/app/_core/services/token-decoder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  editForm:FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    gender: new FormControl(),
    dateOfBirth: new FormControl(),
    city: new FormControl(),
    country: new FormControl()
  }); 
  submitPressed: boolean = false;
  success: boolean = false;
  user:ProfileUser;
  selectedFile: File = null;
  fileUploaded: boolean = false;
  imgUrl:string;

  constructor(
    private formBuilder:FormBuilder,
    private userController: UserControllerService,
    private tokenDecoder: TokenDecoderService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getUserProfile();
    // this.createForm();
  }

  getUserProfile(){
    this.userController.getUserById(this.tokenDecoder.id).subscribe(
      (response:ProfileUser) => {
        this.user = response;
        this.createForm();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm():void{
    this.editForm = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      gender: [this.user.gender, [Validators.required]],
      dateOfBirth: [this.user.dateOfBirth],
      city: [this.user.city],
      country: [this.user.country]
    });
  }

  submit():void{
    this.submitPressed = true;
    if(this.editForm.invalid){
      return;
    }
    const editData: EditData = new EditData(
      this.editForm.value.firstName,
      this.editForm.value.lastName,
      this.editForm.value.email,
      this.editForm.value.gender,
      this.editForm.value.dateOfBirth,
      this.editForm.value.city,
      this.editForm.value.country,
      this.imgUrl
    );
      this.userController.updateProfile(editData).subscribe(
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

  onChanged(event){
    this.selectedFile = <File>event.target.files[0];
    const formData:FormData = new FormData();
    formData.append('file', this.selectedFile, Date.now().toString()+"."+this.getFileType(this.selectedFile.name));
    this.http.post(environment.server + "/user/UploadAvatar", formData).subscribe(
      (response:any)=>{
        this.fileUploaded = true;
        this.imgUrl = response.dbPath;
        console.log(this.imgUrl)
      }
    );
  }
  getFileType(name: string) {
      const array = name.split(".");
      return array[array.length-1];
  }

  get firstName():AbstractControl {
    return this.editForm.get('firstName');
  }
  get lastName():AbstractControl {
    return this.editForm.get('lastName');
  }
  get email():AbstractControl {
    return this.editForm.get('email');
  }
  get gender():AbstractControl {
    return this.editForm.get('gender');
  }
  get dateOfBirth():AbstractControl {
    return this.editForm.get('dateOfBirth');
  }
  get city():AbstractControl {
    return this.editForm.get('city');
  }
  get country():AbstractControl {
    return this.editForm.get('country');
  }
}
