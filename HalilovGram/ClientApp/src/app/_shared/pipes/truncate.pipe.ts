import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncatePipe'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number): string {
    if(value.length > limit){
      return value.slice(0, limit)+"...";
    }
    return value;
  }

}
