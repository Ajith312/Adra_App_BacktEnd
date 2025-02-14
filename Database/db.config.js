import mongoose from "mongoose"


const connectDB = async(req,res)=>{
    try {

        const connection = await mongoose.connect(process.env.mongoDBconnectingString)
        console.log("Database Connected")
        return connection
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Database connection error",
            error_code:500
        })
        
    }
}

export default connectDB