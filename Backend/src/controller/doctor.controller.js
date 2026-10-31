import pool from "../config/database.js"


export const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
         u.id AS user_id,
         u.name,
         u.email,
         d.id AS doctor_id,
         d.specialization,
         d.qualification,
         d.experience_years,
         d.consultation_fee,
         dep.name AS department
       FROM users u
       JOIN doctors d ON d.user_id = u.id
       LEFT JOIN departments dep
         ON dep.id = d.department_id
       WHERE u.id = $1
         AND u.role = 'doctor'`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor: result.rows[0],
    });

  } catch (error) {
    console.error("Get doctor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor profile",
    });
  }
};



export const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get doctor's ID using logged-in user ID
    const doctorResult = await pool.query(
      `SELECT id FROM doctors
       WHERE user_id = $1`,
      [userId]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const doctorId = doctorResult.rows[0].id;

    // Fetch appointments with patient details
    const result = await pool.query(
      `SELECT
         a.id AS appointment_id,
         a.appointment_date,
         a.appointment_time,
         a.reason,
         a.status,
         a.created_at,
         u.id AS patient_id,
         u.name AS patient_name,
         u.email AS patient_email
       FROM appointments a
       JOIN users u ON u.id = a.patient_id
       WHERE a.doctor_id = $1
       ORDER BY a.appointment_date DESC,
                a.appointment_time DESC`,
      [doctorId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      appointments: result.rows,
    });

  } catch (error) {
    console.error("Get doctor appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};



export const getPatientDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: patientId } = req.params;

    // Validate patient ID
    if (!Number.isInteger(Number(patientId)) || Number(patientId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    // Get logged-in doctor's ID
    const doctorResult = await pool.query(
      `SELECT id FROM doctors
       WHERE user_id = $1`,
      [userId]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const doctorId = doctorResult.rows[0].id;

    // Check whether patient has an appointment with this doctor
    const result = await pool.query(
      `SELECT DISTINCT
         u.id AS patient_id,
         u.name,
         u.email,
         a.appointment_date,
         a.appointment_time,
         a.reason,
         a.status
       FROM users u
       JOIN appointments a ON a.patient_id = u.id
       WHERE u.id = $1
         AND u.role = 'patient'
         AND a.doctor_id = $2
       ORDER BY a.appointment_date DESC,
                a.appointment_time DESC`,
      [Number(patientId), doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found or no appointment with this doctor",
      });
    }

    return res.status(200).json({
      success: true,
      patient: {
        id: result.rows[0].patient_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
      },
      appointments: result.rows.map((row) => ({
        appointment_date: row.appointment_date,
        appointment_time: row.appointment_time,
        reason: row.reason,
        status: row.status,
      })),
    });

  } catch (error) {
    console.error("Get patient details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient details",
    });
  }
};


export const completeAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // 1. Validate appointment ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    // 2. Get logged-in doctor's ID
    const doctorResult = await pool.query(
      `SELECT id FROM doctors
       WHERE user_id = $1`,
      [userId]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const doctorId = doctorResult.rows[0].id;

    // 3. Update appointment status
    const result = await pool.query(
      `UPDATE appointments
       SET status = 'completed'
       WHERE id = $1
         AND doctor_id = $2
         AND status = 'confirmed'
       RETURNING *`,
      [Number(id), doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Appointment not found, not assigned to you, or not confirmed",
      });
    }

    // 4. Return updated appointment
    return res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
      appointment: result.rows[0],
    });

  } catch (error) {
    console.error("Complete appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete appointment",
    });
  }
};



