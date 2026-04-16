export interface Moto {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  cilindraje: string;
  estado: string;
  propietario: string;
  fechaRegistro: string;
}

export interface Mantenimiento {
  id: string;
  moto_id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  costo: number;
  tecnico: string;
  fechaRegistro: string;
}
