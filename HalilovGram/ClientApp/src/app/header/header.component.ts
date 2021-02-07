import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenDecoderService } from '../_core/services/token-decoder.service';
import { UserService } from '../_core/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  token:string;
  firstName:string;
  
  constructor(
    private userService:UserService,
    private router:Router,
    private tokenDecoder: TokenDecoderService
    ) { 
    this.userService.firstNameStream.subscribe((firstName:string)=>{
      this.firstName = firstName;
    });
  }

  ngOnInit(): void {
    this.token = window.localStorage.getItem("token");
  }
  profileExit(){
    localStorage.removeItem("token");
    window.location.reload();
  }



}
