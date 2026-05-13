import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TraficModule } from './trafic/trafic.module';

@Module({
  imports: [TraficModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
