
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Col, Row, Button, InputGroup, ButtonGroup,Dropdown } from '@themesberg/react-bootstrap';
import { faCog, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import {GuestsTable} from './guestsTable'
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import Guest from '../../api/guest'
import { Config } from '../../config'
import { useDispatch, useSelector } from "react-redux";
export default () => {
  let  navigate  = useNavigate();
  const dispatch = useDispatch()
  const [dataShow, setdataShow]= useState([])
  const [ pageSize, setPageSize] = useState(Config.pageSize);

  const { guests,userLogin } = useSelector(state => {
      return {
          guests:  state.guest.guests.data,
          userLogin: state.user.userLogin
      }
  })

  // load when component did mount
  useEffect(()=>{
    Guest.getGuests().then(data =>{
      if(data.result=="okie")
      {
        dispatch.guest.setData(data.data)
      }
      else
      {
        (data.result=="logout" || data.connection == "expired-token" ) && dispatch.user.logout()
        console.log("err_Guests",data)
      }
    })
  },[])
  useEffect(()=>{
    setdataShow(guests)
    setTextSearch("")
  },[guests])
  // xử lý tạo mới người dùng
  const createGuest=()=>{
    navigate(Routes.GuestCreate.path,{
      state: {
        guest: {
          id: 0
        }
      },
    })
  }

  // xử lý việc lọc người dùng theo tìm kiếm theo tên và email
  const [ textSearch, setTextSearch]= useState("")
  const filterGuest = (val) => {
    setTextSearch(val)
    let newDataShow = [...guests]
    if(val!="")
    {
      setdataShow(newDataShow.filter(item => item.phone.toLowerCase().includes(val.trim().toLowerCase())
                                          || item.full_name?.toLowerCase().includes(val.trim().toLowerCase())

      ))
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
  console.log(dataShow)
  
  return (
    <div className="body-app min-vh-100 rounded-3 p-3">
      <div className="bg-gray-200 min-vh-100 rounded-3 p-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item active>Quản lý khách</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {userLogin.code=="STAFF"?
        <div className="btn-toolbar mb-2 mb-md-0">
            <Button onClick={createGuest} variant="primary" className="me-1 btn-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" />Thêm mới
            </Button>
        </div>
       :<></>}
      </div>
        <div className="table-settings mb-4">
            <div className="justify-content-between align-items-center row">
                <div className="d-md-flex col-lg-8 col-9">
                    <div className="me-2 me-lg-3 fmxw-300 input-group">
                        <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                        <input 
                              placeholder="Tên khách, số điện thoại" 
                              type="text" 
                              onChange={(e)=>filterGuest(e.target.value)} 
                              className="form-control" 
                              value={textSearch}/>
                    </div>
                </div>
                <div className="d-flex justify-content-end col-lg-4 col-3">
                    <Dropdown >
                        <Dropdown.Toggle variant="link" >
                            <FontAwesomeIcon icon={faCog}  />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dashboard-dropdown dropdown-menu-md dropdown-menu-end">
                            <Dropdown.Item onClick={{}}>Hiển thị</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setNumberRecordShow(10)} className="fw-bold">10</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setNumberRecordShow(20)} className="fw-bold">20</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setNumberRecordShow(30)} className="fw-bold">30</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> 
                </div>
            </div>
        </div>
      <GuestsTable data={dataShow} pageSize={pageSize} />
      </div>
    </div>
  );
};
