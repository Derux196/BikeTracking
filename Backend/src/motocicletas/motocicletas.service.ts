import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Mantenimiento, Moto } from './motocicletas.types';

@Injectable()
export class MotocicletasService implements OnModuleInit {
  private readonly dataDir: string;
  private readonly motosFile: string;
  private readonly mantenimientosFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.motosFile = path.join(this.dataDir, 'motos.json');
    this.mantenimientosFile = path.join(this.dataDir, 'mantenimientos.json');
  }

  async onModuleInit(): Promise<void> {
    await this.ensureDataFiles();
  }

  private async ensureDataFiles(): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true });
    for (const file of [this.motosFile, this.mantenimientosFile]) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, '[]', 'utf8');
      }
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  private normalize(value: unknown): string {
    return String(value ?? '').trim();
  }

  private async readMotos(): Promise<Moto[]> {
    const raw = await fs.readFile(this.motosFile, 'utf8');
    return JSON.parse(raw) as Moto[];
  }

  private async writeMotos(motos: Moto[]): Promise<void> {
    await fs.writeFile(this.motosFile, JSON.stringify(motos, null, 2), 'utf8');
  }

  private validateMoto(
    payload: Record<string, unknown>,
    existingMotos: Moto[],
    currentId: string | null = null,
  ): string[] {
    const errors: string[] = [];
    const required = [
      'placa',
      'marca',
      'modelo',
      'anio',
      'cilindraje',
      'estado',
      'propietario',
    ];

    for (const field of required) {
      if (!this.normalize(payload[field])) {
        errors.push(`El campo '${field}' es obligatorio.`);
      }
    }

    const anio = Number(payload.anio);
    const currentYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(anio) || anio < 1900 || anio > currentYear) {
      errors.push('El anio debe ser un numero valido.');
    }

    const estadosPermitidos = ['activa', 'mantenimiento', 'inactiva'];
    if (
      payload.estado &&
      !estadosPermitidos.includes(String(payload.estado).toLowerCase())
    ) {
      errors.push('El estado debe ser activa, mantenimiento o inactiva.');
    }

    const placaInput = this.normalize(payload.placa).toUpperCase();
    const placaDuplicada = existingMotos.some(
      (m) =>
        m.placa.toUpperCase() === placaInput && m.id !== currentId,
    );

    if (placaDuplicada) {
      errors.push('La placa ya existe.');
    }

    return errors;
  }

  async findAllMotos(q?: string, estado?: string): Promise<Moto[]> {
    try {
      let motos = await this.readMotos();

      if (estado) {
        motos = motos.filter((m) => m.estado === estado);
      }

      if (q) {
        const term = String(q).toLowerCase();
        motos = motos.filter((m) => {
          return [m.placa, m.marca, m.modelo, m.propietario]
            .join(' ')
            .toLowerCase()
            .includes(term);
        });
      }

      return motos;
    } catch {
      throw new InternalServerErrorException(
        'No se pudo obtener la lista de motos.',
      );
    }
  }

  async findOneMoto(id: string): Promise<Moto> {
    try {
      const motos = await this.readMotos();
      const moto = motos.find((m) => m.id === id);
      if (!moto) {
        throw new NotFoundException('Motocicleta no encontrada.');
      }
      return moto;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'No se pudo obtener la motocicleta.',
      );
    }
  }

  async createMoto(payload: Record<string, unknown>): Promise<Moto> {
    try {
      const motos = await this.readMotos();
      const errors = this.validateMoto(payload, motos);
      if (errors.length) {
        throw new BadRequestException({ message: 'Validacion fallida.', errors });
      }

      const nuevaMoto: Moto = {
        id: this.generateId(),
        placa: this.normalize(payload.placa).toUpperCase(),
        marca: this.normalize(payload.marca),
        modelo: this.normalize(payload.modelo),
        anio: Number(payload.anio),
        cilindraje: this.normalize(payload.cilindraje),
        estado: this.normalize(payload.estado).toLowerCase(),
        propietario: this.normalize(payload.propietario),
        fechaRegistro: new Date().toISOString(),
      };

      motos.push(nuevaMoto);
      await this.writeMotos(motos);
      return nuevaMoto;
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException(
        'No se pudo crear la motocicleta.',
      );
    }
  }

  async updateMoto(id: string, payload: Record<string, unknown>): Promise<Moto> {
    try {
      const motos = await this.readMotos();
      const index = motos.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new NotFoundException('Motocicleta no encontrada.');
      }

      const errors = this.validateMoto(payload, motos, id);
      if (errors.length) {
        throw new BadRequestException({ message: 'Validacion fallida.', errors });
      }

      const updated: Moto = {
        ...motos[index],
        placa: this.normalize(payload.placa).toUpperCase(),
        marca: this.normalize(payload.marca),
        modelo: this.normalize(payload.modelo),
        anio: Number(payload.anio),
        cilindraje: this.normalize(payload.cilindraje),
        estado: this.normalize(payload.estado).toLowerCase(),
        propietario: this.normalize(payload.propietario),
      };

      motos[index] = updated;
      await this.writeMotos(motos);
      return updated;
    } catch (e) {
      if (e instanceof BadRequestException || e instanceof NotFoundException)
        throw e;
      throw new InternalServerErrorException(
        'No se pudo actualizar la motocicleta.',
      );
    }
  }

  async deleteMoto(id: string): Promise<void> {
    try {
      const motos = await this.readMotos();
      const index = motos.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new NotFoundException('Motocicleta no encontrada.');
      }
      motos.splice(index, 1);
      await this.writeMotos(motos);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'No se pudo eliminar la motocicleta.',
      );
    }
  }

  async findAllMantenimientos(): Promise<Mantenimiento[]> {
    try {
      const raw = await fs.readFile(this.mantenimientosFile, 'utf8');
      return JSON.parse(raw) as Mantenimiento[];
    } catch {
      throw new InternalServerErrorException(
        'No se pudo obtener la lista de mantenimientos.',
      );
    }
  }

  private async writeMantenimientos(items: Mantenimiento[]): Promise<void> {
    await fs.writeFile(
      this.mantenimientosFile,
      JSON.stringify(items, null, 2),
      'utf8',
    );
  }

  async createMantenimiento(
    payload: Record<string, unknown>,
  ): Promise<Mantenimiento> {
    const errors: string[] = [];

    const required = ['moto_id', 'tipo', 'descripcion', 'fecha', 'tecnico'];
    for (const field of required) {
      if (!String(payload[field] ?? '').trim()) {
        errors.push(`El campo '${field}' es obligatorio.`);
      }
    }

    const tiposPermitidos = ['preventivo', 'correctivo', 'revision'];
    if (
      payload.tipo &&
      !tiposPermitidos.includes(String(payload.tipo))
    ) {
      errors.push('El tipo debe ser preventivo, correctivo o revision.');
    }

    if (payload.fecha) {
      const fecha = new Date(String(payload.fecha) + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(fecha.getTime())) {
        errors.push('La fecha no es valida.');
      } else if (fecha > today) {
        errors.push('La fecha no puede ser futura.');
      }
    }

    const costoRaw = payload.costo;
    if (costoRaw === undefined || costoRaw === null || costoRaw === '') {
      errors.push("El campo 'costo' es obligatorio.");
    } else {
      const costo = Number(costoRaw);
      if (isNaN(costo) || costo < 0) {
        errors.push('El costo debe ser un numero igual o mayor a 0.');
      }
    }

    if (errors.length) {
      throw new BadRequestException({ message: 'Validacion fallida.', errors });
    }

    const motos = await this.readMotos();
    const motoExiste = motos.some((m) => m.id === payload.moto_id);
    if (!motoExiste) {
      throw new BadRequestException({
        message: 'La motocicleta seleccionada no existe.',
        errors: ['moto_id invalido.'],
      });
    }

    const mantenimientos = await this.findAllMantenimientos();
    const nuevo: Mantenimiento = {
      id: this.generateId(),
      moto_id: String(payload.moto_id),
      tipo: String(payload.tipo),
      descripcion: String(payload.descripcion).trim(),
      fecha: String(payload.fecha),
      costo: Number(payload.costo),
      tecnico: String(payload.tecnico).trim(),
      fechaRegistro: new Date().toISOString(),
    };

    try {
      mantenimientos.push(nuevo);
      await this.writeMantenimientos(mantenimientos);
      return nuevo;
    } catch {
      throw new InternalServerErrorException(
        'No se pudo registrar el mantenimiento.',
      );
    }
  }
}
