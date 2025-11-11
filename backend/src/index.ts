import "./config/env.js"
import app from "./app.js";
import connectDB from "./db/index.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running in port: ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log(`Mongo db connection error: ${err}`);
});