import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculesService } from './vehicules.service';
import { VehiculesResolver } from './vehicules.resolver';
import { Vehicle } from './entities/vehicle.entity';
import { GpsPosition } from './entities/gps-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, GpsPosition])],
  providers: [VehiculesService, VehiculesResolver],
})
export class VehiculesModule {}
