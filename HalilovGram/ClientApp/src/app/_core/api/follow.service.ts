import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  
  private readonly resourceUrl: string = "/follow";
  private readonly baseUrl: string = environment.server;

  constructor(
    private http:HttpClient
  ) { }

  follow(userToFollowId:string){
    const params:HttpParams = new HttpParams().set("userToFollowId", userToFollowId);
    return this.http.get(this.baseUrl + this.resourceUrl + "/follow", {params: params});
  }
  unfollow(userToFollowId:string){
    const params:HttpParams = new HttpParams().set("userToFollowId", userToFollowId);
    return this.http.get(this.baseUrl + this.resourceUrl + "/unfollow", {params: params});
  }
  isFollowed(userToFollowId:string){
    const params:HttpParams = new HttpParams().set("userToFollowId", userToFollowId);
    return this.http.get(this.baseUrl + this.resourceUrl + "/isFollowed", {params: params});
  }
  getFollowers(userId:string){
    const params:HttpParams = new HttpParams().set("userId", userId);
    return this.http.get(this.baseUrl + this.resourceUrl + "/getFollowers", {params: params});
  }
  getFollowings(userId:string){
    const params:HttpParams = new HttpParams().set("userId", userId);
    return this.http.get(this.baseUrl + this.resourceUrl + "/getFollowings", {params: params});
  }
}