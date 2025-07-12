import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN|| 'http://localhost:3000',
    credentials: true,
}))


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req,res)=>{
    res.send("Your API is Live 🔥\n Welcome to Credentix Backend");
})



app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});



app.use((err, req, res, next) => {
    const statusCode=err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    }); 
    console.error(err.stack);

})


export default app;