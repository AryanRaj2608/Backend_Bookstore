import { Router } from "express";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controllers/bookController.js";
import { validate } from "../middleware/validate.js";
import { createBookSchema, updateBookSchema, getOrDeleteByIdSchema, listBooksSchema } from "../validators/bookValidator.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /books  -> create a new book
router.get("/", validate(listBooksSchema), getBooks);
router.get("/:id", validate(getOrDeleteByIdSchema), getBookById);

router.post("/", requireAuth, validate(createBookSchema), createBook);
router.put("/:id", requireAuth, validate(updateBookSchema), updateBook);
// router.put("/:id", validate(updateBookSchema), updateBook);
router.delete("/:id", requireAuth, validate(getOrDeleteByIdSchema), deleteBook);

export default router;
