import { Test, TestingModule } from '@nestjs/testing';
import { AutoserviceController } from './autoservice.controller';
import { AutoserviceService } from './autoservice.service';

describe('AutoserviceController', () => {
  let controller: AutoserviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoserviceController],
      providers: [AutoserviceService],
    }).compile();

    controller = module.get<AutoserviceController>(AutoserviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
