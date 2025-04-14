import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import dotenv from 'dotenv'

dotenv.config();
const app = express();


app.use(express.json())
app.use(cors())
app.use("/v1/user",userRouter);



app.listen(5000,()=>console.log("running..."))