import APIs from './APIs'
import Request from './request'
import moment from "moment-timezone";

export default class Staff extends Request {

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
            avatar:""
        }
    }

    static async login(email, password)
    {
        let result = await this.post(APIs.user.login, {
            email: email,
            password: password
        })
        return result
    }

    static async register(data)
    {
        let result = await this.post(APIs.guest.register, data)
        return result
    }

    static async logout(id)
    {
        return await this.delete(APIs.user.logout+id)
    }

    static async getStaffs()
    {
        return await this.get(APIs.staff.list)
    }

    static async getStaff(id)
    {
        return await this.get(APIs.staff.list+"/"+id)
    }

    static async addStaff(data)
    {
        return await this.post(APIs.staff.list,data)
    }

    static async editStaff(data)
    {
        return await this.put(APIs.staff.list+"/"+data.id,data)
    }
    
    static async deleteStaff(ids)
    {
        return await this.delete(APIs.staff.list,ids)
    }

}