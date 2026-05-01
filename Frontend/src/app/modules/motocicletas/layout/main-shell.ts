import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>

    <nav
      class="navbar border-bottom bg-white bg-opacity-90 shadow-sm"
    >
      <div
        class="container d-flex flex-wrap justify-content-between align-items-center py-2 gap-2"
      >
        <a class="navbar-brand fw-bold text-primary mb-0" routerLink="/inicio"
          >BikeTracking</a
        >
        <ul class="nav nav-pills flex-wrap gap-1">
          <li class="nav-item">
            <a
              class="nav-link"
              routerLink="/inicio"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              >Inicio</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              routerLink="/mi-moto"
              routerLinkActive="active"
              >Mi moto</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              routerLink="/mantenimiento"
              routerLinkActive="active"
              >Mantenimiento</a
            >
          </li>
        </ul>
      </div>
    </nav>

    <main class="container py-4 py-md-5">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .nav-link.active {
        font-weight: 700;
        color: var(--brand, #0a66c2) !important;
        background: rgba(10, 102, 194, 0.08);
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class MainShellComponent {}
