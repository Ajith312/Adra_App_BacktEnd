import express from "express"
import { approveRequest, getEmployeeLeaveAndPermissionDetails, getProfileDetails, getManagerRequestsLeaveAndPermissionDetails, requestLeaveAndPermission, userLogin, userRegister, getTeamMembersDetails, updateFCMToken, getRefreshToken } from "../Controllers/employee.Controller.js"
import authMiddleware from "../Middleware/authMiddleware.js"


const router = express.Router()

router.post('/register',userRegister)
router.post('/login',userLogin)
router.post('/update-fcm-token',updateFCMToken)
router.get('/get-profile-details',authMiddleware,getProfileDetails)
router.post('/leave-request',authMiddleware,requestLeaveAndPermission)
router.get('/get-levaerequest-details',authMiddleware,getManagerRequestsLeaveAndPermissionDetails)
router.post('/approve-request/:id',authMiddleware,approveRequest)
router.get('/employee-notification-details',authMiddleware,getEmployeeLeaveAndPermissionDetails)
router.get('/get-team-details',authMiddleware,getTeamMembersDetails)
router.get('/get-referesh-token',getRefreshToken)



export default router