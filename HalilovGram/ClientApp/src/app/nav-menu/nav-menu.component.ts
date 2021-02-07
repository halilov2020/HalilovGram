import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenDecoderService } from '../_core/services/token-decoder.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  token:string;

  constructor(
    private router:Router,
    private tokenDecoder:TokenDecoderService,
  ) { }

  ngOnInit(): void {
    this.token = window.localStorage.getItem("token");
  }
  gotoMyProfile(){
    this.router.navigate(["profile/" + this.tokenDecoder.id])
  }

}
