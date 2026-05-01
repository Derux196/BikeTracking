import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MotocicletasModule } from './motocicletas/motocicletas.module';

@Module({
  imports: [MotocicletasModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
