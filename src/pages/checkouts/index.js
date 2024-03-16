
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Col, Row, Button, InputGroup, ButtonGroup,Dropdown,Form,Alert } from '@themesberg/react-bootstrap';
import { faCog, faPlus, faSearch,faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {CheckoutTable} from './checkoutsTable'
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import Checkout from '../../api/checkout'
import { Config } from '../../config'
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import Datetime from "react-datetime";
import Util from "../../utils";

export default () => {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  let  navigate  = useNavigate();
  const dispatch = useDispatch()
  const [dataShow, setdataShow]= useState([])
  const [ pageSize, setPageSize] = useState(Config.pageSize);

  const { checkouts,userLogin } = useSelector(state => {
      return {
          checkouts:  state.checkout.checkouts.data,
          userLogin:state.user.userLogin
      }
  })

  // load when component did mount
  useEffect(()=>{
    Checkout.getCheckouts().then(data =>{
      if(data.result=="okie")
      {
        dispatch.checkout.setData(data.data)
      }
      else
      {
        console.log("err_Checkouts",data)
      }
    })
  },[])
  useEffect(()=>{
    setdataShow(checkouts)
    setTextSearch("")
  },[checkouts])
  // xử lý tạo mới người dùng
  const createCheckout=()=>{
    navigate(Routes.CheckoutCreate.path,{
      state: {
        checkout: {
          id: 0
        }
      },
    })
  }

  // xử lý việc lọc người dùng theo tìm kiếm theo tên và email
  const [ textSearch, setTextSearch]= useState("")
  const filterCheckout = (val) => {
    setTextSearch(val)
    let newDataShow = [...checkouts]
    if(val!="")
    {
      if(userLogin.code=="ADMIN")
      {
        setdataShow(newDataShow.filter(item => item.doctor_email.toLowerCase().includes(val.trim().toLowerCase()) || 
          item.doctor_fullName?.toLowerCase().includes(val.trim().toLowerCase()) || 
          item.patient_fullName?.toLowerCase().includes(val.trim().toLowerCase())|| 
          item.patient_email?.toLowerCase().includes(val.trim().toLowerCase()) ||
          item.payment_user_name?.toLowerCase().includes(val.trim().toLowerCase()) ||
          item.payment_user_email?.toLowerCase().includes(val.trim().toLowerCase()))
        )
      } 
      else
      {
        setdataShow(newDataShow.filter(item =>  
          item.patient_fullName?.toLowerCase().includes(val.trim().toLowerCase())|| 
          item.patient_email?.toLowerCase().includes(val.trim().toLowerCase()) || 
          item.doctor_fullName?.toLowerCase().includes(val.trim().toLowerCase())|| 
          item.doctor_email?.toLowerCase().includes(val.trim().toLowerCase())))
      }      
    }
    else
    {
      setdataShow(newDataShow)
    }
    // cần xử lý lọc người dùng theo tên hoặc theo phòng ...
    console.log("Tên...",val)
  }

  // xử lý thay đổi số lượng bản ghi hiển thị
  const setNumberRecordShow=(val)=>{
    setPageSize(val)
    console.log("Số lượng bản ghi hiển thị: ",val)
  }
  // xử lý lọc theo thời gian
  const searchByDate = async ()=>{
    let _from = from==""? 'no-date' : moment(from).format("YYYY-MM-DD")
    let _to = to==""? 'no-date' : moment(to).format("YYYY-MM-DD")
    if(_from!='no-date'&&_to!='no-date')
    {
      if (_from <= _to)
      {
        // date is past
        console.log("pass")
        Checkout.getCheckoutByDate(_from,_to).then(data =>{
          if(data.result=="okie")
          {
            dispatch.checkout.setData(data.data)
          }
          else
          {
            console.log("err_Histories",data)
          }
        })
      } 
      else 
      {
          // date is future
          console.log("fail")
          setMessageAlert("Ngày thứ 2 phải lớn hơn ngày thứ nhất")
          handleVisible()
      }
    }
    else
    {
      Checkout.getCheckoutByDate(_from,_to).then(data =>{
        if(data.result=="okie")
        {
          dispatch.checkout.setData(data.data)
        }
        else
        {
          console.log("err_Checkouts",data)
        }
      })
    }
    
  }
  const clear= ()=>{
    setFrom("")
    setTo("")
    setTextSearch("")
    Checkout.getCheckouts().then(data =>{
      if(data.result=="okie")
      {
        dispatch.checkout.setData(data.data)
      }
      else
      {
        console.log("err_Checkouts",data)
      }
    })
  }
  const [visibleAlert, setVisibleAlert] = useState(false)
  const handleVisible = () => {  
      setVisibleAlert(true)
      setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" })
          setVisibleAlert(false)
      }, 2000);
  } 
  const [ saveSuccess, setSaveSuccess] = useState(false)
  const [ messageAlert, setMessageAlert] = useState("")
  
  return (
    <div className="body-app min-vh-100 rounded-3 p-3">
      <div className="bg-gray-200 min-vh-100 rounded-3 p-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item active>Quản lý thanh toán</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
        <div className="table-settings mb-4">
            <div className="justify-content-between align-items-center row">
                <div className="d-md-flex col-lg-12 col-12">
                    <div className="me-2 me-lg-3 fmxw-300 input-group">
                        <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                        <input 
                              placeholder={userLogin.code=="STAFF"? "Bác sĩ, bệnh nhân":(userLogin.code=="ADMIN"?"Bác sĩ, bệnh nhân, nhân viên":"")} 
                              type="text" 
                              onChange={(e)=>filterCheckout(e.target.value)} 
                              className="form-control" 
                              value={textSearch}/>
                    </div>
                    <Button variant="outline" disabled>Từ</Button>
                    <Datetime
                          timeFormat={false}
                          closeOnSelect={false}
                          onChange={setFrom}
                          renderInput={(props, openCalendar) => (
                            <InputGroup>
                              <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                              <Form.Control
                                required
                                type="text"
                                value={from ? moment(from).format("DD/MM/YYYY") : ""}
                                placeholder="dd/mm/yyyy"
                                onFocus={openCalendar}
                                onChange={() => { }} />
                            </InputGroup>
                          )} />
                    <Button variant="outline" disabled>đến</Button>
                    <Datetime
                          className="me-2"
                          timeFormat={false}
                          closeOnSelect={false}
                          onChange={setTo}
                          renderInput={(props, openCalendar) => (
                            <InputGroup>
                              <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                              <Form.Control
                                required
                                type="text"
                                value={to ? moment(to).format("DD/MM/YYYY") : ""}
                                placeholder="dd/mm/yyyy"
                                onFocus={openCalendar}
                                onChange={() => { }} />
                            </InputGroup>
                          )} />
                   <Button className="me-1" variant="secondary" onClick={()=>searchByDate()}>Tìm kiếm</Button>
                    <Button variant="light" onClick={()=>clear()}>Bỏ tìm kiếm</Button>
                    {visibleAlert?
                        <Alert variant={saveSuccess?"success":"danger"} className="ms-3 my-0">
                            {messageAlert}
                        </Alert>
                    :<></>
                    }
                </div>
            </div>
        </div>
      <CheckoutTable data={dataShow.filter(item => 
      {
        if(userLogin.code=="STAFF" && ( item.payment_user_id != userLogin.id && !Util.isEmpty(item.payment_user_id) ))
        {
          return false;
        }
        return true;
      }
      )} pageSize={pageSize} />
      </div>
    </div>
  );
};
