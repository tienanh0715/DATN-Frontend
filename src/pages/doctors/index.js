
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Col, Row, Button, InputGroup, ButtonGroup,Dropdown } from '@themesberg/react-bootstrap';
import { faCog, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import {DoctorTable} from './doctorsTable'
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import Doctor from '../../api/doctor'
import { Config } from '../../config'
import { useDispatch, useSelector } from "react-redux";
export default () => {
  let  navigate  = useNavigate();
  const dispatch = useDispatch()
  const [dataShow, setdataShow]= useState([])
  const [ pageSize, setPageSize] = useState(Config.pageSize);

  const { doctors } = useSelector(state => {
      return {
          doctors:  state.doctor.doctors.data,
      }
  })

  // load when component did mount
  useEffect(()=>{
    Doctor.getDoctors().then(data =>{
      if(data.result=="okie")
      {
        dispatch.doctor.setData(data.data)
      }
      else
      {
        console.log("err_Doctors",data)
      }
    })
  },[])
  useEffect(()=>{
    setdataShow(doctors)
    setTextSearch("")
  },[doctors])
  // xử lý tạo mới bác sĩ
  const createDoctor=()=>{
    navigate(Routes.DoctorCreate.path,{
      state: {
        doctor: {
          id: 0
        }
      },
    })
  }

  // xử lý việc lọc bác sĩ theo tìm kiếm theo tên 
  const [ textSearch, setTextSearch]= useState("")
  const filterDoctor = (val) => {
    setTextSearch(val)
    let newDataShow = [...doctors]
    if(val!="")
    {
      setdataShow(newDataShow.filter(item => item.email.toLowerCase().includes(val.trim().toLowerCase())
                                          || item.full_name?.toLowerCase().includes(val.trim().toLowerCase())
      ))
    }
    else
    {
      setdataShow(newDataShow)
    }
    // cần xử lý lọc bác sĩ theo tên 
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
            <Breadcrumb.Item active>Quản lý bác sĩ</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
            <Button onClick={createDoctor} variant="primary" className="me-1 btn-sm">
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
                              placeholder="Tên bác sĩ, email" 
                              type="text" 
                              onChange={(e)=>filterDoctor(e.target.value)} 
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
      <DoctorTable data={dataShow} pageSize={pageSize} />
      </div>
    </div>
  );
};
