import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

import eventRouter from "./routes/event";

mongoose.connect('mongodb://localhost:27017/myapp')
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch(err => console.error('Could not connect to MongoDB...\n sudo systemctl restart mongod \n', err));

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/event', eventRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
