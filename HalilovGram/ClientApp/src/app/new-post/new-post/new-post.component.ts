import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewPost } from 'src/app/_core/models/NewPost';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  newPostForm: FormGroup = new FormGroup({
    postTitle : new FormControl(),
    postText: new FormControl(),
  });
  selectedFile: File = null;
  postImgPath: string = null;
  postAddSuccess: boolean = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.newPostForm = this.formBuilder.group({
      postTitle: [null, [Validators.required]],
      postText: [null, [Validators.required]]
    });
  }

  onChanged(event){
    this.selectedFile = <File>event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.selectedFile, Date.now().toString()+"."+this.getFileType(this.selectedFile.name));
    this.http.post(environment.server + "/post/UploadImage", formData).subscribe(
      (res:any) => {
        this.postImgPath = res.dbPath;
      }
    );
  }
  
  onSubmit(){
    if(this.newPostForm.invalid){
      return;
    }

    const newPost:NewPost = new NewPost(
      this.newPostForm.value.postTitle,
      this.newPostForm.value.postText,
      this.postImgPath
    );

    this.http.post(environment.server + "/post/CreatePost", newPost).subscribe(
      (response)=>{
        this.postAddSuccess = true;
      }
    );
  }

  getFileType(name:string):string {
    const array = name.split(".");
    return array[array.length-1];
  }

  get postTitle():AbstractControl {
    return this.newPostForm.get('postTitle');
  }
  get postText():AbstractControl {
    return this.newPostForm.get('postText');
  }
}
