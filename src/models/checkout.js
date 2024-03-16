import Checkout from '../api/checkout'
import localStorage from 'redux-persist/es/storage';
import localStore from '../utils/localStorage'
import Appointment from '../api/appointment';

export const checkout = {
    name: "checkout",
    state: {
        isBooking:false,
        isLogin:false,
        checkoutLogin:Checkout.getDefault(),
        checkouts:{
            data:[],
            dataShow:[],
        },
    },
    reducers: {
        setData:(state, payload) => {
          state.checkouts.data = payload
        },
        setDataShow:(state, payload) => {
          state.checkouts.dataShow = payload
        },
        showBooking: (state,payload) => {
          // console.log("showBoooking",payload)
          state.isBooking = payload
        }
    },
    effects: {
        async loadData(search='', rootState) {
            const response = await Checkout.getCheckouts().then(data => {
               // todo handle response
              let newData=data
              if( search !== '')
              {
                  newData= newData.filter( e => e.name.includes(search) || e.checkoutname.includes(search))
              }
              this.setData(newData)
            })
            return true
        },
        async addNew(newCheckout, rootState) {
          let response = await Checkout.addCheckout(newCheckout)
          if(response.result=="okie")
          {
            return true
          }
          else
          {
            return false
          }
        },
        async edit(editCheckout, rootState) {
          let response = await Appointment.editAppointment(editCheckout)
          if(response.result=="okie")
          {
            console.log("load Checkout")
            await Checkout.getCheckouts().then(res =>{
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
        async deleteCheckout(data, rootState) {
          let response = await Checkout.editCheckout(data)
          if(response.result == "okie")
          {
            console.log("load Checkout")
            await Checkout.getCheckouts().then(res =>{
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
        async cancelCheckout(ids, rootState) {
          let response = await Checkout.cancelCheckout(ids)
          if(response.result == "okie")
          {
            console.log("load Checkout")
            await Checkout.getCheckouts().then(res =>{
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
          let response = await Checkout.changeStatus(payload)
          if(response.result == "okie")
          {
            await Checkout.getCheckouts().then(res =>{
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