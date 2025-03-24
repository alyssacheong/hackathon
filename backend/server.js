import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import supabase from '../frontend/src/supabase';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = 5000;

app.use(cors());
// app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // supabase
});

app.get('/data', async (req, res) => {
  const { data, error } = await supabase.from('data').select('*');
  
  if (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
});

app.listen(port, () => {
  console.log(`the server running on port ${port}!!!`);
});
