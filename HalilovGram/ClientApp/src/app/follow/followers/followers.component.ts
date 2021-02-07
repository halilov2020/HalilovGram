import { Component, OnInit } from '@angular/core';
import { FollowService } from 'src/app/_core/api/follow.service';
import { Follower } from 'src/app/_core/models/Follower';
import { TokenDecoderService } from 'src/app/_core/services/token-decoder.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  followers:Follower[];

  constructor(
    private followService:FollowService,
    private tokenDecoder:TokenDecoderService
  ) { }

  ngOnInit(){
    this.getFollowers();
  }

  getFollowers() {
    this.followService.getFollowers(this.tokenDecoder.id).subscribe(
      (response:Follower[]) =>{
        this.followers = response;
      }
    )
  }


}
