// models/Message.ts
import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, default: "" },
  message: { type: String, required: true },
  gdprConsent: { type: Boolean, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: {type: Date, default: Date.now, index: { expires: "180d" }}
});

export default models.Message || model("Message", MessageSchema);
