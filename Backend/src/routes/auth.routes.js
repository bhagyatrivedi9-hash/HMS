import { Router } from "express";
import { register, login, logout, getMe } from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ── Protected routes (valid JWT required) ─────────────────────────────────────
router.post("/logout", protect, logout);
router.get("/get-me", protect, getMe);

export default router;
