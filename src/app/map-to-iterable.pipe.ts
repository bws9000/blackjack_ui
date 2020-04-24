import {Pipe, PipeTransform} from '@angular/core';
import {environment} from "../environments/environment";

@Pipe({
  name: 'mapToIterable'
})
export class MapToIterablePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //this.logStuff(Array.from(value));
    return Array.from(value);
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
