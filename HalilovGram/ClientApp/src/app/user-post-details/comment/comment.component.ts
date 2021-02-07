import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from 'src/app/_core/api/comments.service';
import { UserControllerService } from 'src/app/_core/api/user-controller.service';
import { CommentPost } from 'src/app/_core/models/CommentPost';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  isLiked:boolean;
  @Input() comment: CommentPost;
  constructor(
    private commentsService: CommentsService,
  ) { }

  ngOnInit(): void {
    this.commentsService.isLiked(this.comment.id.toString()).subscribe(
      (response:any) => {
        this.isLiked = response.isLiked;
      });
  }
  likeComment(){
    this.commentsService.likeComment(this.comment.id.toString()).subscribe(
      (response:any)=>{
        this.comment.likes = response.numLikes;
        this.isLiked = !this.isLiked;
      }
    )
  }
  getImgUrl(){
    // console.log(this.comment.imgUrl)
    if(this.comment.imgUrl != null){
      return environment.server + "/"+this.comment.imgUrl;
    }
    return "https://pbs.twimg.com/profile_images/740272510420258817/sd2e6kJy_400x400.jpg";
  }
}
