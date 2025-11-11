import Book from "../models/Book.js";

/** CREATE (already added on Day 2) */
export const createBook = async (req, res) => {
  try {
    const { title, author, description, price, coverImage, publishedYear, available } = req.body;
    if (!title || !author || price === undefined) {
      return res.status(400).json({ success: false, message: "Fields 'title', 'author' and 'price' are required." });
    }
    const book = await Book.create({ title, author, description, price, coverImage, publishedYear, available });
    return res.status(201).json({ success: true, data: book });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create book.", error: err.message });
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

    return res.json({
      success: true,
      meta: { total, page, limit, pages: Math.ceil(total / limit), sortBy, sortOrder: sortOrder === 1 ? "asc" : "desc", q },
      data: items,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch books.", error: err.message });
  }
};

/** READ - single by id */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found." });
    return res.json({ success: true, data: book });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid book id.", error: err.message });
  }
};

/** UPDATE */
export const updateBook = async (req, res) => {
  try {
    const allowed = ["title", "author", "description", "price", "coverImage", "publishedYear", "available"];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: "Book not found." });

    return res.json({ success: true, data: book });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Failed to update book.", error: err.message });
  }
};

/** DELETE */
export const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Book not found." });
    return res.json({ success: true, message: "Book deleted." });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Failed to delete book.", error: err.message });
  }
};
