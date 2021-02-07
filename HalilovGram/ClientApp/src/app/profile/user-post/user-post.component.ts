import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/_core/api/posts.service';
import { UserPost } from 'src/app/_core/models/UserPost';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.css']
})
export class UserPostComponent implements OnInit {
  isLiked:boolean;

  @Input() userPost: UserPost;
  constructor(
    private router: Router,
    private postsService: PostsService,
    ) { }

  ngOnInit(): void {
    this.postsService.isLiked(this.userPost.id).subscribe(
      (response:any) => {
        this.isLiked = response.isLiked;
      });
  }

  showUserPostDetails(): void {
    this.router.navigate(["user-post-details/"+this.userPost.id]);
  }

  likePost(){
    this.postsService.likePost(this.userPost.id).subscribe(
      (response:any)=>{
        this.userPost.likes = response.numLikes;
        this.isLiked = !this.isLiked;
      }
    )
  }
  
  getImgUrl(){
    return environment.server + "/"+this.userPost.imgUrl;
  }
}
