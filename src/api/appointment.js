import APIs from './APIs'
import Request from './request'
import moment from "moment-timezone";
export default class Appointment extends Request {

    static getDefault()
    {
        return {
            id:0,
            images:"a"
        }
    }


    static async getAppointments()
    {
        return await this.get(APIs.appointment.list)
    }

    static async addAppointment(data)
    {
        return await this.post(APIs.appointment.list,data)
    }
    static async reExamine(data)
    {
        return await this.post(APIs.appointment.reExamine,data)
    }

    static async getAppointment(id)
    {
        return await this.get(APIs.appointment.list+"/"+id)
    }
    static async getAppointmentByDoctor(data)
    {
        return await this.post(APIs.appointment.findByDoctor,data)
    }
    static async editAppointment(data)
    {
        return await this.put(APIs.appointment.list+"/"+data.id,data)
    }
    
    static async deleteAppointment(ids)
    {
        return await this.delete(APIs.appointment.list,ids)
    }

    static async changeStatus(data)
    {
        return await this.put(APIs.appointment.updateStatus,data)
    }
    static async getAppointmentByDate(from,to)
    {
        return await this.post(APIs.appointment.date,{from:from,to:to})
    }

}