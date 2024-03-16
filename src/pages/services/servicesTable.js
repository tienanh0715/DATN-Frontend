
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEllipsisH, faEye} from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Dropdown,Modal,Button,Alert, Form } from '@themesberg/react-bootstrap';
import { Panigation } from "../../components/Panigation";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Service  from "../../api/service"
import APIs from "../../api/APIs"
import { Routes } from '../../routes'
import Util from "../../utils";

export const ServicesTable = (props) => {
   const { data, pageSize } = props
    const TableRow = (props) => {
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const { handleVisible, setSaveSuccess, setMessageAlert} = props
      const { id, code, charge, description, image, name, status , index} = props 
      // console.log("service-item",props)
      const editService=(id)=>{
        navigate(Routes.ServiceEdit.path.replace(":id",id),{state: {service: {id:id}}})
      }

    const deleteService = async (service_id)=>{
        let ids = []
        ids.push({id:service_id})
        // console.log("ids",ids)
        let _response = await dispatch.service.deleteService(ids)
        if(_response.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Xóa thành công!")
        }
        else
        {
            setMessageAlert("Xóa thất bại! Lý do: " + _response.message)
        }
        handleVisible()
        }
        const [showNotification, setShowNotification] = useState(false);
        const handleClose = () => setShowNotification(false);
       
        
      return (
        <>
        <Modal centered show={showNotification} className="modal-secondary" onHide={handleClose}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleClose} />
            </Modal.Header>
            <Modal.Body>
            <div className="text-center">
                <Modal.Title className="h4 my-3">Thông báo xác nhận!</Modal.Title>
                <p>Bạn có thực sự muốn xóa dịch vụ này ?</p>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>deleteService(id)}>Xác nhận</Button>
            <Button variant="white" size="sm" onClick={handleClose}>Thoát</Button>
            </Modal.Footer>
        </Modal>
        
        <tr className="border-bottom h-auto">
              <td>
                  <a className="d-flex align-items-center card-link">
                      <div className="d-block">
                          <span className="fw-bold">{index+1}</span>
                      </div>
                  </a>
              </td>
              <td><span className={"fw-normal"}>{name}</span></td>
              <td><span className={"fw-normal"}>{Util.formatNumber(charge)}</span></td>
              <td><span className={"fw-normal"}>{status==1?"Hoạt động":"Tạm dừng hoạt động"}</span></td>
              <td>
                <img src={image} className="user-avatar md-avatar rounded-circle me-3"/>
              </td>
              <td>
                  <div className="d-flex btn-group ">
                      <Dropdown >
                          <Dropdown.Toggle variant="link" size='sm'className="me-2 p-2">
                              <FontAwesomeIcon icon={faEllipsisH}  />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-center">
                              <Dropdown.Item className="fw-bold" onClick={() => editService(id)}>
                                <FontAwesomeIcon icon={faEdit} className="me-2"/>
                                    Chỉnh sửa
                              </Dropdown.Item>
                              <Dropdown.Item className="fw-bold">
                              <a className="mt-2" onClick={()=>setShowNotification(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="icon icon-xs text-danger"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                   <p className="ms-2 d-inline">Xóa</p> 
                                </a>
                              </Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown> 
                  </div>
              </td>
          </tr>
          </>
      );
    };
   

    const [dataShow, setdataShow]= useState([])

    // panigation
    const onChangePage = (pageOfItems) => {
        // update state with new page of items
        //console.log('pageOfItems',pageOfItems)
        setdataShow( pageOfItems )
    }

    const [visibleAlert, setVisibleAlert] = useState(false)
    const handleVisible = () => {  
        setVisibleAlert(true)
        setTimeout(() => {
            setVisibleAlert(false)
        }, 2000);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    } 
    const [ saveSuccess, setSaveSuccess] = useState(false)
    const [ messageAlert, setMessageAlert] = useState("")
    console.log("services",dataShow)
    return (
      <Card border="light" className="shadow-sm mb-4 ">
        <Card.Body className="pb-0 min-vh-100">
        {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"} className="ms-0 my-2">
                        {messageAlert}
                    </Alert>
                :<></>
                }

          <Table responsive className="user-table align-items-center table table-hover ">
            <thead className="thead-light">
                <tr>
                    <th className="border-bottom">STT</th>
                    <th className="border-bottom">Tên dịch vụ</th>
                    <th className="border-bottom">Giá dịch vụ (VNĐ)</th>
                    <th className="border-bottom">Trạng thái</th>
                    <th className="border-bottom">Hình ảnh</th>

                    <th className="border-bottom">Thao tác</th>
                </tr>
            </thead>
            <tbody className="border-0 ">
              {dataShow.length>0 && dataShow.map((service,index) => <TableRow key={`service-${service.id}`} index={index} {...service} handleVisible={handleVisible} setSaveSuccess={setSaveSuccess} setMessageAlert={setMessageAlert}/>)}
            </tbody>
          </Table>
          <Panigation pageSize={pageSize} items={data} onChangePage={onChangePage}/>
        </Card.Body>
      </Card>
    );
  };