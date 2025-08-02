import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

mongoose.connect('mongodb://localhost:27017/myapp');
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
//app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});



app.listen(3000, () => {
  console.log("Server started on port 3000");
});
