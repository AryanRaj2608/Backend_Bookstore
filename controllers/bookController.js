import mongoose from "mongoose";
import Book from "../models/Book.js";

const getId = (req) => (req.validated?.params?.id) || req.params.id;
const getBody = (req) => (req.validated?.body) || req.body;
const getQuery = (req) => (req.validated?.query) || req.query;

// CREATE
export const createBook = async (req, res) => {
  try {
    const body = getBody(req);

    // whitelist fields to avoid unexpected properties
    const allowed = ["title","author","publicationYear","genre","price","coverImage","available","description"];
    const payload = {};
    for (const k of allowed) if (k in body) payload[k] = body[k];

    const newBook = new Book(payload);
    const savedBook = await newBook.save();

    return res.status(201).json({ success: true, data: savedBook });
  } catch (error) {
    console.error("createBook error:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors: validationErrors });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET list with pagination/search/sort
export const getBooks = async (req, res) => {
  try {
    const query = getQuery(req);
    const q = (query.q || "").trim();
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = q ? { $or: [{ title: new RegExp(q, "i") }, { author: new RegExp(q, "i") }] } : {};
    const sort = { [sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      Book.find(filter).sort(sort).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      meta: { currentPage: page, totalPages: Math.ceil(total / limit), totalBooks: total, sortBy, sortOrder: sortOrder === 1 ? "asc" : "desc", q }
    });
  } catch (error) {
    console.error("getBooks error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch books.", error: error.message });
  }
};

// GET single
export const getBookById = async (req, res) => {
  try {
    const id = getId(req);
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid book ID" });

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    console.error("getBookById error:", error);
    return res.status(500).json({ success: false, message: "Error fetching book", error: error.message });
  }
};

// UPDATE (using findByIdAndUpdate - shorter)
export const updateBook = async (req, res) => {
  try {
    const id = getId(req);
    const updateData = getBody(req);

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid book ID" });

    // whitelist update fields
    const allowed = ["title","author","publicationYear","genre","price","coverImage","available","description"];
    const payload = {};
    for (const k of allowed) if (k in updateData) payload[k] = updateData[k];

    const updatedBook = await Book.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

    if (!updatedBook) return res.status(404).json({ success: false, message: "Book not found" });

    return res.status(200).json({ success: true, message: "Book updated successfully", data: updatedBook });
  } catch (error) {
    console.error("updateBook error:", error);
    return res.status(500).json({ success: false, message: "Error updating book", error: error.message });
  }
};

// DELETE
export const deleteBook = async (req, res) => {
  try {
    const id = getId(req);
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid book ID" });

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) return res.status(404).json({ success: false, message: "Book not found" });

    return res.status(200).json({ success: true, message: "Book deleted successfully", data: deletedBook });
  } catch (error) {
    console.error("deleteBook error:", error);
    return res.status(500).json({ success: false, message: "Error deleting book", error: error.message });
  }
};
