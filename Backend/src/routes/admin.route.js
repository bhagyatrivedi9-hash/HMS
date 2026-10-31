import  {Router} from 'express';
import {protect, authorisAdmin} from '../middleware/auth.middleware.js';
import {getAdminDashboard, getAllUsers,updateUserStatus} from '../controller/admin.controller.js';



const router= Router()


router.get("/dashboard", protect, authorisAdmin, getAdminDashboard);
router.get("/users", protect, authorisAdmin, getAllUsers);
router.patch("/users/:id/status", protect, authorisAdmin, updateUserStatus);

export default router;