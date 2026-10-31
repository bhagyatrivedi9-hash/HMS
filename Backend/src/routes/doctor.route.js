import { Router } from "express";
import { protect, authorise } from "../middleware/auth.middleware.js";
import {
  getDoctorProfile,
  getDoctorAppointments,
  getPatientDetails,
  completeAppointment,
} from "../controller/doctor.controller.js";

const router = Router();

// Protect all doctor routes - require authentication and doctor role
router.use(protect, authorise("doctor"));

router.get("/profile", getDoctorProfile);
router.get("/appointments", getDoctorAppointments);
router.get("/patients/:id", getPatientDetails);
router.post("/appointments/:id/complete", completeAppointment);

export default router;
