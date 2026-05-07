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
  thumbnail: {
    original: { type: String },
    responsive: [
      {
        name: { type: String },
        width: { type: Number },
        url: { type: String }
      }
    ]
  },
  carouselImages: [
    {
      original: { type: String },
      responsive: [
        {
          name: { type: String },
          width: { type: Number },
          url: { type: String }
        }
      ]
    }
  ],
  date: { type: Date },
  hero: { type: Boolean, default: false }
});

export default models.Project || model("Project", ProjectSchema);