import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  technologies: [{ type: String }],
  github: { type: String },
  demo: { type: String },
  thumbnail: { type: String },
  carouselImages: [{ type: String }],
  date: { type: Number },
});

export default models.Project || model("Project", ProjectSchema);
