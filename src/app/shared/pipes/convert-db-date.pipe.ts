import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDbDate',
})
export class ConvertDbDatePipe implements PipeTransform {
  transform(value: string): string {
    const date: Date = new Date(value);
    return `${date.getDate()} ${date.toLocaleString('default', {
      month: 'short',
    })} ${date.getFullYear()}`;
  }
}
