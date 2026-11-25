import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projects-page',
  imports: [RouterLink],
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
