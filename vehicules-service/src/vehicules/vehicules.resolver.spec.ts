import { Test, TestingModule } from '@nestjs/testing';
import { VehiculesResolver } from './vehicules.resolver';

describe('VehiculesResolver', () => {
  let resolver: VehiculesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiculesResolver],
    }).compile();

    resolver = module.get<VehiculesResolver>(VehiculesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
