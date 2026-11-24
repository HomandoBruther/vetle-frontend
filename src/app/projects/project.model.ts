// Mirrors the backend DTOs in vetle-backend/Models/ProjectDtos.cs.
// If those change, update these types so the compiler points out every affected place.

/** What GET /api/projects returns for each project. */
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  /** ISO 8601 string. JSON has no date type, so it arrives as text. */
  createdAt: string;
}

/** What POST and PUT /api/projects expect. */
export interface ProjectRequest {
  title: string;
  description: string;
  tags?: string[];
  repositoryUrl?: string | null;
  liveUrl?: string | null;
}
