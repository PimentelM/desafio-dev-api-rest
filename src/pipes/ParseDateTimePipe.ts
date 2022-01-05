import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDateTimePipe implements PipeTransform<any, Date> {
  transform(value?: any): Date {
    if (value === undefined) return undefined;

    const isValidDate = this.isDate(value);

    if (!isValidDate) {
      throw new BadRequestException('Invalid Datetime string');
    }

    return new Date(value);
  }

  isDate(dateString) {
    // @ts-ignore
    return (
      new Date(dateString) !== 'Invalid Date' && !isNaN(new Date(dateString))
    );
  }
}
