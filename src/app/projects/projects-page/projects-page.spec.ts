import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Project } from '../project.model';
import { ProjectsPage } from './projects-page';

// The page is tested through its rendered HTML, the way a user sees it,
// with the HTTP layer faked so we control what the "API" answers.
describe('ProjectsPage', () => {
  let http: HttpTestingController;

  const project = (overrides: Partial<Project>): Project => ({
    id: '1',
    title: 'Title',
    summary: null,
    description: 'Description',
    period: null,
    tags: [],
    repositoryUrl: null,
    liveUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectsPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });

  // Render synchronously. Don't await whenStable() here: the app only counts as
  // "stable" once the HTTP request finishes, and the test hasn't answered it yet.
  function render() {
    const fixture = TestBed.createComponent(ProjectsPage);
    fixture.detectChanges();
    return fixture;
  }

  async function answer(fixture: ReturnType<typeof render>, respond: () => void) {
    respond();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows a loading message while the request is pending', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Loading projects');
    http.expectOne('/api/projects'); // leave it unanswered
  });

  it('renders one card per project, linking to its detail page', async () => {
    const fixture = render();
    const el = await answer(fixture, () =>
      http.expectOne('/api/projects').flush([
        project({ id: 'a1', title: 'First', tags: ['x'] }),
        project({ id: 'b2', title: 'Second', repositoryUrl: 'https://github.com/x/y' }),
      ]),
    );

    const titles = [...el.querySelectorAll('.card h2')].map((h) => h.textContent?.trim());
    expect(titles).toEqual(['First', 'Second']);
    expect(el.querySelector('.card h2 a')?.getAttribute('href')).toBe('/projects/a1');
    expect(el.querySelector('a[href="https://github.com/x/y"]')).not.toBeNull();
  });

  it('shows the summary and period when present, else falls back to the description', async () => {
    const fixture = render();
    const el = await answer(fixture, () =>
      http.expectOne('/api/projects').flush([
        project({ id: 'a', summary: 'Short summary', description: 'Long text', period: '2025' }),
        project({ id: 'b', summary: null, description: 'Only a description' }),
      ]),
    );

    const cards = el.querySelectorAll('.card');
    expect(cards[0].querySelector('.summary')?.textContent).toContain('Short summary');
    expect(cards[0].querySelector('.period')?.textContent).toContain('2025');
    expect(cards[1].querySelector('.summary')?.textContent).toContain('Only a description');
    expect(cards[1].querySelector('.period')).toBeNull();
  });

  it('shows an empty state when there are no projects', async () => {
    const fixture = render();
    const el = await answer(fixture, () => http.expectOne('/api/projects').flush([]));
    expect(el.textContent).toContain('No projects yet');
  });

  it('shows an error with a retry button when the API fails', async () => {
    const fixture = render();
    const el = await answer(fixture, () =>
      http.expectOne('/api/projects').flush(null, { status: 500, statusText: 'Server Error' }),
    );

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Could not load projects');
    expect(el.querySelector('button')?.textContent).toContain('Try again');
  });
});
