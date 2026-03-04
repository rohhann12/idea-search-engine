const express = require('express');
const { dataExtractor } = require('../utils/dataExtractor');

const app = express();
app.get("/",(req:any,res:any)=>{
  res.send("hi")
})
app.get('/data', async (req: any, res: any) => {
  try {
    const data = await dataExtractor();
    let emebed;
    try {
      emebed = await fetch("http://embedding-service:8001/embed",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({text: JSON.stringify(data)})
      });
      console.log("embed status:", emebed.status);
      const embedData = await emebed.json();
      console.log("embed response:", embedData);
    } catch (embedError) {
      console.error("embed fetch failed:", embedError);
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3004, () => {
  console.log('Server running on http://localhost:3000');
});
