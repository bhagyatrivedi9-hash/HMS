import pool from "../config/database.js"


export const getAllAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;

    // Validate status if provided
    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "rejected",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    let query = `
      SELECT
        a.id AS appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        a.created_at,

        p.id AS patient_id,
        p.name AS patient_name,
        p.email AS patient_email,

        d.id AS doctor_id,
        du.name AS doctor_name,
        d.specialization

      FROM appointments a

      JOIN users p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users du ON du.id = d.user_id

      WHERE 1 = 1
    `;

    const values = [];

    // Filter by date
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      values.push(date);
      query += ` AND a.appointment_date = $${values.length}`;
    }

    // Filter by status
    if (status) {
      values.push(status);
      query += ` AND a.status = $${values.length}`;
    }

    query += `
      ORDER BY a.appointment_date DESC,
               a.appointment_time DESC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      appointments: result.rows,
    });

  } catch (error) {
    console.error("Get all appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};


export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Validate appointment ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    // 2. Allow only confirmed or cancelled
    const allowedStatuses = ["confirmed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be confirmed or cancelled",
      });
    }

    // 3. Update appointment status
    const result = await pool.query(
      `UPDATE appointments
       SET status = $1
       WHERE id = $2
         AND (
           (status = 'pending' AND $1 IN ('confirmed', 'cancelled'))
           OR
           (status = 'confirmed' AND $1 = 'cancelled')
         )
       RETURNING *`,
      [status, Number(id)]
    );

    // 4. Check whether appointment was updated
    if (result.rows.length === 0) {
      const appointment = await pool.query(
        `SELECT id, status
         FROM appointments
         WHERE id = $1`,
        [Number(id)]
      );

      if (appointment.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Appointment cannot be changed from ${appointment.rows[0].status} to ${status}`,
      });
    }

    // 5. Return updated appointment
    return res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment: result.rows[0],
    });

  } catch (error) {
    console.error("Update appointment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
    });
  }
};

