import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Project } from './project.model';
import { ProjectService } from './project.service';

// HttpTestingController replaces the real network: each test checks which request
// the service made, then answers it with fake data. No backend is needed.
describe('ProjectService', () => {
  let service: ProjectService;
  let http: HttpTestingController;

  const sample: Project = {
    id: '6b055a63943a69f30e163347',
    title: 'Test',
    summary: 'Short',
    description: 'A test project',
    period: '2025',
    tags: ['angular'],
    repositoryUrl: null,
    liveUrl: null,
    createdAt: '2026-11-24T09:35:30.979Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectService);
    http = TestBed.inject(HttpTestingController);
  });

  // Fails the test if the service made a request that no test answered.
  afterEach(() => http.verify());

  it('getAll() sends GET /api/projects and returns the list', async () => {
    const result = firstValueFrom(service.getAll());

    const req = http.expectOne('/api/projects');
    expect(req.request.method).toBe('GET');
    req.flush([sample]);

    expect(await result).toEqual([sample]);
  });

  it('getById() puts the id in the URL', async () => {
    const result = firstValueFrom(service.getById(sample.id));

    http.expectOne(`/api/projects/${sample.id}`).flush(sample);

    expect(await result).toEqual(sample);
  });

  it('create() sends POST with the request body', async () => {
    const body = { title: 'New', description: 'Desc' };
    const result = firstValueFrom(service.create(body));

    const req = http.expectOne('/api/projects');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(sample, { status: 201, statusText: 'Created' });

    expect(await result).toEqual(sample);
  });

  it('delete() sends DELETE to the project URL', async () => {
    const result = firstValueFrom(service.delete(sample.id));

    const req = http.expectOne(`/api/projects/${sample.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });

    await result;
  });

  it('passes HTTP errors on to the caller', async () => {
    const result = firstValueFrom(service.getById('missing'));

    http.expectOne('/api/projects/missing').flush(null, { status: 404, statusText: 'Not Found' });

    await expect(result).rejects.toMatchObject({ status: 404 });
  });
});
