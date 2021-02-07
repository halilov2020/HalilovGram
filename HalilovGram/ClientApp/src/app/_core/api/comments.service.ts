import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommentData } from '../models/CommentData';
import { Filters } from '../models/Filters';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private readonly resourceUrl: string = "/comment";
  private readonly baseUrl: string = environment.server;
  
  constructor(
    private http:HttpClient
  ) { }

  addComment(comment:CommentData) {
    return this.http.post(this.baseUrl + this.resourceUrl + "/addComment", comment);
  }
  getComments(filters:Filters, postId:string){
    const params:HttpParams = new HttpParams()
      .set("postId", postId)
      .set("pageNumber", filters.page.toString())
      .set("pageSize", filters.size.toString())
      .set("sortType", filters.sortType.toString())

    return this.http.get(this.baseUrl + this.resourceUrl + "/getComments", {params: params});
  }

  isLiked(commentId:string){
    const params: HttpParams = new HttpParams()
      .set("commentId", commentId);

    return this.http.get(this.baseUrl + this.resourceUrl + "/isLiked", {params: params});
  }
  likeComment(commentId:string){
    const params:HttpParams = new HttpParams()
      .set("commentId", commentId);

    return this.http.get(this.baseUrl + this.resourceUrl + "/likeComment", {params: params});
  }
}
