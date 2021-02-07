import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from 'src/app/_core/api/comments.service';
import { PostsService } from 'src/app/_core/api/posts.service';
import { SortType } from 'src/app/_core/constants/sort-type.enum';
import { CommentData } from 'src/app/_core/models/CommentData';
import { Filters } from 'src/app/_core/models/Filters';
import { CommentPost } from 'src/app/_core/models/CommentPost';
import { UserPost } from 'src/app/_core/models/UserPost';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-post-details',
  templateUrl: './user-post-details.component.html',
  styleUrls: ['./user-post-details.component.css']
})
export class UserPostDetailsComponent implements OnInit {
  id: string;
  loading: boolean = true;
  userComments: CommentPost[];
  sortType: SortType = SortType.POPULAR_DESCENDING;
  Filters:Filters = new Filters(0, 10, this.sortType);
  
  @Input() userPost:UserPost;
  constructor(
    private activatedRoute:ActivatedRoute,
    private postsService:PostsService,
    private commentsService:CommentsService
    ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.postsService.getPostById(parseInt(this.id)).subscribe(
      (response:UserPost) => {
        this.userPost = response;
        this.loading = false;
        this.getComments();
      }
    );
  }
  getComments(){
    this.Filters.sortType = this.sortType;
    this.commentsService.getComments(this.Filters, this.userPost.id.toString()).subscribe(
      (response:CommentPost[]) => {
        if(!this.userComments){
          this.userComments = response;
        }else{
          this.userComments = [...this.userComments, ...response];
        }
      }
    )
  }
  getImgUrl(){
    return environment.server + "/"+this.userPost.imgUrl;
  }
}
