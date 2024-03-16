import React, { useState, useEffect } from 'react';
import { Routes } from "../routes";

import {
  Routes as Switch,
  Route
} from "react-router-dom"
// pages
import DashboardOverview from "./dashboard/DashboardOverview";
import Signin from "./authentication/Signin";
import ClientLogin from "./authentication/ClientSignin";

import Signup from "./authentication/Signup";
import ForgotPassword from "./authentication/ForgotPassword";

import NotFoundPage from "./authentication/NotFound";
import ServerError from "./authentication/ServerError";
import StaffsList from './staffs';
import StaffDetail from './staffs/staffDetail';
import GuestsList from './guests';
import GuestDetail from './guests/guestDetail';
import ServiceList from './services'
import ServiceDetail from './services/serviceDetail'
import MedicineList from './medicines'
import MedicineDetail from './medicines/medicineDetail';
import DoctorsList from './doctors'
import DoctorDetail from './doctors/doctorDetail'
import DoctorEdit from './doctors/doctorEdit';
import PatientsList from './patients'
import PatientDetail from './patients/patientDetail'
import  { RequireAuth }  from './authentication'
import AppointmentDetail from './appointments/appointmentDetail';
import AppointmentEdit from './appointments/appointmentEdit';
import AppointmentsList from './appointments';
import CheckoutList from './checkouts'

import Landing from './client/screens/Landing';
import TopNavbar from '../components/ClientComponents/Nav/TopNavbar';
import AppointmentClient from './client/screens/appointments';
// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import Booking from "./client/screens/Booking";

import { useSelector } from 'react-redux'

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <> <Preloader show={loaded ? false : true} /> <Component {...rest}/> </>
  );
};

const RouteWithSidebar = ({ component: Component,...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />
        <div className="content d-flex flex-column" style={{minHeight: "100vh"}}>
          <Navbar/>
          <Component {...rest}/>
          {/* <Footer /> */}
        </div>
      </>
  );
};

const RouteWithHeader = ({ component: Component,...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
      <>
        <Preloader show={loaded ? false : true} />
        <Booking/>
        <TopNavbar />
        <Component {...rest}/>
      </>
  );
};

export default () => {
  const { userLogin} = useSelector(state => {
    return {
      userLogin: state.user.userLogin
    }
  })
  return (
  <>
      <div>
                  <Switch>
                        {/* Developement */}
                        <Route exact path="/" element={<RouteWithHeader component={Landing} />}/>
                        <Route exact path={Routes.MyAppointment.path} element={<RouteWithHeader component={AppointmentClient} />}/>


                        <Route path={Routes.Signin.path} element={<RouteWithLoader component={Signin} />} />
                        <Route path={Routes.ClientSignin.path} element={<RouteWithLoader component={ClientLogin} />} />

                        <Route path={Routes.Signup.path} element={<RouteWithLoader component={Signup} />} />
                        <Route
                          exact 
                          path={Routes.StaffsList.path} 
                          element={<RequireAuth><RouteWithSidebar component={StaffsList}/></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.StaffCreate.path} 
                          element={<RequireAuth><RouteWithSidebar component={StaffDetail} /></RequireAuth>}
                        />
                        <Route
                          exact 
                          path={Routes.StaffEdit.path} 
                          element={<RequireAuth><RouteWithSidebar component={StaffDetail} /></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.GuestsList.path} 
                          element={<RequireAuth><RouteWithSidebar component={GuestsList}/></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.GuestCreate.path} 
                          element={<RequireAuth><RouteWithSidebar component={GuestDetail} /></RequireAuth>}
                        />
                        <Route
                          exact 
                          path={Routes.GuestEdit.path} 
                          element={<RequireAuth><RouteWithSidebar component={GuestDetail} /></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.ServiceList.path} 
                          element={<RequireAuth><RouteWithSidebar component={ServiceList}/></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.ServiceCreate.path} 
                          element={<RequireAuth><RouteWithSidebar component={ServiceDetail} /></RequireAuth>}
                        />
                        <Route
                          exact 
                          path={Routes.ServiceEdit.path} 
                          element={<RequireAuth><RouteWithSidebar component={ServiceDetail} /></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.MedicineList.path} 
                          element={<RequireAuth><RouteWithSidebar component={MedicineList}/></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.MedicineCreate.path} 
                          element={<RouteWithSidebar component={MedicineDetail} />}
                        />
                        <Route
                          exact 
                          path={Routes.MedicineEdit.path} 
                          element={<RequireAuth><RouteWithSidebar component={MedicineDetail} /></RequireAuth>}
                        />
                        
                        <Route
                          exact 
                          path={Routes.DoctorsList.path} 
                          element={<RequireAuth><RouteWithSidebar component={DoctorsList}/></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.DoctorCreate.path} 
                          element={<RouteWithSidebar component={DoctorDetail} />}
                        />
                        <Route
                          exact 
                          path={Routes.DoctorDetail.path} 
                          element={<RequireAuth><RouteWithSidebar component={DoctorDetail} /></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.DoctorEdit.path} 
                          element={<RequireAuth><RouteWithSidebar component={DoctorEdit} /></RequireAuth>}
                        />


                        <Route
                          exact 
                          path={Routes.PatientsList.path} 
                          element={<RequireAuth><RouteWithSidebar component={PatientsList}/></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.PatientCreate.path} 
                          element={<RouteWithSidebar component={PatientDetail} />}
                        />
                        <Route
                          exact 
                          path={Routes.PatientEdit.path} 
                          element={<RequireAuth><RouteWithSidebar component={PatientDetail} /></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.AppointmentsList.path} 
                          element={<RequireAuth><RouteWithSidebar component={AppointmentsList}/></RequireAuth>}
                        />

                        <Route
                          exact 
                          path={Routes.AppointmentCreate.path} 
                          element={<RouteWithSidebar component={AppointmentDetail} />}
                        />
                        <Route
                          exact 
                          path={Routes.AppointmentEdit.path} 
                          element={<RequireAuth><RouteWithSidebar component={AppointmentEdit} /></RequireAuth>}
                        />  
                        <Route
                          exact 
                          path={Routes.AppointmentDetail.path} 
                          element={<RequireAuth><RouteWithSidebar component={AppointmentDetail} /></RequireAuth>}
                        /> 

                        <Route
                          exact
                          path={Routes.CheckoutList.path}
                          element={<RequireAuth><RouteWithSidebar component={CheckoutList} /></RequireAuth>}
                        />
                        
                        <Route path={Routes.ForgotPassword.path} element={<RouteWithLoader component={ForgotPassword} />} />

                        <Route 
                          exact 
                          path={Routes.DashboardOverview.path} 
                          element={<RequireAuth><RouteWithSidebar component={DashboardOverview} /></RequireAuth>}
                        />

                        <Route exact path={Routes.ServerError.path} element={<RouteWithLoader component={ServerError} />}/>
                        <Route exact path="*" element={<RouteWithLoader component={NotFoundPage} />}/>

                        
                  </Switch>
           
      </div>
  </>
)};
