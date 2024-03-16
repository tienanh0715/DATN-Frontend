import APIs from './APIs'
import Request from './request'
import moment from "moment-timezone";

export default class Guest extends Request {

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
            blood_group:1,
            allergy_info:""
        }
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

    static async getGuests()
    {
        return await this.get(APIs.guest.list)
    }

    static async getGuest(id)
    {
        return await this.get(APIs.guest.list+"/"+id)
    }

    static async addGuest(data)
    {
        return await this.post(APIs.guest.list,data)
    }

    static async editGuest(data)
    {
        return await this.put(APIs.guest.list+"/"+data.id,data)
    }
    
    static async deleteGuest(ids)
    {
        return await this.delete(APIs.guest.list,ids)
    }

}