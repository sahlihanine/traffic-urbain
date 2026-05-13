import { Module } from '@nestjs/common';
import { VehiculesService } from './vehicules.service';
import { VehiculesResolver } from './vehicules.resolver';

@Module({
  providers: [VehiculesService, VehiculesResolver]
})
export class VehiculesModule {}
