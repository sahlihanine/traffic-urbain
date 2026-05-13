import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiculesModule } from './vehicules/vehicules.module';

@Module({
  imports: [VehiculesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
