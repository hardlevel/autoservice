import { Test, TestingModule } from '@nestjs/testing';
import { AutoserviceService } from './autoservice.service';

describe('AutoserviceService', () => {
  let service: AutoserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoserviceService],
    }).compile();

    service = module.get<AutoserviceService>(AutoserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
