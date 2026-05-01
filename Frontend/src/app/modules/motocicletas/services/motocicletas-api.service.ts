import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Mantenimiento } from '../models/mantenimiento.model';
import { Moto } from '../models/moto.model';

@Injectable({ providedIn: 'root' })
export class MotocicletasApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  listMotos(filters?: { q?: string; estado?: string }): Observable<Moto[]> {
    let params = new HttpParams();
    if (filters?.q) params = params.set('q', filters.q);
    if (filters?.estado) params = params.set('estado', filters.estado);
    return this.http
      .get<Moto[]>(`${this.base}/motos`, { params })
      .pipe(catchError((e) => this.handleError(e)));
  }

  createMoto(body: Partial<Moto>): Observable<Moto> {
    return this.http
      .post<Moto>(`${this.base}/motos`, body)
      .pipe(catchError((e) => this.handleError(e)));
  }

  updateMoto(id: string, body: Partial<Moto>): Observable<Moto> {
    return this.http
      .put<Moto>(`${this.base}/motos/${id}`, body)
      .pipe(catchError((e) => this.handleError(e)));
  }

  deleteMoto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/motos/${id}`).pipe(
      catchError((e) => this.handleError(e)),
    );
  }

  listMantenimientos(): Observable<Mantenimiento[]> {
    return this.http
      .get<Mantenimiento[]>(`${this.base}/mantenimientos`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  createMantenimiento(
    body: Pick<
      Mantenimiento,
      'moto_id' | 'tipo' | 'descripcion' | 'fecha' | 'costo' | 'tecnico'
    >,
  ): Observable<Mantenimiento> {
    return this.http
      .post<Mantenimiento>(`${this.base}/mantenimientos`, body)
      .pipe(catchError((e) => this.handleError(e)));
  }

  private handleError(err: HttpErrorResponse) {
    const body = err.error as { message?: string; errors?: string[] } | undefined;
    const msg =
      body?.errors?.join(' ') ||
      body?.message ||
      err.message ||
      'Error de red o servidor.';
    return throwError(() => new Error(msg));
  }
}
