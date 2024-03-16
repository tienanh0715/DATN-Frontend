import Appointment from '../api/appointment'

export const appointment = {
    name: "appointment",
    state: {
        isBooking:false,
        appointmentLogin:Appointment.getDefault(),
        appointments:{
            data:[],
            dataShow:[],
        },
        doctorId: "",
        serviceId:""
    },
    reducers: {
        setData:(state, payload) => {
          state.appointments.data = payload
        },
        setDataShow:(state, payload) => {
          state.appointments.dataShow = payload
        },
        showBooking: (state,payload) => {
          // console.log("showBoooking",payload)
          state.isBooking = payload
          state.doctorId= ""
          state.serviceId=""
        },
        showBookingFromDoctor: (state,payload) => {
          // console.log("showBoooking",payload)
          state.isBooking = payload.isBooking
          state.doctorId = payload.doctorId
          state.serviceId = ""
        },
        showBookingFromService: (state,payload) => {
          // console.log("showBoooking",payload)
          state.isBooking = payload.isBooking
          state.doctorId = ""
          state.serviceId = payload.serviceId
        }
    },
    effects: {
        async loadData(search='', rootState) {
            const response = await Appointment.getAppointments().then(data => {
               // todo handle response
              let newData=data
              if( search !== '')
              {
                  newData= newData.filter( e => e.name.includes(search) || e.appointmentname.includes(search))
              }
              this.setData(newData)
            })
            return true
        },
        async addNew(newAppointment, rootState) {
          let response = await Appointment.addAppointment(newAppointment)
          if(response.result=="okie")
          {
            return true
          }
          else
          {
            return false
          }
        },
        async edit(editAppointment, rootState) {
          let response = await Appointment.editAppointment(editAppointment)
          if(response.result=="okie")
          {
            console.log("load Appointment")
            await Appointment.getAppointments().then(res =>{
              if(res.result=="okie")
              {
                this.setData(res.data)
              }
              else
              {
                console.log("error",res.message)
              }
            })
            return response
          }
          else
          {
            console.log("error",response.message)
            return response
          }
        },
        async deleteAppointment(data, rootState) {
          let response = await Appointment.editAppointment(data)
          if(response.result == "okie")
          {
            console.log("load Appointment")
            await Appointment.getAppointments().then(res =>{
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
        async cancelAppointment(ids, rootState) {
          let response = await Appointment.cancelAppointment(ids)
          if(response.result == "okie")
          {
            console.log("load Appointment")
            await Appointment.getAppointments().then(res =>{
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
          let response = await Appointment.changeStatus(payload)
          if(response.result == "okie")
          {
            await Appointment.getAppointments().then(res =>{
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
        }
    }
  };