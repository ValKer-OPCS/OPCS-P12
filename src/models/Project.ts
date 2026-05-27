import { Schema, model, models } from "mongoose";

export const ResponsiveImageSchema = new Schema({
  name: { type: String, required: true },
  width: { type: Number, required: true },
  url: { type: String, required: true },
  path: { type: String, required: true }
});

export const ThumbnailSchema = new Schema({
  original: { type: String, required: true },
  originalPath: { type: String, required: true },
  responsive: [ResponsiveImageSchema]
});

export const CarouselImageSchema = new Schema({
  original: { type: String, required: true },
  originalPath: { type: String, required: true },
  responsive: [ResponsiveImageSchema]
});

export const ProjectSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  technologies: [{ type: String }],
  github: { type: String },
  demo: { type: String },

  thumbnail: ThumbnailSchema,

  carouselImages: [CarouselImageSchema],

  date: { type: Date },
  hero: { type: Boolean, default: false }
});

export default models.Project || model("Project", ProjectSchema);