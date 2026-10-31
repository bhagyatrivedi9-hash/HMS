import pool from "../config/database.js"



export const GetAllDepartments= async (req,res)=>{
    

try {
    const result = await pool.query(`
      SELECT id, name, description
      FROM departments
      ORDER BY name ASC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      departments: result.rows  
    });

  } catch (error) {
    console.error("Get departments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments"
    });
  }

}




export const getDoctorsByDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate department ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    
    const departmentResult = await pool.query(
      "SELECT id, name FROM departments WHERE id = $1",
      [id]
    );

    if (departmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

   
    const result = await pool.query(
      `SELECT
         d.id AS doctor_id,
         u.name AS doctor_name,
         d.specialization,
         d.qualification,
         d.experience_years,
         d.consultation_fee
       FROM doctors d
       JOIN users u ON u.id = d.user_id
       WHERE d.department_id = $1
         AND u.role = 'doctor'
       ORDER BY u.name ASC`,
      [id]
    );

    return res.status(200).json({
      success: true,
      department: departmentResult.rows[0].name,
      count: result.rows.length,
      doctors: result.rows,
    });
  } catch (error) {
    console.error("Get doctors by department error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};






export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const result = await pool.query(
      `SELECT
         d.id AS doctor_id,
         u.name AS doctor_name,
         d.specialization,
         d.qualification,
         d.experience_years,
         d.consultation_fee,
         d.department_id,
         dept.name AS department_name
       FROM doctors d
       JOIN users u ON u.id = d.user_id
       LEFT JOIN departments dept ON dept.id = d.department_id
       WHERE d.id = $1
         AND u.role = 'doctor'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor: result.rows[0],
    });
  } catch (error) {
    console.error("Get doctor by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor details",
    });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Validate doctor ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Valid date is required (YYYY-MM-DD)",
      });
    }

    // Get doctor's schedule for the selected date
    const scheduleResult = await pool.query(
      `SELECT
         ds.start_time,
         ds.end_time,
         ds.slot_duration_minutes
       FROM doctor_schedules ds
       JOIN doctors d ON d.id = ds.doctor_id
       WHERE d.id = $1
         AND ds.day_of_week =
           EXTRACT(DOW FROM $2::date)::INT
         AND ds.is_available = TRUE`,
      [Number(id), date]
    );

    if (scheduleResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        slots: [],
        message: "Doctor is not available on this date",
      });
    }

    const schedule = scheduleResult.rows[0];

    // Get already-booked appointment times
    const bookedResult = await pool.query(
      `SELECT appointment_time
       FROM appointments
       WHERE doctor_id = $1
         AND appointment_date = $2::date
         AND status IN ('pending', 'confirmed')`,
      [Number(id), date] 
    );

    const bookedTimes = new Set(
      bookedResult.rows.map((row) =>
        String(row.appointment_time).slice(0, 8)
      )
    );

    // Generate available slots
    const toMinutes = (time) => {
      const [hours, minutes] = String(time)
        .split(":")
        .map(Number);
      return hours * 60 + minutes;
    };

    const toTimeString = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
    };

    const start = toMinutes(schedule.start_time);
    const end = toMinutes(schedule.end_time);
    const duration = schedule.slot_duration_minutes;

    const slots = [];

    for (
      let time = start;
      time + duration <= end;
      time += duration
    ) {
      const slotTime = toTimeString(time);

      if (!bookedTimes.has(slotTime)) {
        slots.push(slotTime.slice(0, 5));
      }
    }

    // Don't offer past slots for today's date
    const today = new Date();
    const todayDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (date < todayDate) {
      return res.status(200).json({
        success: true,
        slots: [],
        message: "Cannot book appointments for a past date",
      });
    }

    if (date === todayDate) {
      const currentMinutes =
        today.getHours() * 60 + today.getMinutes();

      const futureSlots = slots.filter((slot) => {
        const [hours, minutes] = slot.split(":").map(Number);
        return hours * 60 + minutes > currentMinutes;
      });

      return res.status(200).json({
        success: true,
        date,
        doctor_id: Number(id),
        slot_duration_minutes: duration,
        slots: futureSlots,
      });
    }

    return res.status(200).json({
      success: true,
      date,
      doctor_id: Number(id),
      slot_duration_minutes: duration,
      slots,
    });
  } catch (error) {
    console.error("Get available slots error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch available slots",
    });
  }
};