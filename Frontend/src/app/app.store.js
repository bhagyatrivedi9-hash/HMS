import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import appointmentReducer from '../features/Appointments/appointment.slice'


export const store= configureStore({
    reducer:{
        auth:authReducer,
        appointment: appointmentReducer,
    }
})

