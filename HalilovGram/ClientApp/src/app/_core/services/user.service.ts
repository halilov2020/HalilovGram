import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firstNameSubject:Subject<string> = new Subject<string>();
  firstNameStream:Observable<string> = this.firstNameSubject.asObservable();

  constructor() { }

  addFirstName(firstName:string){
    this.firstNameSubject.next(firstName);
  }

}
