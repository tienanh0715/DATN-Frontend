import APIs from './APIs'
import Request from './request'
import moment from "moment-timezone";
export default class Patient extends Request {

    static getDefault()
    {
        return {
            id:0,
            full_name: "",
            date_of_birth: moment().format("YYYY-MM-DD"),
            gender:2,
            password: "",
            address: "",
            email:"",
            phone:"",
            emergency_info:"",
            avatar:""
        }
    }


    static async getPatients()
    {
        return await this.get(APIs.patient.list)
    }

    static async addPatient(data)
    {
        return await this.post(APIs.patient.list,data)
    }

    static async getPatient(id)
    {
        return await this.get(APIs.patient.list+"/"+id)
    }
    
    static async editPatient(data)
    {
        return await this.put(APIs.patient.list+"/"+data.id,data)
    }
    
    static async deletePatient(ids)
    {
        return await this.delete(APIs.patient.list,ids)
    }

    static async changeStatus(data)
    {
        return await this.put(APIs.patient.updateStatus,data)
    }

}