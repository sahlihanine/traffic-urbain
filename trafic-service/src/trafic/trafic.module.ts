import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraficService } from './trafic.service';
import { TraficResolver } from './trafic.resolver';
import { TrafficZone } from './entities/traffic-zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrafficZone])],
  providers: [TraficService, TraficResolver],
})
export class TraficModule {}