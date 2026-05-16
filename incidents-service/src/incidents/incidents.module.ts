import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsService } from './incidents.service';
import { IncidentsResolver } from './incidents.resolver';
import { Incident } from './entities/incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  providers: [IncidentsService, IncidentsResolver],
})
export class IncidentsModule {}