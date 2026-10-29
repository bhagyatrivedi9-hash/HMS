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





