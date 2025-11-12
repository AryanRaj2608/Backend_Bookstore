import { isValidObjectId } from "mongoose";
import mongoose from "mongoose"; 
import Book from "../models/Book.js";

/** CREATE (already added on Day 2) */
export const createBook = async (req, res) => {
  try {
    const { title, author, description, price, coverImage, publishedYear, available } = req.body;

    // Required fields check
    if (!title || !author || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Fields 'title', 'author' and 'price' are required.",
      });
    }

    // Create and save to MongoDB
    const book = await Book.create({
      title,
      author,
      description,
      price,
      coverImage,
      publishedYear,
      available,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: err.message,
    });
  }
};

/** READ - list with search/sort/pagination */
export const getBooks = async (req, res) => {
  try {
    // query params
    const q = (req.query.q || "").trim();          // search keyword for title/author
    const sortBy = req.query.sortBy || "createdAt"; // e.g. title, price, author, createdAt
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // asc | desc
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = q
      ? { $or: [{ title: new RegExp(q, "i") }, { author: new RegExp(q, "i") }] }
      : {};

    const sort = { [sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      Book.find(filter).sort(sort).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      books: items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBooks: total
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch books.", error: err.message });
  }
};

/** READ - single by id */
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid book ID" });
    }

    // ✅ Fetch book by ID
    const book = await Book.findById(id);

    // ✅ If not found
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // ✅ Return success
    return res.status(200).json({ success: true, data: book });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching book",
      error: error.message,
    });
  }
};

/** UPDATE */
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid book ID" });
    }

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true });

    // Check if book exists
    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating book",
      error: error.message,
    });
  }
};

/** DELETE */
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Validate the MongoDB Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid book ID" });
    }

    // Step 2: Try to find and delete the book
    const deletedBook = await Book.findByIdAndDelete(id);

    // Step 3: Handle book not found
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Step 4: Success response
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      deletedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error.message,
    });
  }
};
