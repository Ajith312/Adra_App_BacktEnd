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
    casualLeave:Number,
    leaveDays:Number,
    permission:String,
    fcmToken: String

})

const EmployeeModel = mongoose.model("employee",employeeSchema)
export default EmployeeModel