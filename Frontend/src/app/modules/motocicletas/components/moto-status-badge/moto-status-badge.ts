import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-moto-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      class="badge badge-state text-capitalize"
      [ngClass]="'text-bg-' + tone"
      >{{ estado }}</span
    >
  `,
})
export class MotoStatusBadgeComponent {
  @Input({ required: true }) estado!: string;

  get tone(): string {
    const map: Record<string, string> = {
      activa: 'success',
      mantenimiento: 'warning',
      inactiva: 'secondary',
    };
    return map[this.estado] ?? 'dark';
  }
}
