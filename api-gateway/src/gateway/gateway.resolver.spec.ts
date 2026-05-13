import { Test, TestingModule } from '@nestjs/testing';
import { GatewayResolver } from './gateway.resolver';

describe('GatewayResolver', () => {
  let resolver: GatewayResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewayResolver],
    }).compile();

    resolver = module.get<GatewayResolver>(GatewayResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
