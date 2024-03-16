// export const Server = "http://localhost:3001/"
// export const AuthServer = "http://localhost:5001/"
export const Server = "http://phongkhamngoisao.io.vn/api/"
export const AuthServer = "http://phongkhamngoisao.io.vn/api/auth/"

const APIs = {
    file: Server + "public/uploads/",
    hello: Server + "hello/",
    user: { 
        login: AuthServer + "login/",
        logout: AuthServer + "logout/", 
        list: Server + "users",
        updateStatus: Server + "users/update-status",
        changePW: Server + "users/change-pw",
        changeInfo: Server +"users/update-info/"
        // 
    },
    guest:{
        list: Server + "guests",
        register: Server + "guests/register",
    },
    staff:{
        list: Server + "staffs",
    },
    review:{
        list: Server + "reviews",
        findByAppointment: Server + "reviews/appointment/",
        findByDoctor: Server + "reviews/doctor/",
        date: Server + "reviews/date",
        reExamine: Server + "reviews/re-examine",
    },
    appointment:{
        list: Server + "appointments",
        findByDoctor: Server + "appointments/doctor",
        date: Server + "appointments/date",
        reExamine: Server + "appointments/re-examine",
    },
    checkout:{
        list: Server + "checkouts",
        findByDoctor: Server + "checkouts/doctor",
        date: Server + "checkouts/date",
        reExamine: Server + "checkouts/re-examine",
    },
    doctor:{
        list: Server + "doctors",
        schedule: Server + "doctors/schedules"
    },
    patient:{
        list: Server + "patients",
    },
    medicine: {
        list: Server + "medicines",
        date: Server + "medicines/date",
    },
    service: {
        list: Server + "services",
    },
    token: {
        refresh: AuthServer + "refresh-token/"
    },
    report: {
        account: Server +"report/accounts",
        patient: Server + "report/patients",
        income: Server + "report/income",
        appointment: Server + "report/appointments",
        allDoctor: Server + "report/allDoctor",
        allPatient: Server + "report/allPatient"

    }
    
};
    
export default APIs;