import EmployeeModel from "../Models/employee.Schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import RequestModel from "../Models/request.Schema.js";
dotenv.config()

export const userRegister = async (req, res) => {
    try {
      const { employeeName, email, password,role } = req.body;
      if(!employeeName || !email || !password || !role){
        return res.status(402).json({
          message:"missing fields"
        })
      };
      const user = await EmployeeModel.findOne({ email });
      if (user) {
        return res.status(402).json({ message: "user alredy exists" });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
  
      const newUser = new EmployeeModel({
        employeeName,
        email,
        role,
        password: hashPassword,
      });
      await newUser.save()
  
      return res.status(200).json({
        message: "user registeration succesfull",
        error_code: 200,
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const userLogin = async (req, res) => {
   
    const { email, password } = req.body;
    try {
      const user = await EmployeeModel.findOne({ email });
      if (!user) {
        return res.status(402).json({ message: "Invalid email address" });
      }
      const passwordmatch = await bcrypt.compare(password, user.password);
      if (!passwordmatch) {
        return res.status(402).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
     
      user.token = token;
      await user.save();
  
      return res.status(200).json({
        message: "user login succesfull",
        error_code: 200,
        token,
        role:user.role
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  export const getProfileDetails = async (req, res) => {
    try {
        // const authHeader = req.headers.authorization;
        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //     return res.status(401).json({
        //         error_code: 401,
        //         message: "Token is missing or invalid",
        //     });
        // }

        // const token = authHeader.split(" ")[1];

        const userId = req.user._id
       

        const userDetails = await EmployeeModel.findById(
            {_id: userId },
            { _id: 0, employeeName: 1, email: 1, personalDetails: 1 }
        );

        if (!userDetails) {
            return res.status(404).json({
                error_code: 404,
                message: "Invalid user",
            });
        }

        return res.status(200).json({
            error_code: 200,
            message: "User details fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const requestLeaveAndPermission = async (req, res) => {
  try {
    const { requestDetails, managerId } = req.body;
   
    
    const userId = req.user._id;
    const employee = await EmployeeModel.findById(userId);

    if (!employee) {
      return res.status(404).json({
        error_code: 404,
        message: "Invalid user",
      });
    }

    if (!managerId || !requestDetails) {
      return res.status(400).json({
        error_code: 400,
        message: "Manager ID and request details are required",
      });
    }

    const requestData = await RequestModel.create({
      userId: employee._id,
      managerId: managerId,
      requestDetails: requestDetails,
    });

    return res.status(200).json({
      error_code: 200,
      message: "Request submitted successfully",
      data: requestData,
    });

  } catch (error) {
    console.error("Error in requestLeaveAndPermission:", error.message);
    return res.status(500).json({ 
      error_code: 500,
      message: "Internal Server Error" 
    });
  }
};


export const getRequestLeaveAndPermission = async(req,res)=>{

  try {
    const userId = req.user._id;
    const employee = await EmployeeModel.findById(userId);

    if(!employee){
      return res.status(404).json({
        error_code: 404,
        message: "Invalid user",
      });
    }

    const leaveAndPermissionDetails = await RequestModel.aggregate([
      {
        $match: { managerId:userId, status: "pending" }
        
      },
      {
        $lookup: {
          from: "employees",
          localField: "userId",
          foreignField: "_id",
          as: "employeeDetails"
        }
      },
      {
        $unwind: "$employeeDetails"
      },
      {
        $addFields: {
          "employeeDetails.empRole": "$employeeDetails.personalDetails.empRole"
        }
      },
      {
        $project: {
          _id: 1,
          managerId: 1,
          userId: 1,
          requestDetails: 1,
          "employeeDetails.employeeName": 1,
          "employeeDetails.email": 1,
          "employeeDetails.empRole": 1,
          "employeeDetails.casualLeave": 1,
          "employeeDetails.leaveDays": 1,
          "employeeDetails.permission": 1   
        }
      }
    ]);

    return res.status(200).json({
      error_code:200,
      message:"Data fetched Succesfully",
      data:leaveAndPermissionDetails
    })



  } catch (error) {
    console.error("Error in getRequestLeaveAndPermission:", error.message);
    return res.status(500).json({ 
      error_code: 500,
      message: "Internal Server Error" 
    });
    
  }
}

export const getLeaveAndPermissionDetails = async(req,res)=>{
  try {
    const userId = req.user._id;
    const employee = await EmployeeModel.findById(userId);

    if(!employee){
      return res.status(404).json({
        error_code: 404,
        message: "Invalid user",
      });
    }

    const leaveAndPermissionDetails = await RequestModel.aggregate([
      {
        $match: { userId:userId}
        
      },
      {
        $lookup: {
          from: "employees",
          localField: "userId",
          foreignField: "_id",
          as: "employeeDetails"
        }
      },
      {
        $unwind: "$employeeDetails"
      },
      {
        $project: {
          _id: 1,
          requestDetails: 1,
          status:1,
          acceptedStatus:1,
          "employeeDetails.casualLeave": 1,
          "employeeDetails.leaveDays": 1,
          "employeeDetails.permission": 1   
        }
      }
    ]);

    console.log(leaveAndPermissionDetails)

    return res.status(200).json({
      error_code:200,
      message:"Data fetched Succesfully",
      data:leaveAndPermissionDetails
    })
    
  } catch (error) {
    console.error("Error in getRequestLeaveAndPermission:", error.message);
    return res.status(500).json({ 
      error_code: 500,
      message: "Internal Server Error" 
    });
    
  }

}

export const approveRequest = async (req, res) => {
  try {
    const reqId = req.params.id;
    const userId = req.user._id;
    const { acceptedStatus } = req.body;

  
    const employee = await EmployeeModel.findById(userId);
    if (!employee) {
      return res.status(404).json({
        error_code: 404,
        message: "Invalid user",
      });
    }

    
    if (!reqId || !acceptedStatus) {
      return res.status(400).json({
        error_code: 400,
        message: "Request Id and status are required",
      });
    }

 
    const request = await RequestModel.updateOne(
      { _id: reqId },
      { $set: { status: "completed", acceptedStatus: acceptedStatus } }
    );

    if (request.matchedCount === 0) {
      return res.status(404).json({
        error_code: 404,
        message: "Request Id not found",
      });
    }

   
    if (request.modifiedCount === 0) {
      return res.status(200).json({
        error_code: 304,
        message: "No changes were made. The request was already updated.",
      });
    }

    return res.status(200).json({
      error_code: 200,
      message: "Request updated successfully",
    });
  } catch (error) {
    console.error("Error in approveRequest:", error.message);
    return res.status(500).json({
      error_code: 500,
      message: "Internal Server Error",
    });
  }
};



