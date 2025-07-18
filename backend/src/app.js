import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';


const app=express();

app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("PATH:", req.path);
  console.log("BODY:", req.body);
  next();
});



app.use(helmet());


app.use(morgan('dev'));



app.use(cors({
    origin: process.env.CORS_ORIGIN|| 'http://localhost:3000',
    credentials: true,
}))


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (req,res)=>{
    res.send("Your API is Live 🔥\n Welcome to Credentix Backend");
})

// ========== Routes ==========
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import roleRoutes from './routes/role.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import googleRoutes from './routes/google.routes.js';
import oauthRoutes from "./routes/oauth.routes.js";


app.use("/api/v1/oauth", googleRoutes);
app.use("/api/v1/oauth2", oauthRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/tenants', tenantRoutes);


// ========== 404 Handler ==========

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});



// ========== Error Handler ==========
app.use((err, req, res, next) => {
    const statusCode=err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    }); 
    

})


export default app;