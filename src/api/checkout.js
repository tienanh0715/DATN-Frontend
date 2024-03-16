import APIs from './APIs'
import Request from './request'
export default class Checkout extends Request {

    static getDefault()
    {
        return {
            id:0,
        }
    }

    static async getCheckouts()
    {
        return await this.get(APIs.checkout.list)
    }

    static async addCheckout(data)
    {
        return await this.post(APIs.checkout.list,data)
    }
    static async reExamine(data)
    {
        return await this.post(APIs.checkout.reExamine,data)
    }

    static async getCheckout(id)
    {
        return await this.get(APIs.checkout.list+"/"+id)
    }
    static async getCheckoutByDoctor(data)
    {
        return await this.post(APIs.checkout.findByDoctor,data)
    }
    static async editCheckout(data)
    {
        return await this.put(APIs.checkout.list+"/"+data.id,data)
    }
    
    static async deleteCheckout(ids)
    {
        return await this.delete(APIs.checkout.list,ids)
    }

    static async changeStatus(data)
    {
        return await this.put(APIs.checkout.updateStatus,data)
    }
    static async getCheckoutByDate(from,to)
    {
        return await this.post(APIs.checkout.date,{from:from,to:to})
    }

}