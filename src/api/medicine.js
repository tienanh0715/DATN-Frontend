import APIs from './APIs'
import Request from './request'
export default class Medicine extends Request{

    static getDefault()
    {
        return {
            id: 0,
            code: "", 
            name: "",
            effect:"",
            charge: "",
            image:"",
            unit:"",
            origin: ""
        }
    }

    static async getMedicines()
    {
        return await this.get(APIs.medicine.list)
    }
    static async getMedicineByDate(from,to)
    {
        return await this.post(APIs.medicine.date,{from:from,to:to})
    }
   
    static async addMedicine(data)
    {
        return await this.post(APIs.medicine.list,data)
    }

    static async editMedicine(data)
    {
        return await this.put(APIs.medicine.list+"/"+data.id, data)
    }


    static async deleteMedicine(ids)
    {
        return await this.delete(APIs.medicine.list,ids)
    }

}