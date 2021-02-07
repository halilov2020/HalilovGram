import { Data } from "@angular/router";

export class CommentPost{
    constructor(
       public id: number,
       public text:string,
       public date: Date,
       public author: string,
       public imgUrl:string,
       public likes:number,
    ){ }
}