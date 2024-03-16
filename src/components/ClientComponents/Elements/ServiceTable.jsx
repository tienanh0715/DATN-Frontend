import React from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
// Assets
import RollerIcon from "../../../assets/svg/Services/RollerIcon";
import MonitorIcon from "../../../assets/svg/Services/MonitorIcon";
import BrowserIcon from "../../../assets/svg/Services/BrowserIcon";
import PrinterIcon from "../../../assets/svg/Services/PrinterIcon";
import CheckMark from "../../../assets/svg/Checkmark";
import { Routes } from "../../../routes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink} from 'react-router-dom';

export default function ServiceTable({ service_id, icon, price, title, text,  offers, action }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLogin, userLogin} = useSelector(state => {
    return {
      isLogin:  state.user.isLogin,
      userLogin:  state.user.userLogin,
    }
  })
  const checkBooking= (server_id) =>{
    if(isLogin)
    {
      dispatch.appointment.showBookingFromService({isBooking: true, serviceId: service_id})
    }
    else
    {
      navigate(Routes.ClientSignin.path)
    }
  }
  return (
    <Wrapper className="whiteBg radius8 shadow">
      <div className="d-flex justify-content-between align-item-center">
        <img className="radius8" style={{width:"100px",height:"100px",borderRadius:"20px"}} src={icon} alt="service"></img>
        <p className="font18 extraBold">{price}</p>
      </div>
      <div style={{ margin: "30px 0" }}>
        <h4 className="font18 extraBold">{title}</h4>
        <p className="font13">{text}</p>
      </div>
      <div>
      </div>
      <div style={{ maxWidth: "180px", margin: "30px auto 0 auto",position:"absolute", bottom:"10px",left:"36%"  }}>
      {(!isLogin || userLogin.code =="PATIENT")?<FullButton title="Đặt lịch khám" action={()=>checkBooking(service_id)} />:<></>}

      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  padding: 20px 30px;
  margin-top: 30px;
  position:relative;
  min-height:300px;
`;

const Image = styled.img`
  width: 100%;
  text-align: left;
  padding: 20px 30px;
  margin-top: 30px;
`;