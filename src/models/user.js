import User from '../api/user'
import localStorage from 'redux-persist/es/storage';
import localStore from '../utils/localStorage'

export const user = {
    name: "user",
    state: {
        isLogin:false,
        userLogin:User.getDefault(),
        users:{
            data:[],
            dataShow:[],
        }
    },
    reducers: {
        updateUserLogin: (state, payload) => {
            state.isLogin = true
            state.userLogin = payload
        },
        logoutUser:(state, payload) => {
            state.isLogin = false
            state.userLogin = payload
        },
        setData:(state, payload) => {
          state.users.data = payload
        },
        setDataShow:(state, payload) => {
          state.users.dataShow = payload
        },
    },
    effects: {
        async login(payload, rootState) {
            const { usr, pw } = payload
            const result = await User.login(usr,pw)
            if(result.result == 'okie')
            {
                console.log("login-res",result)
                await localStorage.setItem('accessToken', result.tokens.accessToken)
                await localStorage.setItem('refreshToken', result.tokens.refreshToken)
                this.updateUserLogin(result.user) // dispatch action to a local
                return result
            }
            else
            {
              this.updateUserLogin(User.getDefault())
              return result
            }
            
        },
        async register(payload, rootState) {
          console.log("payload",payload)
          const result = await User.register(payload)
          if(result.result == 'okie')
          {
              console.log("register-res",result)
              return result
          }
          else
          {
            return result
          }
        },
        async logout(payload, rootState) {
            // await User.logout(user.id)
            await localStore.set('accessToken', "not-set")
            await localStore.set('refreshToken', "not-set")
            await this.logoutUser(User.getDefault()) // dispatch action to a local reducer
            return true
        },
        async loadData(search='', rootState) {
            const response = await User.getUsers().then(data => {
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
        async addNew(newUser, rootState) {
          let response = await User.addUser(newUser)
          if(response.result=="okie")
          {
            return true
          }
          else
          {
            return false
          }
        },
        async edit(editUser, rootState) {
          let response = await User.editUser(editUser)
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
        async deleteUser(ids, rootState) {
          let response = await User.deleteUser(ids)
          if(response.result == "okie")
          {
            console.log("load User")
            await User.getUsers().then(res =>{
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
          let response = await User.changeStatus(payload)
          if(response.result == "okie")
          {
            await User.getUsers().then(res =>{
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
      getUser() {
        return slice((state) => state.userLogin )
      },
      getUsers() {
        return slice((state) => state.users )
      }
    }),
  };