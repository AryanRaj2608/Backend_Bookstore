import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    coverImage: { type: String, default: "" }, // a URL or filename
    publishedYear: { type: Number },           // optional
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
