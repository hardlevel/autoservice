import { Test, TestingModule } from '@nestjs/testing';
import { AssobravService } from './assobrav.service';

describe('AssobravService', () => {
  let service: AssobravService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssobravService],
    }).compile();

    service = module.get<AssobravService>(AssobravService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
