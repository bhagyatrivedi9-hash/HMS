import {GetAllDepartments, getDoctorsByDepartment} from '../controller/Department.controller.js'
import {Router} from 'express'


const router= Router()


router.get('/',GetAllDepartments)
router.get('/doctors/:id', getDoctorsByDepartment)


export default router