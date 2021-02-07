import { Component, OnInit } from '@angular/core';
import { FollowService } from 'src/app/_core/api/follow.service';
import { Follower } from 'src/app/_core/models/Follower';
import { TokenDecoderService } from 'src/app/_core/services/token-decoder.service';

@Component({
  selector: 'app-followings',
  templateUrl: './followings.component.html',
  styleUrls: ['./followings.component.css']
})
export class FollowingsComponent implements OnInit {

  followings:Follower[];

  constructor(
    private followService:FollowService,
    private tokenDecoder:TokenDecoderService
  ) { }

  ngOnInit(){
    this.getFollowings();
  }

  getFollowings() {
    this.followService.getFollowings(this.tokenDecoder.id).subscribe(
      (response:Follower[]) =>{
        this.followings = response;
      }
    )
  }
}