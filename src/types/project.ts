export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  technologies: string[];
  github?: string | null;
  demo?: string | null;
  thumbnail: string;
  carouselImages?: string[];
  date: number;
}
