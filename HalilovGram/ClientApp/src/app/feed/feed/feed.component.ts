import { Component, OnInit } from '@angular/core';
import { SortType } from 'src/app/_core/constants/sort-type.enum';
import { UserPost } from 'src/app/_core/models/UserPost';
import { Filters } from 'src/app/_core/models/Filters';
import { PostsService } from '../../_core/api/posts.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  userPosts: UserPost[];
  sortType: SortType = SortType.POPULAR_DESCENDING;
  filters:Filters = new Filters(0, 3, this.sortType);
  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.getUserPosts();
  }

  getUserPosts(){
    this.filters.sortType = this.sortType;
    this.postsService.getPosts(this.filters).subscribe(
      (response:UserPost[]) => {
        if(!this.userPosts){
          this.userPosts = response;
        }else{
          this.userPosts = [...this.userPosts, ...response];
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  loadMore(){
    this.filters.page++;
    this.getUserPosts();
  }

  sortNewest(){
    switch(this.sortType){
      case SortType.POPULAR_ASCENDING:
        this.userPosts = null;
        this.sortType = SortType.NEWEST_ASCENDING;
        this.getUserPosts();
        break;
      case SortType.POPULAR_DESCENDING:
        this.userPosts = null;
        this.sortType = SortType.NEWEST_ASCENDING;
        this.getUserPosts();
        break;
      case SortType.NEWEST_ASCENDING:
        this.userPosts = null;
        this.sortType = SortType.NEWEST_DESCENDING;
        this.getUserPosts();
        break;
      case SortType.NEWEST_DESCENDING:
        this.userPosts = null;
        this.sortType = SortType.NEWEST_ASCENDING;
        this.getUserPosts();
        break;
    }
  }

  sortPopular(){
    switch(this.sortType){
      case SortType.NEWEST_ASCENDING:
        this.userPosts = null;
        this.sortType = SortType.POPULAR_ASCENDING;
        this.getUserPosts();
        break;
      case SortType.NEWEST_DESCENDING:
        this.userPosts = null;
        this.sortType = SortType.POPULAR_ASCENDING;
        this.getUserPosts();
        break;
      case SortType.POPULAR_ASCENDING:
        this.userPosts = null;
        this.sortType = SortType.POPULAR_DESCENDING;
        this.getUserPosts();
        break;
      case SortType.POPULAR_DESCENDING:
        this.userPosts = null;
        this.sortType = SortType.POPULAR_ASCENDING;
        this.getUserPosts();
        break;
    }
  }
}