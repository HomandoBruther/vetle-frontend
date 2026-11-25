import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });

  const project = (n: number) => ({
    id: `id${n}`,
    title: `Project ${n}`,
    summary: null,
    description: 'd',
    period: null,
    imageUrl: null,
    tags: [],
    repositoryUrl: null,
    liveUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
  });

  it('shows at most the three newest projects under "Recent work"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    http.expectOne('/api/projects').flush([1, 2, 3, 4].map(project));
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Recent work');
    const titles = [...el.querySelectorAll('app-project-card h3')].map((h) => h.textContent?.trim());
    expect(titles).toEqual(['Project 1', 'Project 2', 'Project 3']);
  });

  it('still shows the hero if the API is down, just without the projects section', async () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    http.expectOne('/api/projects').flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain("Hi, I'm Vetle");
    expect(el.textContent).not.toContain('Recent work');
  });
});
