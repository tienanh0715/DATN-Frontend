import Medicine from '../api/medicine'
import Util from '../utils';
export const medicine = {
    name: "medicine",
    state: {
        data:[],
        dataShow:[],
        total:0,
        overViewWeek:[],
        overViewMonth:[],
        overViewYear:[]

    },
    reducers: {
        setData:(state, payload) => {
          state.data = payload
        },
        setOverViewWeek:(state, payload) => {
          let {overViewWeek,total} =payload
          state.overViewWeek = overViewWeek 
          state.total = total
        },
        setDataShow:(state, payload) => {
          state.dataShow = payload
        },
    },
    effects: {
        async loadData(payload, rootState) {
            const response = await Medicine.getMedicines()
            if(response.result == 'okie')
            {
              console.log("histories-res",response)
              let newData=[...response.data]
              this.setData(newData)
              let num = -7
              let today = new Date()
              let date = Util.dateRight(today.getFullYear(), today.getMonth()+1,today.getDate())
              let time =date.split("/")
              let year =parseInt(time[2])
              let month=parseInt(time[1])
              let day=parseInt(time[0])
              let week =Util.getWeekNumber(year, month, day)
              let from=Util.getFirstDayOfWeek(year, month, day)
              let to=Util.getLastDayOfWeek(year, month, day)
              let array = []
              let startDay = from.split("/")[0]
              for(let start=0; start<7;start++)
              {
                let _date = Util.dateRight(today.getFullYear(), today.getMonth()+1,parseInt(startDay)+start)
                let _time =_date.split("/")
                let _year =parseInt(_time[2])
                let _month=parseInt(_time[1])
                let _day=parseInt(_time[0])
                let _week =Util.getWeekNumber(year, month, day)
                if(_week==week)
                {
                  array.push({id:0,date:_date})
                }
              }
              let _array = array.map(item=>{return{...item,count:0}})
              let count = 0
              let _newDATA = newData.map(element => {
                let time_in_at =new Date(element.time_in_at)
                let year = time_in_at.getFullYear()
                let month  = time_in_at.getMonth()+1
                let day = time_in_at.getDate()
                for(let i=0;i<_array.length;i++)
                {
                  let _time =_array[i].date.split("/")
                  let _year =parseInt(_time[2])
                  let _month=parseInt(_time[1])
                  let _day=parseInt(_time[0])
                  if(year==_year && month==_month && day==_day )
                  {
                    _array[i].count+=1
                    count++
                  }
                }
              });
              this.setOverViewWeek({overViewWeek:_array,total:count})
              console.log(week,from,to,_array,count)

              // let _overView = newData.map(item => {
                
              // });
            }
            else
            {
              this.setData([])
            }
            return true
        },
        async addNew(newUserGroup, rootState) {
          let result = Medicine.addMedicine(newUserGroup)
          if(result) 
          {
            await Medicine.getMedicines().then(data => this.setData(data))
            return true
          }
          else
          {
            return false
          }
        },
        async deleteMedicine(ids, rootState) {
          let response = await Medicine.deleteMedicine(ids)
          if(response.result == "okie")
          {
            console.log("load Service")
            await Medicine.getMedicines().then(res =>{
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
        getHistories() {
        return slice((state) => state.data )
      }
    }),
  };