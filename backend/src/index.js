import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 8000,()=>{
            console.log(`☸️ Server is running on port ${process.env.PORT || 8000}`);
            
        })
    })
    .catch((error)=>{
        console.error("❌ Failed to connect MONGODB:", error);
        process.exit(1);
    })
