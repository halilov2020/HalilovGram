import { Component, OnInit } from '@angular/core';
import { UserControllerService } from 'src/app/_core/api/user-controller.service';
import { SortType } from 'src/app/_core/constants/sort-type.enum';
import { Filters } from 'src/app/_core/models/Filters';
import { ProfileUser } from 'src/app/_core/models/ProfileUser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users:ProfileUser[];
  sortType:SortType = SortType.POPULAR_DESCENDING;
  filters:Filters = new Filters(0, 2, this.sortType);

  constructor(
    private userService: UserControllerService,
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(){
    this.filters.sortType = this.sortType;
    this.userService.getUsers(this.filters).subscribe(
      (response:ProfileUser[]) => {
        if(this.users == null){
          this.users = response;
        }else{
          this.users = [...this.users, ...response];
        }
      }
    );
  }

  loadMore(){
    this.filters.page++;
    this.getUsers();
  }

  sortPopular(){
    switch(this.sortType){
      case SortType.POPULAR_ASCENDING:
        this.users = null;
        this.sortType = SortType.POPULAR_DESCENDING;
        this.getUsers();
        break;
      case SortType.POPULAR_DESCENDING:
        this.users = null;
        this.sortType = SortType.POPULAR_ASCENDING;
        this.getUsers();
        break;
    }
  }
}
