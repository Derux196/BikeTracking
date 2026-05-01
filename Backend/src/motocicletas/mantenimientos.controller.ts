import { Body, Controller, Get, Post } from '@nestjs/common';
import { MotocicletasService } from './motocicletas.service';

@Controller('mantenimientos')
export class MantenimientosController {
  constructor(private readonly motocicletasService: MotocicletasService) {}

  @Get()
  findAll() {
    return this.motocicletasService.findAllMantenimientos();
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.motocicletasService.createMantenimiento(body);
  }
}
