import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  // The template is small enough to keep inline. Bigger templates go in their own .html file.
  template: `
    <section class="hero">
      <h1>Hi, I'm Vetle.</h1>
      <p class="lead">
        This is my personal site, built with Angular on the frontend and ASP.NET Core with MongoDB
        on the backend.
      </p>
      <a class="button" routerLink="/projects">See my projects</a>
    </section>
  `,
  styles: `
    .hero {
      padding: 4rem 0;
    }
    h1 {
      font-size: clamp(2rem, 6vw, 3.5rem);
      margin: 0 0 1rem;
    }
    .lead {
      max-width: 40rem;
      font-size: 1.15rem;
      color: var(--text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
