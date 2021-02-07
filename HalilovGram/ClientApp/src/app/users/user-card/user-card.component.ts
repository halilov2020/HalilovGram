import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FollowService } from 'src/app/_core/api/follow.service';
import { ProfileUser } from 'src/app/_core/models/ProfileUser';
import { TokenDecoderService } from 'src/app/_core/services/token-decoder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  isMyAccount:boolean;
  isUserSubscribed:boolean;

  @Input() user:ProfileUser;
  constructor(
    private followService:FollowService,
    private tokenDecoder:TokenDecoderService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.isMyAccount = this.isMyProfile();
    this.isSubscribed();
  }
  getImgUrl(){
    if(this.user.imgUrl != null){
      return environment.server + "/" + this.user.imgUrl;
    }
    return "https://pbs.twimg.com/profile_images/740272510420258817/sd2e6kJy_400x400.jpg";
  }
  isMyProfile():boolean {
    if(this.tokenDecoder.id == this.user.id){
      return true;
    }
    return false;
  }
  isSubscribed(){
    this.followService.isFollowed(this.user.id).subscribe(
      (response:any) => {
        this.isUserSubscribed = response.isFollowed
      }
    );
  }
  follow(){
    this.followService.follow(this.user.id).subscribe(
      (response:any) => {
        console.log(response);
        window.location.reload();
      }
    );
  }
  unfollow(){
    this.followService.unfollow(this.user.id).subscribe(
      (response:any) => {
        console.log(response);
        window.location.reload();
      }
    );
  }
  checkProfile(){
    this.router.navigateByUrl("/profile/"+this.user.id);
  }
}
