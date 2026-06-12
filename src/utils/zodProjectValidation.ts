import { z } from "zod";
import { zodDeepPartial } from "zod-deep-partial"


export const responsiveImageSchema = z.object({
  name: z.string(),
  width: z.number(),
  url: z.string(),
  path: z.string()
});

export const thumbnailSchema = z.object({
  original: z.string(),
  originalPath: z.string(),
  responsive: z.array(responsiveImageSchema).nullish(),
});

export const carouselImageSchema = z.object({
  original: z.string(),
  originalPath: z.string(),
  responsive: z.array(responsiveImageSchema).nullish(),
});

export const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  technologies: z.array(z.string()).optional(),
  github: z.string().optional(),
  demo: z.string().optional(),
  thumbnail: thumbnailSchema.optional(),
  carouselImages: z.array(carouselImageSchema).optional(),
  date: z.union([z.string(), z.date()]).transform(val => new Date(val)).optional().nullish(),
  hero: z.boolean().optional()
});

export const projectUpdateSchema = zodDeepPartial(projectSchema);