import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-detail-page',
  imports: [RouterLink],
  templateUrl: './project-detail-page.html',
  styleUrl: './project-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPage {
  private readonly projectService = inject(ProjectService);

  /**
   * Filled from the :id segment of the URL. That works because app.config.ts enables
   * withComponentInputBinding(), so there's no need to inject ActivatedRoute and subscribe.
   */
  readonly id = input.required<string>();

  /**
   * `params` is tracked: whenever id() changes (e.g. navigating from one project to another),
   * the resource cancels the old request and loads the new one automatically.
   */
  protected readonly project = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.projectService.getById(id),
  });

  /** Tells "this project doesn't exist" (404) apart from "something went wrong". */
  protected readonly notFound = computed(() => {
    const error = this.project.error();
    return error instanceof HttpErrorResponse && error.status === 404;
  });
}
