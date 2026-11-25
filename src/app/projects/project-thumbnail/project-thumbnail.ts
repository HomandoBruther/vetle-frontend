import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

/**
 * Shows a project's image, or a generated gradient "cover" when there is no image
 * (or the file is missing). Each title always gets the same colours.
 */
@Component({
  selector: 'app-project-thumbnail',
  imports: [NgOptimizedImage],
  template: `
    @if (showImage()) {
      <!--
        ngSrc = NgOptimizedImage: lazy-loads by default and warns in dev about common mistakes.
        "fill" makes the image cover the parent box, so we don't need to know its pixel size.
      -->
      <img [ngSrc]="imageUrl()!" fill [priority]="priority()" alt="" (error)="failed.set(true)" />
    } @else {
      <div class="placeholder" [style.--hue]="hue()" aria-hidden="true">
        <span>{{ initials() }}</span>
      </div>
    }
  `,
  styleUrl: './project-thumbnail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectThumbnail {
  readonly title = input.required<string>();
  readonly imageUrl = input<string | null>(null);
  /** Set on the most important image above the fold, so it loads eagerly. */
  readonly priority = input(false);

  /**
   * linkedSignal: a writable signal that resets whenever imageUrl changes.
   * So if one image fails to load and the input switches to another, we try again.
   */
  protected readonly failed = linkedSignal({ source: this.imageUrl, computation: () => false });

  protected readonly showImage = computed(() => !!this.imageUrl() && !this.failed());

  /** A stable colour per title: hash the string to a hue (0–359) on the colour wheel. */
  protected readonly hue = computed(() => {
    let hash = 0;
    for (const char of this.title()) {
      hash = (hash * 31 + char.charCodeAt(0)) | 0;
    }
    return Math.abs(hash) % 360;
  });

  protected readonly initials = computed(() =>
    this.title()
      .split(/[\s:]+/)
      .filter((word) => /^[A-Za-z]/.test(word))
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join(''),
  );
}
