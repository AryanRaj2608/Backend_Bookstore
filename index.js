import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bookRoutes from "./routes/bookRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(express.json());
app.use(cors());

// A basic test route to verify the server works
app.get('/', (req, res) => res.send('Welcome to MERN Backend'));

app.use("/books", bookRoutes);
app.use(notFound);
app.use(errorHandler);

// IMPORTANT: Replace <your_mongo_uri> with your actual MongoDB connection string.
mongoose.connect('mongodb+srv://adityaraj240203_db_user:VfykauoGPy51tpni@cluster0.07jh4kj.mongodb.net/bookstore?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(5555, () => console.log('Server is running on port 5555'));
  })
  .catch(err => console.log(err));
