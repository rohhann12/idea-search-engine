const express = require('express');
const { dataExtractor } = require('../utils/dataExtractor');

const app = express();
app.get("/",(req:any,res:any)=>{
  res.send("hi")
})
app.get('/data', async (req: any, res: any) => {
  try {
    const data = await dataExtractor();
    const emebed= await fetch("http://embedding-service:8000/embed",{
      method:"POST",
      headers:{
        "Content-Type":"appplication/json"
      },
      body:JSON.stringify({data})
    })
    console.log("emeber",emebed)
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3004, () => {
  console.log('Server running on http://localhost:3000');
});
