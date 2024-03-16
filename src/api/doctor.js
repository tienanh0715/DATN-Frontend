import APIs from './APIs'
import Request from './request'
import moment from "moment-timezone";
import Util from '../utils';
export default class Doctor extends Request {

    static getDefault()
    {
        return {
            id:0,
            full_name: "",
            date_of_birth: moment().format("YYYY-MM-DD"),
            gender:1,
            password: "",
            address: "",
            email:"",
            phone:"",
            emergency_info:"",
            avatar:"",
            qualifications:[
                {
                    id:Util.generateRandomId(),
                    degree:"",
                    specialization:"",
                    university:"",
                    year:"",
                    status:1
                }
            ],
            schedules_of_week:[]
        }
    }


    static async getDoctors()
    {
        return await this.get(APIs.doctor.list)
    }

    static async addDoctor(data)
    {
        return await this.post(APIs.doctor.list,data)
    }

    static async getDoctor(id)
    {
        return await this.get(APIs.doctor.list+"/"+id)
    }
    
    static async editDoctor(data)
    {
        return await this.put(APIs.doctor.list+"/"+data.id,data)
    }

    static async updateSchedule(data)
    {
        return await this.put(APIs.doctor.schedule+"/"+data.id,data)
    }
    
    static async deleteDoctor(ids)
    {
        return await this.delete(APIs.doctor.list,ids)
    }

    static async changeStatus(data)
    {
        return await this.put(APIs.doctor.updateStatus,data)
    }

}