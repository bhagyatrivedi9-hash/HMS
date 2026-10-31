import pool from "../config/database.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // Get user counts based on roles
    const userResult = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE role = 'patient') AS total_patients,
        COUNT(*) FILTER (WHERE role = 'doctor') AS total_doctors,
        COUNT(*) FILTER (WHERE role = 'staff') AS total_staff
      FROM users
    `);

    // Get appointment counts based on status
    const appointmentResult = await pool.query(`
      SELECT
        COUNT(*) AS total_appointments,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending_appointments,
        COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_appointments,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_appointments,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_appointments,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected_appointments
      FROM appointments
    `);

    // Get total departments
    const departmentResult = await pool.query(`
      SELECT COUNT(*) AS total_departments
      FROM departments
    `);

    return res.status(200).json({
      success: true,
      dashboard: {
        ...userResult.rows[0],
        ...appointmentResult.rows[0],
        ...departmentResult.rows[0],
      },
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    // Validate role if provided
    const allowedRoles = ["patient", "doctor", "staff"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    let query = `
      SELECT id, name, email, role, COALESCE(is_active, true) AS is_active, created_at
      FROM users
      WHERE role IN ('patient', 'doctor', 'staff')
    `;

    const values = [];

    // Filter by role if provided
    if (role) {
      query += ` AND role = $1`;
      values.push(role);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      users: result.rows,
    });

  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // 1. Validate user ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // 2. Validate status
    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be true or false",
      });
    }

    // 3. Update user status
    const result = await pool.query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2
         AND role IN ('patient', 'doctor', 'staff')
       RETURNING id, name, email, role, is_active`,
      [is_active, Number(id)]
    );

    // 4. Check whether user exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: is_active
        ? "User activated successfully"
        : "User deactivated successfully",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};
