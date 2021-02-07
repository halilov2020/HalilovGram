export class ProfileUser{
    constructor(
      public id:string,
      public firstName:string,
      public lastName:string,
      public email:string,
      public gender:string,
      public dateOfBirth:string,
      public city:string,
      public country:string,
      public imgUrl:string,
      public followed:number,
      public follows:number
    ){}
}