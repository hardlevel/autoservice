import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class MoneyPipe implements PipeTransform {
    transform(value: any): number {
        if (typeof value !== 'number') {
            throw new BadRequestException(`The value must be a number, but received ${typeof value}`);
        }

        if (value < 0) {
            throw new BadRequestException('The value must be a positive number.');
        }

        return Math.round(value * 100);
    }
}