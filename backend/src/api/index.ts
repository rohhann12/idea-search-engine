const express = require('express');
const { dataExtractor } = require('../utils/dataExtractor');

const app = express();

app.get('/data', async (req: any, res: any) => {
  const data = await dataExtractor();
  res.json(data);
});

app.listen(3005, () => {
  console.log('Server running on http://localhost:3000');
});
