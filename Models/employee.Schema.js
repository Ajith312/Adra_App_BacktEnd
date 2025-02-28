import mongoose, { Mongoose } from "mongoose"

const employeeSchema = mongoose.Schema({
    employeeName:String,
    email:String,
    password:String,
    phoneNumber:Number,
    managerId:mongoose.Schema.ObjectId,
    token:String,
    role:String,
    otp:Number,
    otpExpiry:String,
    personalDetails:Object,
    casualLeave:{
        type:Number,
        default:1
    },
    leaveDays:{
        type:Number,
        default:0
    },
    permission:{
        type:String,
        default:"2hrs"
    },
    fcmToken: String,
    imageUrl: String 

})

const EmployeeModel = mongoose.model("employee",employeeSchema)
export default EmployeeModel