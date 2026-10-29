import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";


const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sign a JWT for the given user payload.
 * @param {{ id: number, email: string, role: string }} payload
 * @returns {string} signed token
 */
const signToken = (payload) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Attach the JWT as a secure, httpOnly cookie on the response.
 * @param {import('express').Response} res
 * @param {string} token
 */
const setCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
};

/**
 * Derive the user's role from their email address using the hospital
 * email convention:
 *
 *   Doctor  → D<id>_<name>@carewell.hospital.ac.in  (e.g. D101_rahul@carewell.hospital.ac.in)
 *   Staff   → S<id>_<name>@carewell.hospital.ac.in  (e.g. S101_priya@carewell.hospital.ac.in)
 *   Admin   → A<id>_<name>@carewell.hospital.ac.in  (e.g. A101_amit@carewell.hospital.ac.in)
 *   Patient → any other email                        (e.g. rahul@gmail.com)
 *
 * @param {string} email
 * @returns {string} role
 */
const detectRoleFromEmail = (email) => {
    const lower = email.toLowerCase().trim();
    const HOSPITAL_DOMAIN = "carewell.hospital.ac.in";

    if (lower.endsWith(`@${HOSPITAL_DOMAIN}`)) {
        const localPart = lower.split("@")[0]; // e.g. "d101_rahul"

        if (/^d\d+_.+$/.test(localPart)) return "doctor";
        if (/^s\d+_.+$/.test(localPart)) return "staff";
        if (/^a\d+_.+$/.test(localPart)) return "admin";

        // Hospital domain but unrecognised prefix — treat as patient
        return "patient";
    }

    // Any other email → patient
    return "patient";
};


// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 *
 * Open registration — anyone can sign up with any email.
 * Role is derived from the email format and stored in the DB.
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ── Validate required fields ──────────────────────────────────────────
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "name, email and password are required." });
        }

        // ── Check for duplicate email ─────────────────────────────────────────
        const existing = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email.toLowerCase()]
        );

        if (existing.rowCount > 0) {
            return res.status(409).json({ message: "Email already registered." });
        }

        // ── Hash password & persist ───────────────────────────────────────────
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

const { rows } = await pool.query(
  `INSERT INTO users (name, email, password_hash, role)
   VALUES ($1, $2, $3, 'patient')
   RETURNING id, name, email, role, created_at`,
  [name.trim(), email.trim().toLowerCase(), password_hash]
);

        return res.status(201).json({
            message: "User registered successfully.",
            user: rows[0],
        });
    } catch (error) {
        console.error("register error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Role is re-derived from the email format at login time and embedded in
 * the JWT — this is the authoritative source for role-based access control.
 *
 *   Doctor  → D<id>_<name>@carewell.hospital.ac.in
 *   Staff   → S<id>_<name>@carewell.hospital.ac.in
 *   Admin   → A<id>_<name>@carewell.hospital.ac.in
 *   Patient → any other email
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        // ── Fetch user ────────────────────────────────────────────────────────
        const { rows } = await pool.query(
            `SELECT id, name, email, password_hash, role, created_at
   FROM users
   WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = rows[0];

        // ── Verify password ───────────────────────────────────────────────────
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // ── Detect role from email (authoritative at login) ───────────────────
        const role = user.role;

        const token = signToken({
            id: user.id,
            email: user.email,
            role,
        });

        // Strip the hash before sending back
        const { password_hash, ...safeUser } = user;

        setCookie(res, token);

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: { ...safeUser, role },
        });
    } catch (error) {
        console.error("login error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * POST /api/auth/logout
 * Stateless JWT — client should discard the token.
 * Protected route (requires valid token via authMiddleware).
 */
export const logout = (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully." });
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Protected route (requires valid token via authMiddleware).
 */
export const getMe = async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ user: rows[0] });
    } catch (error) {
        console.error("getMe error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
