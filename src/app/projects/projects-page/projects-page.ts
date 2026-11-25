import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProjectCard } from '../project-card/project-card';
import { ProjectService } from '../project.service';

/**
 * A "container" (smart) component: it fetches the data and handles loading/error states,
 * then hands each project to the presentational ProjectCard.
 */
@Component({
  selector: 'app-projects-page',
  imports: [ProjectCard],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPage {
  private readonly projectService = inject(ProjectService);

  /**
   * A resource wraps one async request and exposes its state as signals:
   * isLoading(), error(), hasValue(), value(). It also has reload().
   * The template reads those signals, so there are no manual subscribe/unsubscribe calls
   * and no hand-written "loading" boolean.
   */
  protected readonly projects = rxResource({
    stream: () => this.projectService.getAll(),
  });
}
