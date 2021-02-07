import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenDecoderService {
  decodedToken:any;
  userId:string;

  constructor() {
    if(localStorage.getItem("token")){
      this.decodedToken = this.getDecodedAccessToken(localStorage.getItem("token"));
      this.getTokenData();
    }
  }

  getDecodedAccessToken(token:string){
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }

  getTokenData(){
    this.userId = this.decodedToken.id;
  }

  get id():string{
    return this.userId;
  }
}
