import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoserviceDto } from './create-autoservice.dto';

export class UpdateAutoserviceDto extends PartialType(CreateAutoserviceDto) {}
