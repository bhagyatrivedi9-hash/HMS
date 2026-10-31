import pool from '../config/database.js';

export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    // 1. Validate required fields
    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: "Doctor, appointment date and time are required",
      });
    }

    // 2. Validate doctor ID
    if (!Number.isInteger(Number(doctor_id)) || Number(doctor_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    // 3. Check whether doctor exists
    const doctorResult = await pool.query(
      "SELECT id FROM doctors WHERE id = $1",
      [doctor_id]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 4. Check whether selected date is valid
    if (!/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    // 5. Check whether date is not in the past
    const dateCheck = await pool.query(
      "SELECT $1::date >= CURRENT_DATE AS valid",
      [appointment_date]
    );

    if (!dateCheck.rows[0].valid) {
      return res.status(400).json({
        success: false,
        message: "Cannot book an appointment for a past date",
      });
    }

    // 6. Validate appointment time
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(appointment_time)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment time",
      });
    }

    // 7. Check doctor's schedule for selected weekday
    const scheduleResult = await pool.query(
      `SELECT start_time, end_time, slot_duration_minutes, max_patients_per_slot
       FROM doctor_schedules
       WHERE doctor_id = $1
       AND day_of_week = EXTRACT(DOW FROM $2::date)::INT
       AND is_available = TRUE`,
      [doctor_id, appointment_date]
    );

    if (scheduleResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available on this date",
      });
    }

    const schedule = scheduleResult.rows[0];

    // Convert times into minutes
    const toMinutes = (time) => {
      const [hours, minutes] = String(time)
        .split(":")
        .map(Number);

      return hours * 60 + minutes;
    };

    const selectedTime = toMinutes(appointment_time);
    const startTime = toMinutes(schedule.start_time);
    const endTime = toMinutes(schedule.end_time);

    // 8. Check if selected time is a valid slot
    if (
      selectedTime < startTime ||
      selectedTime + schedule.slot_duration_minutes > endTime ||
      (selectedTime - startTime) % schedule.slot_duration_minutes !== 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment slot",
      });
    }

    // 9. Check whether slot is already booked
    // Lock the schedule row to prevent simultaneous bookings.
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const lockResult = await client.query(
        `SELECT id
         FROM doctor_schedules
         WHERE doctor_id = $1
         AND day_of_week = EXTRACT(DOW FROM $2::date)::INT
         AND is_available = TRUE
         FOR UPDATE`,
        [doctor_id, appointment_date]
      );

      if (lockResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Doctor is not available",
        });
      }

      const bookedResult = await client.query(
        `SELECT COUNT(*)::INT AS booked
         FROM appointments
         WHERE doctor_id = $1
         AND appointment_date = $2::date
         AND appointment_time = $3::time
         AND status IN ('pending', 'confirmed')`,
        [doctor_id, appointment_date, appointment_time]
      );

      if (
        bookedResult.rows[0].booked >=
        (schedule.max_patients_per_slot || 1)
      ) {
        await client.query("ROLLBACK");

        return res.status(409).json({
          success: false,
          message: "This appointment slot is already booked",
        });
      }

      // 10. Create appointment
      const result = await client.query(
        `INSERT INTO appointments
         (patient_id, doctor_id, appointment_date,
          appointment_time, reason, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING *`,
        [
          patientId,
          doctor_id,
          appointment_date,
          appointment_time,
          reason || null,
        ]
      );

      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment: result.rows[0],
      });

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Book appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const result = await pool.query(
      `SELECT
         a.id,
         a.appointment_date,
         a.appointment_time,
         a.reason,
         a.status,
         a.created_at,
         d.id AS doctor_id,
         u.name AS doctor_name,
         d.specialization,
         d.consultation_fee,
         dept.name AS department_name
       FROM appointments a
       JOIN doctors d ON d.id = a.doctor_id
       JOIN users u ON u.id = d.user_id
       LEFT JOIN departments dept ON dept.id = d.department_id
       WHERE a.patient_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [patientId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      appointments: result.rows,
    });
  } catch (error) {
    console.error("Get my appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const checkResult = await pool.query(
      `SELECT id, status FROM appointments WHERE id = $1 AND patient_id = $2`,
      [id, patientId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (checkResult.rows[0].status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status = 'cancelled'
       WHERE id = $1 AND patient_id = $2
       RETURNING *`,
      [id, patientId]
    );

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};






