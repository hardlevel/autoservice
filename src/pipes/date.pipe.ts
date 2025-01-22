import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class DatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return new Date(value);
  }
}