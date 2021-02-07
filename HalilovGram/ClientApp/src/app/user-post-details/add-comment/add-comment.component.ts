import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from 'src/app/_core/api/comments.service';
import { UserControllerService } from 'src/app/_core/api/user-controller.service';
import { CommentData } from 'src/app/_core/models/CommentData';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  addCommentForm: FormGroup;
  submitPressed: boolean = false;
  success: boolean = false;
  userAvatar: string;

  constructor(
    private formBuilder: FormBuilder,
    private commentsService: CommentsService,
    private activatedRoute: ActivatedRoute,
    private userService: UserControllerService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.setUserAvatar();
  }

  createForm(): void{
    this.addCommentForm = this.formBuilder.group({
      comment:[null, [Validators.required]]
    });
  }

  submit():void {
    this.submitPressed = true;
    if(this.addCommentForm.invalid){
      return;
    }

    const commentData: CommentData = new CommentData(
      this.addCommentForm.value.comment,
      parseInt(this.activatedRoute.snapshot.params.id)
    )
    // console.log(commentData)
    this.commentsService.addComment(commentData).subscribe(
      (response:any) => {
        // console.log(response);
        this.success = true;
        window.location.reload();
      }
    );
  }

  setUserAvatar(){
    this.userService.getUserAvatar().subscribe(
      (response:any) => {
        this.userAvatar = response.imgUrl;
      }
    );
  }
  getUserAvatar(){
    if(this.userAvatar == null){
      return "https://pbs.twimg.com/profile_images/740272510420258817/sd2e6kJy_400x400.jpg";
    }else {
      return environment.server + "/" + this.userAvatar;
    }
  }
  get comment():AbstractControl {
    return this.addCommentForm.get('comment');
  }
}
