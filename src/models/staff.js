import Staff from '../api/staff'
import localStorage from 'redux-persist/es/storage';
import localStore from '../utils/localStorage'

export const staff = {
    name: "staff",
    state: {
        isLogin:false,
        userLogin:Staff.getDefault(),
        staffs:{
            data:[],
            dataShow:[],
        }
    },
    reducers: {
        updateStaffLogin: (state, payload) => {
            state.isLogin = true
            state.userLogin = payload
        },
        logoutStaff:(state, payload) => {
            state.isLogin = false
            state.userLogin = payload
        },
        setData:(state, payload) => {
          state.staffs.data = payload
        },
        setDataShow:(state, payload) => {
          state.staffs.dataShow = payload
        },
    },
    effects: {
        async login(payload, rootState) {
            const { usr, pw } = payload
            const result = await Staff.login(usr,pw)
            if(result.result == 'okie')
            {
                console.log("login-res",result)
                await localStorage.setItem('accessToken', result.tokens.accessToken)
                await localStorage.setItem('refreshToken', result.tokens.refreshToken)
                this.updateStaffLogin(result.staff) // dispatch action to a local
                return result
            }
            else
            {
              this.updateStaffLogin(Staff.getDefault())
              return result
            }
            
        },
        async logout(payload, rootState) {
            // await Staff.logout(staff.id)
            await localStore.set('accessToken', "not-set")
            await localStore.set('refreshToken', "not-set")
            await this.logoutStaff(Staff.getDefault()) // dispatch action to a local reducer
            return true
        },
        async loadData(search='', rootState) {
            const response = await Staff.getStaffs().then(data => {
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
        async addNew(newStaff, rootState) {
          let response = await Staff.addStaff(newStaff)
          if(response.result=="okie")
          {
            return true
          }
          else
          {
            return false
          }
        },
        async edit(editStaff, rootState) {
          let response = await Staff.editStaff(editStaff)
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
        async deleteStaff(ids, rootState) {
          let response = await Staff.deleteStaff(ids)
          if(response.result == "okie")
          {
            console.log("load Staff")
            await Staff.getStaffs().then(res =>{
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
      getStaff() {
        return slice((state) => state.userLogin )
      },
      getStaffs() {
        return slice((state) => state.Staffs )
      }
    }),
  };