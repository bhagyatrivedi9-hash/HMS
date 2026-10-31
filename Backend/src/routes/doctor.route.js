import { Router } from "express";
import { protect, authorise } from "../middleware/auth.middleware.js";
import {
  getDoctorProfile,
  getDoctorAppointments,
  getPatientDetails,
  completeAppointment,
} from "../controller/doctor.controller.js";
import { authorisDoctor } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all doctor routes - require authentication and doctor role
router.use(protect, authorise("doctor"));

router.get("/profile", authorisDoctor, getDoctorProfile);
router.get("/appointments", authorisDoctor, getDoctorAppointments);
router.get("/patients/:id", authorisDoctor, getPatientDetails);
router.post("/appointments/:id/complete", authorisDoctor, completeAppointment);

export default router;
