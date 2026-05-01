import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-hero',
  standalone: true,
  template: `
    <header class="hero card border-0 shadow-lg mb-4">
      <div class="card-body p-4 p-md-5">
        <p class="text-uppercase fw-semibold mb-2 tracking">{{ eyebrow }}</p>
        <h1 class="display-6 fw-bold mb-2">{{ title }}</h1>
        @if (subtitle) {
          <p class="text-muted m-0 mb-3">{{ subtitle }}</p>
        }
        <ng-content />
      </div>
    </header>
  `,
})
export class SectionHeroComponent {
  @Input({ required: true }) eyebrow!: string;
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
}
