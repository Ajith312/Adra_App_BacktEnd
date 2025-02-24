import cron from "node-cron";
import EmployeeModel from "../Models/employee.Schema.js";


cron.schedule("0 0 1 * *", async () => {
    try {
        const result = await EmployeeModel.updateMany(
            {}, 
            { 
                $set: { 
                    casualLeave: 1,   
                    leaveDays: 0,     
                    permission: "2hrs" 
                } 
            }
        );

        console.log(`Casual leave, leave days, and permission reset for ${result.modifiedCount} employees.`);
    } catch (error) {
        console.error("Error resetting leave details:", error);
    }
});

export default cron;
