import APIs from './APIs'
import Request from './request'
import moment from "moment-timezone";
export default class Review extends Request {

    static getDefault()
    {
        return {
            id:0,
        }
    }


    static async getReviews()
    {
        return await this.get(APIs.review.list)
    }

    static async addReview(data)
    {
        return await this.post(APIs.review.list,data)
    }
    static async reExamine(data)
    {
        return await this.post(APIs.review.reExamine,data)
    }

    static async getReview(id)
    {
        return await this.get(APIs.review.list+"/"+id)
    }
    static async getReviewByAppointment(id)
    {
        return await this.get(APIs.review.findByAppointment+id)
    }
    static async getReviewByDoctor(id)
    {
        return await this.get(APIs.review.findByDoctor+id)
    }
    static async editReview(data)
    {
        return await this.put(APIs.review.list+"/"+data.id,data)
    }
    
    static async deleteReview(ids)
    {
        return await this.delete(APIs.review.list,ids)
    }

    static async changeStatus(data)
    {
        return await this.put(APIs.review.updateStatus,data)
    }
    static async getReviewByDate(from,to)
    {
        return await this.post(APIs.review.date,{from:from,to:to})
    }

}