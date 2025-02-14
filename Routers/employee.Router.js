import express from "express"
import { approveRequest, getLeaveAndPermissionDetails, getProfileDetails, getRequestLeaveAndPermission, requestLeaveAndPermission, userLogin, userRegister } from "../Controllers/employee.Controller.js"
import authMiddleware from "../Middleware/authMiddleware.js"

const router = express.Router()

router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/get-profile-details',authMiddleware,getProfileDetails)
router.post('/leave-request',authMiddleware,requestLeaveAndPermission)
router.get('/get-levaerequest-details',authMiddleware,getRequestLeaveAndPermission)
router.post('/approve-request/:id',authMiddleware,approveRequest)
router.get('/employee-notification-details',authMiddleware,getLeaveAndPermissionDetails)

export default router