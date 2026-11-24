import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProjectsPage } from './projects-page';

// The page is tested through its rendered HTML, the way a user sees it,
// with the HTTP layer faked so we control what the "API" answers.
describe('ProjectsPage', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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

  it('shows a loading message while the request is pending', async () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Loading projects');
    http.expectOne('/api/projects'); // leave it unanswered
  });

  it('renders one card per project', async () => {
    const fixture = render();
    const el = await answer(fixture, () =>
      http.expectOne('/api/projects').flush([
        { id: '1', title: 'First', description: 'd', tags: ['a'], repositoryUrl: null, liveUrl: null, createdAt: '2026-01-01T00:00:00Z' },
        { id: '2', title: 'Second', description: 'd', tags: [], repositoryUrl: 'https://github.com/x/y', liveUrl: null, createdAt: '2026-01-02T00:00:00Z' },
      ]),
    );

    const titles = [...el.querySelectorAll('.card h2')].map((h) => h.textContent?.trim());
    expect(titles).toEqual(['First', 'Second']);
    expect(el.querySelector('a[href="https://github.com/x/y"]')).not.toBeNull();
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
