
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Col, Row, Button, InputGroup, ButtonGroup,Dropdown } from '@themesberg/react-bootstrap';
import { faBell, faCog, faEnvelopeOpen, faSearch, faPlus, faUserShield } from "@fortawesome/free-solid-svg-icons";
import {ServicesTable} from './servicesTable'
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import Service from '../../api/service'
import { Config } from '../../config'
import { useDispatch, useSelector } from "react-redux";

export default () => {
  let  navigate  = useNavigate();
  const dispatch = useDispatch()
  const [dataShow, setdataShow]= useState([])
  const [ pageSize, setPageSize] = useState(Config.pageSize);

  const { services } = useSelector(state => {
    return {
      services:  state.service.services.data,
    }
})

  // load when component did mount
  useEffect(()=>{
    dispatch.service.loadData().then(data =>{
      if((data.result=="logout" || data.connection == "expired-token" ))
      {
        dispatch.user.logout()
      }
    })
  },[])
  
  useEffect(()=>{
    setdataShow(services);
    console.log("services",services)
    setTextSearch("")
  },[services])

  // xử lý tạo mới dịch vụ khám bệnh
  const createService=()=>{
    navigate(Routes.ServiceCreate.path,{
      state: {
        service: {
          id: 0
        }
      }
    })
  }

  // xử lý việc lọc dịch vụ khám bệnh theo tìm kiếm 
  const [ textSearch, setTextSearch]= useState("")
  const filterService = (val) => {
    setTextSearch(val)
    let newDataShow = [...services]
    if(val!="")
    {
      setdataShow(newDataShow.filter(item => item.name.toLowerCase().includes(val.trim().toLowerCase())
                                          || item.code.toLowerCase().includes(val.trim().toLowerCase())
                                          || item.description.toLowerCase().includes(val.trim().toLowerCase())
      ))
    }
    else
    {
      setdataShow(newDataShow)
    }
    // cần xử lý lọc dịch vụ khám bệnh theo tên hoặc theo dịch vụ khám bệnh ...
    console.log("Tên...",val)
  }

  // xử lý thay đổi số lượng bản ghi hiển thị
  const setNumberRecordShow=(val)=>{
    setPageSize(val)
    console.log("Số lượng bản ghi hiển thị: ",val)
  }
  
  return (
    <div className="body-app min-vh-100 rounded-3 p-3">
      <div className="bg-gray-200 min-vh-100 rounded-3 p-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item >Quản lý danh mục</Breadcrumb.Item>
            <Breadcrumb.Item active>Dịch vụ khám bệnh</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="btn-toolbar mb-4 mb-md-0">
            <Button onClick={createService} variant="primary" className="me-1 btn-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" />Thêm mới
            </Button>
        </div>
       
      </div>
        <div className="table-settings mb-4">
            <div className="justify-content-between align-items-center row">
                <div className="d-md-flex col-lg-8 col-9">
                    <div className="me-2 me-lg-3 fmxw-300 input-group">
                        <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                        <input 
                              placeholder="Tên dịch vụ" 
                              type="text" 
                              onChange={(e)=>filterService(e.target.value)} 
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
      <ServicesTable data={dataShow} pageSize={pageSize} />
    </div>
    </div>
  );
};
