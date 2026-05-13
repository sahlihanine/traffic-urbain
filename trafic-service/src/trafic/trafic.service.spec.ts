import { Test, TestingModule } from '@nestjs/testing';
import { TraficService } from './trafic.service';

describe('TraficService', () => {
  let service: TraficService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraficService],
    }).compile();

    service = module.get<TraficService>(TraficService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
