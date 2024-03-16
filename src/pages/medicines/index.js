
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Col, Row, Button, InputGroup, ButtonGroup,Dropdown } from '@themesberg/react-bootstrap';
import { faBell, faCog, faEnvelopeOpen, faSearch, faPlus, faUserShield } from "@fortawesome/free-solid-svg-icons";
import {MedicineTable} from './medicinesTable'
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import Medicine from '../../api/medicine'
import { Config } from '../../config'
import { useDispatch, useSelector } from "react-redux";

export default () => {
  let  navigate  = useNavigate();
  const dispatch = useDispatch()
  const [dataShow, setdataShow]= useState([])
  const [ pageSize, setPageSize] = useState(Config.pageSize);

  const { medicines } = useSelector(state => {
    return {
      medicines:  state.medicine.data,
    }
})

  // load when component did mount
  useEffect(()=>{
    dispatch.medicine.loadData().then(data =>{
      if((data.result=="logout" || data.connection == "expired-token" ))
      {
        dispatch.user.logout()
      }
    })
  },[])
  
  useEffect(()=>{
    setdataShow(medicines);
    console.log("medicines",medicines)
    setTextSearch("")
  },[medicines])

  // xử lý tạo mới dịch vụ khám bệnh
  const createMedicine=()=>{
    navigate(Routes.MedicineCreate.path,{
      state: {
        medicine: {
          id: 0
        }
      }
    })
  }

  // xử lý việc lọc dịch vụ khám bệnh theo tìm kiếm 
  const [ textSearch, setTextSearch]= useState("")
  const filterMedicine = (val) => {
    setTextSearch(val)
    let newDataShow = [...medicines]
    if(val!="")
    {
      setdataShow(newDataShow.filter(item => item.name.toLowerCase().includes(val.trim().toLowerCase())
                                          || item.code.toLowerCase().includes(val.trim().toLowerCase())
                                          || item.origin.toLowerCase().includes(val.trim().toLowerCase())
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
            <Breadcrumb.Item active>Thuốc</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="btn-toolbar mb-4 mb-md-0">
            <Button onClick={createMedicine} variant="primary" className="me-1 btn-sm">
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
                              placeholder="Tên thuốc" 
                              type="text" 
                              onChange={(e)=>filterMedicine(e.target.value)} 
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
      <MedicineTable  data={dataShow} pageSize={pageSize} />
    </div>
    </div>
  );
};
