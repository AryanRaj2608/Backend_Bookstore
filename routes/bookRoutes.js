import { Router } from "express";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controllers/bookController.js";

const router = Router();

// POST /books  -> create a new book
router.post("/", createBook);
router.get("/", getBooks);        // Read (list)
router.get("/:id", getBookById);  // Read (single)
router.put("/:id", updateBook);   // Update (replace/partial)
router.delete("/:id", deleteBook);// Delete

export default router;
