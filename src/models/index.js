import { service } from './services'
import { theme } from './theme'
import { user } from './user'
import { medicine } from './medicine'
import { doctor } from './doctor'
import { patient } from './patient'
import { appointment } from './appointment'
import { staff } from './staff'
import { checkout } from './checkout'
import  { guest } from './guest'

export const models = {
    staff: staff,
    appointment: appointment,
    theme: theme,
    user: user,
    service: service,
    doctor: doctor,
    patient:patient,
    medicine: medicine,
    checkout:checkout,
    guest: guest
}