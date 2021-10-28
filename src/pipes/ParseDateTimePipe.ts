import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDateTimePipe implements PipeTransform<string, Date> {
    transform(value: string): Date {
        const isValidDate = this.isDate(value)

        if (!isValidDate) {
            throw new BadRequestException('Invalid Datetime string');
        }

        return new Date(value)
    }

    isDate(dateString) {
        // @ts-ignore
        return (new Date(dateString) !== "Invalid Date") && !isNaN(new Date(dateString));
    }
}
