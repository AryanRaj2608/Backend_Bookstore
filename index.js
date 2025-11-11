import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bookRoutes from "./routes/bookRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { Router } from "express";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "./controllers/bookController.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

const app = express();

// security + utils
app.use(helmet());
// app.use(mongoSanitize());
app.use((req, res, next) => {
  if (req.body)  mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  // IMPORTANT: don't assign to req.query
  next();
});
app.use(morgan("dev"));

// global rate limit (adjust as needed)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,                  // 300 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json());
app.use(cors());

// A basic test route to verify the server works
app.get('/', (req, res) => res.send('Welcome to MERN Backend'));

app.use("/auth", authRoutes);

const books = Router();
books.get("/", getBooks);
books.get("/:id", getBookById);
books.post("/", requireAuth, createBook);
books.put("/:id", requireAuth, updateBook);
books.delete("/:id", requireAuth, deleteBook);
app.use("/books", bookRoutes);


// IMPORTANT: Replace <your_mongo_uri> with your actual MongoDB connection string.
mongoose.connect('mongodb+srv://adityaraj240203_db_user:VfykauoGPy51tpni@cluster0.07jh4kj.mongodb.net/bookstore?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(5555, () => console.log('Server is running on port 5555'));
  })
  .catch(err => console.log(err));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);
