import { Test, TestingModule } from '@nestjs/testing';
import { PortofolioTagService } from './portofolio_tag.service';

describe('PortofolioTagService', () => {
  let service: PortofolioTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortofolioTagService],
    }).compile();

    service = module.get<PortofolioTagService>(PortofolioTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
