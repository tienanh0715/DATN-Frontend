import Service from '../api/service'
export const service = {
    name: "service",
    state: {
        services:{
            data:[],
            dataShow:[],
        }
    },
    reducers: {
        updateService: (state, payload) => {
            state.services.data = payload
        },
        setData:(state, payload) => {
          state.services.data = payload
        },
        setDataShow:(state, payload) => {
          state.services.dataShow = payload
        },
    },
    effects: {
        async loadData(payload, rootState) {
            const response = await Service.getServices()
            if(response.result == 'okie')
            {
                console.log("services-res",response)
                this.updateService(response.data) // dispatch action to a local 
            }
            else
            {
              this.updateService([])
            }
            return response;
        },
        async addNew(newService, rootState) {
        //   let result = Service.addService(newService)
        //   if(result) 
        //   {
        //     await Service.getServices().then(data => this.setData(data))
        //     return true
        //   }
        //   else
        //   {
        //     return false
        //   }
        },
        async edit(editService, rootState) {
        //   let result = Service.editService(editService)
        //   if(result) 
        //   {
        //     // await Service.getServices().then(data => this.setData(data))
        //     return true
        //   }
        //   else
        //   {
        //     return false
        //   }
        },
        async deleteService(ids, rootState) {
          let response = await Service.deleteService(ids)
          if(response.result == "okie")
          {
            console.log("load Service")
            await Service.getServices().then(res =>{
              if(res.result=="okie")
              {
                this.setData(res.data)
              }
              else
              {
                console.log("error",res.message)
              }
            })
          }
          return response

        },
        async changeStatus(payload, rootState) {
          const { isCheck, status} = payload
        //   let result = await Service.changeStatus(isCheck,status)
        //   if(result) 
        //   {
        //     // await Service.getServices().then(data => this.setData(data))
        //     return true
        //   }
        //   else
        //   {
        //     return false
        //   }
        }
    },
    selectors: (slice, createSelector, hasProps) => ({
      getService() {
        return slice((state) => state.userLogin )
      },
      getServices() {
        return slice((state) => state.users )
      }
    }),
  };