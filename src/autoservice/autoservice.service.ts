import { Inject, Injectable } from '@nestjs/common';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AutoserviceService {
  constructor(
    @InjectQueue('autoservice') private readonly autoserviceQueue: Queue,
    private readonly config: ConfigService
  ) {

  }

  async addJob(data: any) {
    await this.autoserviceQueue.add('process-autoservice-job', data);
    console.log('Job added to queue:', data);
  }

  create(createAutoserviceDto: CreateAutoserviceDto) {
    return 'This action adds a new autoservice';
  }

  findAll() {
    return `This action returns all autoservice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} autoservice`;
  }

  update(id: number, updateAutoserviceDto: UpdateAutoserviceDto) {
    return `This action updates a #${id} autoservice`;
  }

  remove(id: number) {
    return `This action removes a #${id} autoservice`;
  }
}
