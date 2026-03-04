const {fs} =require('fs');
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
    data.data.children.forEach((post:any) => {
        const p=post.data
        console.log("title",p.title)
        console.log("title",p.selftext)

    });
    return data;
   } catch (error) {
    console.log(error)
   }
}

function writeToFile(data:any,destination:string){

}

module.exports = { dataExtractor };