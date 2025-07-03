import 'dotenv/config';
import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('hallo'));

app.listen('8080', () => {
  console.log('Server running!');
});
