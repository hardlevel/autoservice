import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';

@Controller('autoservice')
export class AutoserviceController {
  constructor(private readonly autoserviceService: AutoserviceService) {}

  // @Get()
  // teste() {
  //   this.autoserviceService.addJob({ teste: 'aaa' })
  // }

  @Post()
  create(@Body() createAutoserviceDto: CreateAutoserviceDto) {
    return this.autoserviceService.create(createAutoserviceDto);
  }

  @Get()
  findAll() {
    return this.autoserviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autoserviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutoserviceDto: UpdateAutoserviceDto) {
    return this.autoserviceService.update(+id, updateAutoserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autoserviceService.remove(+id);
  }
}
