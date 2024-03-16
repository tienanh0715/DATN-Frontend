import Guest from '../api/guest'
import localStorage from 'redux-persist/es/storage';
import localStore from '../utils/localStorage'

export const guest = {
    name: "guest",
    state: {
        isLogin:false,
        guests:{
            data:[],
            dataShow:[],
        }
    },
    reducers: {
        setData:(state, payload) => {
          state.guests.data = payload
        },
        setDataShow:(state, payload) => {
          state.guests.dataShow = payload
        },
    },
    effects: {
        async loadData(search='', rootState) {
            const response = await Guest.getGuests().then(data => {
               // todo handle response
              let newData=data
              if( search !== '')
              {
                  newData= newData.filter( e => e.name.includes(search) || e.username.includes(search))
              }
              this.setData(newData)
            })
            return true
        },
        async addNew(newGuest, rootState) {
          let response = await Guest.addGuest(newGuest)
          if(response.result=="okie")
          {
            return true
          }
          else
          {
            return false
          }
        },
        async edit(editGuest, rootState) {
          let response = await Guest.editGuest(editGuest)
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
        async deleteGuest(ids, rootState) {
          let response = await Guest.deleteGuest(ids)
          if(response.result == "okie")
          {
            console.log("load Guest")
            await Guest.getGuests().then(res =>{
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
        
    },
    selectors: (slice, createSelector, hasProps) => ({
      getGuest() {
        return slice((state) => state.userLogin )
      },
      getGuests() {
        return slice((state) => state.Guests )
      }
    }),
  };