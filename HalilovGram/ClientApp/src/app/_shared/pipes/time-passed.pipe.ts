import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePassed'
})
export class TimePassedPipe implements PipeTransform {

  transform(value: Date) {
    let result;
    let dateTime = new Date(value).getTime()/1000;
    let delta = new Date().getTime()/1000 - dateTime;

    if(delta < 60){
      result = " < 1 minute ago"; 
    }else if(delta < 3600){
      result = Math.floor(delta/60) + " minutes ago";
    }else if(delta < 86400){
      result = Math.floor(delta/3600) + " hours ago";
    }else if(delta < 86400){
      result = Math.floor(delta/3600) + " hours ago";
    }else if(delta < 432000){
      result = Math.floor(delta/86400) + " days ago";
    }
    return result!=null?result:value;
  }
}
