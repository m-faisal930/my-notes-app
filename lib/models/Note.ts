import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  body: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      trim: true,
      maxlength: [5000, "Body cannot exceed 5000 characters"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },
  },
  {
    timestamps: true,
  }
);

NoteSchema.index({ title: "text", body: "text" });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ createdAt: -1 });

export default mongoose.models.Note ||
  mongoose.model<INote>("Note", NoteSchema);
