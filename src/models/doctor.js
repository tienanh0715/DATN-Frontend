import Doctor from '../api/doctor'
import localStorage from 'redux-persist/es/storage';
import localStore from '../utils/localStorage'

export const doctor = {
    name: "doctor",
    state: {
        isLogin:false,
        doctorLogin:Doctor.getDefault(),
        doctors:{
            data:[],
            dataShow:[],
        }
    },
    reducers: {
        setData:(state, payload) => {
          state.doctors.data = payload
        },
        setDataShow:(state, payload) => {
          state.doctors.dataShow = payload
        },
    },
    effects: {
        async loadData(search='', rootState) {
            const response = await Doctor.getDoctors().then(data => {
               // todo handle response
              console.log("load",data)
              let newData=data.data
              if( search !== '')
              {
                  newData= newData.filter( e => e.full_name.includes(search) )
              }
              this.setData(newData)
            })
            return true
        },
        async addNew(newDoctor, rootState) {
          let response = await Doctor.addDoctor(newDoctor)
          if(response.result=="okie")
          {
            return true
          }
          else
          {
            return false
          }
        },
        async edit(editDoctor, rootState) {
          let response = await Doctor.editDoctor(editDoctor)
          if(response.result=="okie")
          {
            return true
          }
          else
          {
            console.log("error",response.message)
            return false
          }
        },
        async deleteDoctor(ids, rootState) {
          let response = await Doctor.deleteDoctor(ids)
          if(response.result == "okie")
          {
            console.log("load Doctor")
            await Doctor.getDoctors().then(res =>{
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
          let response = await Doctor.changeStatus(payload)
          if(response.result == "okie")
          {
            await Doctor.getDoctors().then(res =>{
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
    },
    selectors: (slice, createSelector, hasProps) => ({
      getDoctor() {
        return slice((state) => state.doctorLogin )
      },
      getDoctors() {
        return slice((state) => state.doctors )
      }
    }),
  };