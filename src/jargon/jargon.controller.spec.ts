import { Test, TestingModule } from '@nestjs/testing';
import { JargonController } from './jargon.controller';

describe('JargonController', () => {
  let controller: JargonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JargonController],
    }).compile();

    controller = module.get<JargonController>(JargonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
