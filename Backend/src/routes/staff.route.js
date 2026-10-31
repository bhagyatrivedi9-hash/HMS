import {Router} from "express";

import {authorisStaff, protect} from "../middleware/auth.middleware.js";

import {
  getAllAppointments,
  updateAppointmentStatus,
} from "../controller/staff.controller.js";


const router= Router()


router.get("/appointments", protect, authorisStaff, getAllAppointments);

router.patch("/appointments/:id/status", protect, authorisStaff, updateAppointmentStatus);

export default router;