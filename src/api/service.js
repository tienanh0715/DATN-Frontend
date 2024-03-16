import APIs from './APIs'
import localStore from '../utils/localStorage'
import Request from './request'
export default class Service extends Request {
   
    static getDefault()
    {
        return {
            id:0,
            name: "",
            image: "",
            status: 1,
            charge: 0,
            description: "",
            code:""
        }
    }

    static async getServices()
    {
       return await this.get(APIs.service.list)
    }
    
    static async getInitialServices()
    {
        let Services = [
            { 
                id: 1 , 
                name: "101", 
                address:"Tòa A, Khu C", 
                floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,
                status:0,
            },
            { 
                id: 2 , 
                name: "102", 
                address:"Khu A", 
                floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:1,       
            },
            { 
                id: 3, 
                name: "103", 
                address:"Khu A", 
                floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:1,
            },
            { 
                id: 4, 
                name: "104", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:0, 
            },
            { 
                id: 5, 
                name: "105", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:1,
            },
            { 
                id: 6 , 
                name: "106", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:0,
            },
            { 
                id: 7, 
                name: "107", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:1,
            },
            { 
                id: 8 , 
                name: "108", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:0,
            },
            { 
                id: 9, 
                name: "109", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  58m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,

                status:1,
            },
            { 
                id: 10 , 
                name: "1010", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 2 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                number_of_people:4,


                status:0,
            },
            { 
                id: 11 , 
                name: "1011", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 12 , 
                name: "1012", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 13 , 
                name: "1013", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 14 , 
                name: "1014", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 15 , 
                name: "1015", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 16 , 
                name: "1016", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 17 , 
                name: "1017", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 18 , 
                name: "1018", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
                status:0,
            },
            { 
                id: 19 , 
                name: "1019", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",

status:0,
            },
            { 
                id: 20 , 
                name: "1020", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                
description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
status:0,
            },
            { 
                id: 21 , 
                name: "1021", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                
description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
status:0,
            },
            { 
                id: 22 , 
                name: "1022", 
                address:"Khu A", 
floor: 1,
                created_at:"05 Dec 2022", 
                
description:"Diện tích:  78m2, 3 phòng ngủ, 1 phòng bếp, 1 phòng khách, nội thất đầy đủ",
status:0,
            },
            
        ]
        localStore.set('Services',Services)
        return Services
    }

    static async getService(id){
        return await this.get(APIs.service.list+"/"+id)
    }

    static async addService(data)
    {
        return await this.post(APIs.service.list,data)
    }
    
    static async editService(data)
    {
        return await this.put(APIs.service.list+"/"+data.id, data)
    }

    static async deleteService(ids)
    {
        return await this.delete(APIs.service.list,ids)
    }

}