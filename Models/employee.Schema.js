import mongoose from "mongoose"

const employeeSchema = mongoose.Schema({
    employeeName:String,
    email:String,
    password:String,
    token:String,
    role:String,
    otp:Number,
    otpExpiry:String,
    personalDetails:Object,
    casualLeave:Number,
    leaveDays:Number,
    permission:String
})

const EmployeeModel = mongoose.model("employee",employeeSchema)
export default EmployeeModel