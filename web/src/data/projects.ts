// Import the JSON from the local data directory
import projectsData from './projects.json';

export interface Project {
  name: string;
  description: string;
  color: string;
  liveUrl: string;
  repoUrl: string;
  actionText: string;
}

export interface SocialLinks {
  linkedin: string;
}

export interface ProjectsData {
  projects: Project[];
  socialLinks: SocialLinks;
}

export const { projects, socialLinks } = projectsData as ProjectsData; 