import { Test, TestingModule } from '@nestjs/testing';
import { AssobravController } from './assobrav.controller';

describe('AssobravController', () => {
  let controller: AssobravController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssobravController],
    }).compile();

    controller = module.get<AssobravController>(AssobravController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
