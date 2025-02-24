import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./Database/db.config.js"
import employeeRoutes from "./Routers/employee.Router.js"
import cron from "./Service/cronJobs.js"

dotenv.config()


const app = express()
app.use(express.json());
app.use(cors());



app.get('/',(req,res)=>{
    res.status(200).json("App is working fine")
})

connectDB()
app.use('/employee',employeeRoutes)


app.listen(process.env.PORT,()=>{
    console.log("App is working in the PORT:",process.env.PORT)
})
