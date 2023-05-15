import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchFilter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val:any) => {
      //let rVal = (val.id.toLocaleLowerCase().includes(args)) || (val.name.toLocaleLowerCase().includes(args));
      let rVal = (val.name.toLowerCase().includes(args));
      return rVal;
    })

  }

}