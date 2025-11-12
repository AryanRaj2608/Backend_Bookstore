import { isValidObjectId } from "mongoose";
import mongoose from "mongoose"; 
import Book from "../models/Book.js";

/** CREATE (already added on Day 2) */
export const createBook = async (req, res) => {
  try {
    const { title, author, publicationYear, genre } = req.body;

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      publicationYear,
      genre,
    });

    // Save to database (Mongoose will auto-validate here)
    const savedBook = await newBook.save();

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: savedBook,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
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
    const { title, author, publicationYear, genre, price } = req.body;

    // ✅ 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid book ID" });
    }

    // ✅ 2. Find the book by ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // ✅ 3. Update only provided fields (partial update)
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (publicationYear !== undefined) book.publicationYear = publicationYear;
    if (genre !== undefined) book.genre = genre;
    if (price !== undefined) book.price = price;

    // ✅ 4. Save the updated book
    const updatedBook = await book.save();

    // ✅ 5. Send success response
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

    // validate id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid book ID" });
    }

    // delete
    const deletedBook = await Book.findByIdAndDelete(id);

    // not found
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // success (include deleted doc if you want)
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error.message
    });
  }
};

