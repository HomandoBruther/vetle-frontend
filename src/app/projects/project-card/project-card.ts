import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../project.model';
import { ProjectThumbnail } from '../project-thumbnail/project-thumbnail';

/**
 * One project as a card. A "presentational" component: it only receives data through an
 * input and renders it, with no services and no HTTP. That makes it reusable (projects page
 * and the home page's featured section) and trivial to test.
 */
@Component({
  selector: 'app-project-card',
  imports: [RouterLink, ProjectThumbnail],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly project = input.required<Project>();
}
