import { Module } from '@nestjs/common';
import { TraficService } from './trafic.service';
import { TraficResolver } from './trafic.resolver';

@Module({
  providers: [TraficService, TraficResolver]
})
export class TraficModule {}
