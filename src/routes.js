export const Routes = {
    // pages
    DashboardOverview: { path: "/dashboard/overview" },
    Signin: { path: "/admin/sign-in" },
    ClientSignin: { path: "/sign-in" },
    Signup: { path: "/sign-up" },
    ForgotPassword: { path: "/forgot-password" },
    Home: { path:"/"},
    NotFound: { path: "/404" },
    ServerError: { path: "/500" },
    StaffsList: {path:"/staffs"},
    StaffCreate: {path:"/staffs/create"},
    StaffEdit: {path:"/staffs/edit/:id"},
    DoctorsList: {path:"/doctors"},
    DoctorCreate: {path:"/doctors/create"},
    DoctorEdit: {path:"/doctors/edit/:id"},
    DoctorDetail: {path:"/doctors/detail/:id"},
    PatientsList: {path:"/patients"},
    PatientCreate: {path:"/patients/create"},
    PatientEdit: {path:"/patients/edit/:id"},
    AppointmentsList: {path:"/appointments"},
    AppointmentCreate: {path:"/appointments/create"},
    AppointmentEdit: {path:"/appointments/edit/:id"},
    AppointmentDetail: {path:"/appointments/detail/:id"},
    ServiceList: {path:"/categories/service"},
    ServiceCreate: {path:"/categories/service/create"},
    ServiceEdit: {path:"/categories/service/:id"},
    MedicineList: {path:"/categories/medicine"},
    MedicineCreate: {path:"/categories/medicine/create"},
    MedicineEdit: {path:"/categories/medicine/:id"},
    HistoryList : {path: "/in-out-histories"},
    HistoryDetail: {path: "/in-out-histories/create"},
    UserGroupList : {path: "/user-groups"},
    UserGroupCreate: {path: "/user-groups/create"},
    UserGroupEdit: {path: "/user-groups/edit/:id"},
    MyAppointment: {path:"/my-appointment"},
    CheckoutList: {path:"/checkouts"},
    CheckoutCreate: {path:"/checkouts/create"},
    CheckoutEdit: {path:"/checkouts/edit/:id"},
    CheckoutDetail: {path:"/checkouts/detail/:id"},
    GuestsList: {path:"/guests"},
    GuestCreate: {path:"/guests/create"},
    GuestEdit: {path:"/guests/edit/:id"},
};