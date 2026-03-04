const fs =require('fs');
async function dataExtractor(){
   try {
     const url="https://www.reddit.com/r/Startup_Ideas/new.json?limit=100"
    const req:any=await fetch(url,{
        headers:{
            "User-Agent":"MyApp/1.0"
        }
    })
    const data=await req.json();
    console.log("data",data)
    const posts = data.data.children.map((post:any) => ({
        title: post.data.title,
        body: post.data.selftext,
    }));
    writeToFile(posts);
    return data;
   } catch (error) {
    console.log(error)
   }
}

function writeToFile(data:any){
    fs.writeFileSync("backend/src/data/init.json", JSON.stringify(data, null, 2))
}

module.exports = { dataExtractor };