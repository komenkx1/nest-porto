import { Test, TestingModule } from '@nestjs/testing';
import { JargonService } from './jargon.service';

describe('JargonService', () => {
  let service: JargonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JargonService],
    }).compile();

    service = module.get<JargonService>(JargonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
