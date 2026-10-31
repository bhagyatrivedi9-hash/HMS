import {
  GetAllDepartments,
  getDoctorsByDepartment,
  getDoctorById,
  getAvailableSlots,
} from '../controller/Department.controller.js';
import { Router } from 'express';

const router = Router();

router.get('/', GetAllDepartments);
router.get('/doctor/:id', getDoctorById);
router.get('/doctors/:id', getDoctorsByDepartment);
router.get('/doctors/:id/slots', getAvailableSlots);

export default router;
