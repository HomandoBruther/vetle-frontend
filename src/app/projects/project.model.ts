// Mirrors the backend DTOs in vetle-backend/Models/ProjectDtos.cs.
// If those change, update these types so the compiler points out every affected place.

/** What GET /api/projects returns for each project. */
export interface Project {
  id: string;
  title: string;
  /** Short text for the card. May be null on older projects; fall back to `description`. */
  summary: string | null;
  description: string;
  /** When the project happened, e.g. "2025" or "2024 – present". */
  period: string | null;
  tags: string[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  /** When the record was added to the database (ISO 8601). Used for sorting, not shown. */
  createdAt: string;
}

/** What POST and PUT /api/projects expect. */
export interface ProjectRequest {
  title: string;
  summary?: string | null;
  description: string;
  period?: string | null;
  tags?: string[];
  repositoryUrl?: string | null;
  liveUrl?: string | null;
}
