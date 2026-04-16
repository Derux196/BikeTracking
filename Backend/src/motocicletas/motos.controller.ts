import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MotocicletasService } from './motocicletas.service';

@Controller('motos')
export class MotosController {
  constructor(private readonly motocicletasService: MotocicletasService) {}

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('estado') estado?: string,
  ) {
    return this.motocicletasService.findAllMotos(q, estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motocicletasService.findOneMoto(id);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.motocicletasService.createMoto(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.motocicletasService.updateMoto(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.motocicletasService.deleteMoto(id);
  }
}
