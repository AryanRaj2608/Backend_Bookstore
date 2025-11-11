import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// A basic test route to verify the server works
app.get('/', (req, res) => res.send('Welcome to MERN Backend'));

// IMPORTANT: Replace <your_mongo_uri> with your actual MongoDB connection string.
mongoose.connect('mongodb+srv://adityaraj240203_db_user:VfykauoGPy51tpni@cluster0.07jh4kj.mongodb.net/?appName=Cluster0')
  .then(() => {
    app.listen(5555, () => console.log('Server is running on port 5555'));
  })
  .catch(err => console.log(err));
