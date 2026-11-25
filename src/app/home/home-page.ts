import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProjectCard } from '../projects/project-card/project-card';
import { ProjectService } from '../projects/project.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ProjectCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly projectService = inject(ProjectService);

  /** Technologies from the projects, shown as a strip under the hero. */
  protected readonly stack = [
    'Angular',
    'TypeScript',
    '.NET / C#',
    'Python',
    'PySpark',
    'MongoDB',
    'Microsoft Fabric',
    'Azure',
    'Unity',
  ];

  private readonly projects = rxResource({
    stream: () => this.projectService.getAll(),
  });

  /** The three newest projects (the API already sorts newest first). */
  protected readonly featured = computed(() =>
    this.projects.hasValue() ? this.projects.value().slice(0, 3) : [],
  );
}
