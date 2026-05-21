export type ResponsiveImage = {
  name: string;
  width: number;
  url: string;
};

export type ImageSet = {
  original: string;
  responsive: ResponsiveImage[];
};

export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  technologies: string[]| null;
  github?: string | null;
  demo?: string | null;

  thumbnail: ImageSet| null;

  carouselImages: ImageSet[] | null;

  date: number | string | Date | null;
  hero: boolean;
}
