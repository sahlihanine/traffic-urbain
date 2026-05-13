import { Test, TestingModule } from '@nestjs/testing';
import { TraficResolver } from './trafic.resolver';

describe('TraficResolver', () => {
  let resolver: TraficResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraficResolver],
    }).compile();

    resolver = module.get<TraficResolver>(TraficResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
