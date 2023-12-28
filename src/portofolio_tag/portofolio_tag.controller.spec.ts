import { Test, TestingModule } from '@nestjs/testing';
import { PortofolioTagController } from './portofolio_tag.controller';

describe('PortofolioTagController', () => {
  let controller: PortofolioTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortofolioTagController],
    }).compile();

    controller = module.get<PortofolioTagController>(PortofolioTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
