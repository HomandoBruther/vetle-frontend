import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectDetailPage } from './project-detail-page';

describe('ProjectDetailPage', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectDetailPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });

  // In the real app the router sets `id` from the URL. In a test we set the input directly.
  function render(id: string) {
    const fixture = TestBed.createComponent(ProjectDetailPage);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return fixture;
  }

  it('loads the project from the id in the URL and shows all of it', async () => {
    const fixture = render('abc');
    http.expectOne('/api/projects/abc').flush({
      id: 'abc',
      title: 'Data platform',
      summary: 'Short version',
      description: 'The full description',
      period: '2025',
      tags: ['PySpark'],
      repositoryUrl: 'https://github.com/x/y',
      liveUrl: null,
      createdAt: '2026-01-01T00:00:00Z',
    });
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Data platform');
    expect(el.textContent).toContain('Short version');
    expect(el.textContent).toContain('The full description');
    expect(el.textContent).toContain('2025');
    expect(el.querySelector('a[href="https://github.com/x/y"]')?.textContent).toContain('View code');
  });

  it('shows "not found" for a 404', async () => {
    const fixture = render('missing');
    http.expectOne('/api/projects/missing').flush(null, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Project not found',
    );
  });

  it('shows a retryable error for other failures', async () => {
    const fixture = render('abc');
    http.expectOne('/api/projects/abc').flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Could not load this project');
    expect(el.querySelector('button')?.textContent).toContain('Try again');
  });
});
