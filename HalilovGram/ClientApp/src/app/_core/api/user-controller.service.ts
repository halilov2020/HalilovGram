import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserControllerService {
  private readonly resourceUrl: string = "/user";
  private readonly baseUrl: string = environment.server;
  constructor(
    private http:HttpClient,
  ) { }

  getUserById(id){
    let params:HttpParams = new HttpParams().set("Id", id);
    return this.http.get(this.baseUrl + this.resourceUrl + "/getbyid", {params: params});
  }
  getUsers(filters){
    let params:HttpParams = new HttpParams()
      .set("pageNumber", filters.page)
      .set("pageSize", filters.size)
      .set("sortType", filters.sortType)
      
    return this.http.get(this.baseUrl + this.resourceUrl + "/getUsers", {params:params});
  }
  updateProfile(body){
    return this.http.post(this.baseUrl + this.resourceUrl + "/update", body);
  }
  getUserAvatar(){
    return this.http.get(this.baseUrl + this.resourceUrl + "/getUserAvatar");
  }
  deleteAccount(){
    return this.http.delete(this.baseUrl + this.resourceUrl + "/deleteAccount");
  }
}
