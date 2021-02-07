export class UserPost{
    constructor(
      public id: number, 
      public title: string, 
      public text: string, 
      public imgUrl: string,
      public likes: number,
      public date:Date,
      public author: string, 
      ){}
  }