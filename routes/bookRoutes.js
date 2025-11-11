import { Router } from "express";
import { createBook } from "../controllers/bookController.js";

const router = Router();

// POST /books  -> create a new book
router.post("/", createBook);

export default router;
