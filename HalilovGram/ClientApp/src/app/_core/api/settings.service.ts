import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly baseUrl:string = environment.server;
  private readonly resourceUrl:string = "/settings";

  constructor(
    private http:HttpClient,
  ) { }

  changePassword(body){
    return this.http.post(this.baseUrl + this.resourceUrl + "/changePassword", body);
  }
}
