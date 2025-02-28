
import mongoose from "mongoose"

const requestSchema = mongoose.Schema({
    userId:mongoose.Schema.ObjectId,
    managerId:mongoose.Schema.ObjectId,
    requestDetails:Object,
    status: { 
         type: String,
         default: "Pending"
         },
    acceptedStatus:{
        type:String,
         default: "Pending"
    } 
})

const RequestModel = mongoose.model("requests",requestSchema)
export default RequestModel