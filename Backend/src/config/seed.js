/**
 * seed.js — Run once to populate doctors, staff, and admins.
 * Usage: node src/config/seed.js
 */

import bcrypt from "bcrypt";
import pool from "./database.js";

const TEMP_PASSWORD = "Hospital@12345";

const doctors = [
  { name: "Rahul Sharma",  email: "D101_rahul@carewell.hospital.ac.in",  specialization: "Cardiology",       qualification: "MBBS, MD", experience: 10, fee: 800  },
  { name: "Priya Patel",   email: "D102_priya@carewell.hospital.ac.in",  specialization: "Dermatology",      qualification: "MBBS, MD", experience: 7,  fee: 600  },
  { name: "Amit Shah",     email: "D103_amit@carewell.hospital.ac.in",   specialization: "Neurology",        qualification: "MBBS, DM", experience: 12, fee: 1000 },
  { name: "Neha Mehta",    email: "D104_neha@carewell.hospital.ac.in",   specialization: "Pediatrics",       qualification: "MBBS, MD", experience: 5,  fee: 500  },
  { name: "Karan Desai",   email: "D105_karan@carewell.hospital.ac.in",  specialization: "Orthopedics",      qualification: "MBBS, MS", experience: 8,  fee: 700  },
  { name: "Anjali Verma",  email: "D106_anjali@carewell.hospital.ac.in", specialization: "Gynecology",       qualification: "MBBS, MS", experience: 9,  fee: 750  },
  { name: "Rohan Joshi",   email: "D107_rohan@carewell.hospital.ac.in",  specialization: "Ophthalmology",    qualification: "MBBS, MS", experience: 6,  fee: 600  },
  { name: "Sneha Gupta",   email: "D108_sneha@carewell.hospital.ac.in",  specialization: "Psychiatry",       qualification: "MBBS, MD", experience: 8,  fee: 700  },
  { name: "Vivek Rao",     email: "D109_vivek@carewell.hospital.ac.in",  specialization: "ENT",              qualification: "MBBS, MS", experience: 7,  fee: 650  },
  { name: "Pooja Nair",    email: "D110_pooja@carewell.hospital.ac.in",  specialization: "General Medicine", qualification: "MBBS, MD", experience: 11, fee: 500  },
];

const staffMembers = [
  { name: "Meera Singh",  email: "S101_meera@carewell.hospital.ac.in"  },
  { name: "Arjun Kumar",  email: "S102_arjun@carewell.hospital.ac.in"  },
  { name: "Kavita Joshi", email: "S103_kavita@carewell.hospital.ac.in" },
  { name: "Nikhil Patel", email: "S104_nikhil@carewell.hospital.ac.in" },
];

const adminUsers = [
  { name: "Amit Verma", email: "A101_amit@carewell.hospital.ac.in" },
  { name: "Riya Shah",  email: "A102_riya@carewell.hospital.ac.in"  },
];

async function upsertUser(client, account, role) {
  const passwordHash = await bcrypt.hash(TEMP_PASSWORD, 10);

  const result = await client.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       name          = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       role          = EXCLUDED.role
     RETURNING id`,
    [account.name, account.email.toLowerCase(), passwordHash, role]
  );

  return result.rows[0].id;
}

async function seedHospitalUsers() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const doctor of doctors) {
      const userId = await upsertUser(client, doctor, "doctor");

      await client.query(
        `INSERT INTO doctors
           (user_id, specialization, qualification, experience_years, consultation_fee)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO UPDATE SET
           specialization    = EXCLUDED.specialization,
           qualification     = EXCLUDED.qualification,
           experience_years  = EXCLUDED.experience_years,
           consultation_fee  = EXCLUDED.consultation_fee`,
        [userId, doctor.specialization, doctor.qualification, doctor.experience, doctor.fee]
      );
    }

    for (const member of staffMembers) {
      await upsertUser(client, member, "staff");
    }

    for (const admin of adminUsers) {
      await upsertUser(client, admin, "admin");
    }

    await client.query("COMMIT");
    console.log("  Seeded 10 doctors, 4 staff, and 2 admins successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seeding failed:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end(); // safe here — this is a standalone script, not the app
  }
}


export default seedHospitalUsers;
