import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(date: any, ...args: unknown[]): string {
    return formatDate(date, 'short', 'en-US');
  }
}
