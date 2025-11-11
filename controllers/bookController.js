import Book from "../models/Book.js";

export const createBook = async (req, res) => {
  try {
    const { title, author, description, price, coverImage, publishedYear, available } = req.body;

    // Basic manual validation (in addition to Mongoose's)
    if (!title || !author || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Fields 'title', 'author' and 'price' are required."
      });
    }

    const book = await Book.create({
      title,
      author,
      description,
      price,
      coverImage,
      publishedYear,
      available
    });

    return res.status(201).json({ success: true, data: book });
  } catch (err) {
    // Duplicate key / validation / other DB errors
    return res.status(500).json({
      success: false,
      message: "Failed to create book.",
      error: err.message
    });
  }
};
