import APIs from './APIs'
import Request from './request'
export default class Report extends Request {

    static getDefault()
    {
        return {
            id:0,
        }
    }

    static async getReportAccounts()
    {
        return await this.get(APIs.report.account)
    }

    static async getReportPatient()
    {
        return await this.get(APIs.report.patient)
    }
    static async getReportIncome()
    {
        return await this.get(APIs.report.income)
    }

    static async getReportAppointments(data)
    {
        return await this.post(APIs.report.appointment,data)
    }

    static async getAllDoctor()
    {
        return await this.get(APIs.report.allDoctor)
    }
    static async getAllPatient()
    {
        return await this.get(APIs.report.allPatient)
    }
}