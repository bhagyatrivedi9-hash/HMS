import { Router } from "express";
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controller/appointment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/book", protect, bookAppointment);
router.get("/my", protect, getMyAppointments);
router.patch("/:id/cancel", protect, cancelAppointment);

export default router;
