import { TestBed } from '@angular/core/testing';
import { ProjectThumbnail } from './project-thumbnail';

describe('ProjectThumbnail', () => {
  function render(title: string, imageUrl: string | null) {
    const fixture = TestBed.createComponent(ProjectThumbnail);
    fixture.componentRef.setInput('title', title);
    fixture.componentRef.setInput('imageUrl', imageUrl);
    fixture.detectChanges();
    return fixture;
  }

  it('shows a gradient placeholder with initials when there is no image', () => {
    const el = render('Data platform with AI agents', null).nativeElement as HTMLElement;

    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('.placeholder')?.textContent?.trim()).toBe('DP');
  });

  it('gives the same title the same colour every time', () => {
    const hueOf = (title: string) =>
      (render(title, null).nativeElement as HTMLElement)
        .querySelector<HTMLElement>('.placeholder')!
        .style.getPropertyValue('--hue');

    expect(hueOf('Tour booking app')).toBe(hueOf('Tour booking app'));
    expect(hueOf('Tour booking app')).not.toBe(hueOf('Bachelor thesis'));
  });

  it('shows the image when one is set', () => {
    const el = render('Game', '/images/projects/game.webp').nativeElement as HTMLElement;

    expect(el.querySelector('img')?.getAttribute('src')).toBe('/images/projects/game.webp');
    expect(el.querySelector('.placeholder')).toBeNull();
  });

  it('falls back to the placeholder if the image fails to load', () => {
    const fixture = render('Game', '/images/projects/missing.webp');
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('.placeholder')).not.toBeNull();
  });
});
