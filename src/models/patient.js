import Patient from '../api/patient'
export const patient = {
    name: "patient",
    state: {
        patients:{
            data:[],
            dataShow:[],
        }
    },
    reducers: {
        updatePatient: (state, payload) => {
            state.patients.data = payload
        },
        setData:(state, payload) => {
          state.patients.data = payload
        },
        setDataShow:(state, payload) => {
          state.patients.dataShow = payload
        },
    },
    effects: {
        async loadData(payload, rootState) {
            const response = await Patient.getPatients()
            if(response.result == 'okie')
            {
                console.log("patients-res",response)
                this.updatePatient(response.data) // dispatch action to a local 
            }
            else
            {
              this.updatePatient([])
            }
            return response;
        },
        async deletePatient(ids, rootState) {
            let response = await Patient.deletePatient(ids)
            if(response.result == "okie")
            {
              console.log("load Patient")
              await Patient.getPatients().then(res =>{
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
    }
  };