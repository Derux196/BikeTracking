import { Module } from '@nestjs/common';
import { MantenimientosController } from './mantenimientos.controller';
import { MotosController } from './motos.controller';
import { MotocicletasService } from './motocicletas.service';

@Module({
  controllers: [MotosController, MantenimientosController],
  providers: [MotocicletasService],
  exports: [MotocicletasService],
})
export class MotocicletasModule {}
