import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { FollowService } from 'src/app/_core/api/follow.service';
import { PostsService } from 'src/app/_core/api/posts.service';
import { SortType } from 'src/app/_core/constants/sort-type.enum';
import { Filters } from 'src/app/_core/models/Filters';
import { ProfileUser } from 'src/app/_core/models/ProfileUser';
import { UserPost } from 'src/app/_core/models/UserPost';
import { TokenDecoderService } from 'src/app/_core/services/token-decoder.service';
import { environment } from 'src/environments/environment';
import { UserControllerService } from '../../_core/api/user-controller.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  success:boolean = false;
  isMyAccount:boolean;
  isUserSubscribed:boolean;
  sortType:SortType = SortType.POPULAR_DESCENDING;
  filters:Filters = new Filters(0, 3, this.sortType);
  postsNumber:number;
  userPosts:UserPost[];
  
  @Input() user: ProfileUser;
  constructor(
    private userController: UserControllerService,
    private route: ActivatedRoute,
    private tokenDecoder: TokenDecoderService,
    private followService:FollowService,
    private postsService:PostsService,
  ) { }

  ngOnInit(){
    this.getUserProfile();
    this.isMyAccount = this.isMyProfile();
    this.isSubscribed();
    this.getUserPosts();
  }
  isMyProfile():boolean {
    if(this.tokenDecoder.id == this.route.snapshot.paramMap.get('id')){
      return true;
    }
    return false;
  }

  getUserProfile(){
    this.userController.getUserById(this.route.snapshot.paramMap.get('id')).subscribe(
      (response:ProfileUser)=>{
        this.user = response;
        this.success = true;
      },
      (error)=>{
        console.log(error)
      }
    );
  }
  
  isSubscribed(){
    this.followService.isFollowed(this.route.snapshot.paramMap.get('id')).subscribe(
      (response:any) => {
        this.isUserSubscribed = response.isFollowed
      }
    );
  }
  follow(){
    this.followService.follow(this.route.snapshot.paramMap.get('id')).subscribe(
      (response:any) => {
        console.log(response);
        window.location.reload();
      }
    );
  }
  unfollow(){
    this.followService.unfollow(this.route.snapshot.paramMap.get('id')).subscribe(
      (response:any) => {
        console.log(response);
        window.location.reload();
      }
    );
  }
  getImgUrl(){
    if(this.user.imgUrl != null){
      return environment.server + "/" + this.user.imgUrl;
    }
    return "https://pbs.twimg.com/profile_images/740272510420258817/sd2e6kJy_400x400.jpg";
  }

  loadMore(){
    this.filters.page++;
    this.getUserPosts();
  }
  getUserPosts() {
    this.filters.sortType = this.sortType;
    this.postsService.getMyPosts(this.filters, this.route.snapshot.paramMap.get('id')).subscribe(
      (response:UserPost[]) => {
        if(!this.userPosts){
          this.userPosts = response;
        }else{
          this.userPosts = [...this.userPosts, ...response];
        }
        this.postsNumber = this.userPosts.length;
      },
      (error) => {
        console.log(error);
      }
    )
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
