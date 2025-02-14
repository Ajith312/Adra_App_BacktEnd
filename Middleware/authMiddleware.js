import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import EmployeeModel from "../Models/employee.Schema.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
  
    if (!req.headers.authorization) {
      return res.status(401).json({
        error_code: 401,
        message: "Token is missing",
      });
    }

  
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error_code: 401,
        message: "Token is missing",
      });
    }

   

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        error_code: 401,
        message: "Invalid token. Please login again",
      });
    }



  
    const user = await EmployeeModel.findById(decoded._id); 
    if (!user) {
      return res.status(403).json({
        error_code: 403,
        message: "Unauthorized user",
      });
    }

   
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error_code: 401,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(500).json({
      error_code: 500,
      message: "Internal server error",
    });
  }
};

export default authMiddleware;
