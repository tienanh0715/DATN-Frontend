
import moment from "moment-timezone";
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH,  faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Dropdown,Alert, Modal,Button, Form } from '@themesberg/react-bootstrap';
import { Panigation } from "../../components/Panigation";
import { useNavigate } from "react-router-dom";
import { Routes } from '../../routes'
import { useDispatch } from "react-redux";
import Staff from "../../api/staff"

export const StaffsTable = (props) => {
   const { data, pageSize } = props
    const TableRow = (props) => {
      const dispatch = useDispatch()
      const { id, email, full_name,date_of_birth, phone,avatar,index } = props 
      const { handleVisible, setSaveSuccess, setMessageAlert} = props
      const navigate = useNavigate()
      
      const deleteStaff = async (staff_id)=>{
        let ids = []
        ids.push({id:staff_id})
        console.log("ids",ids)
        let _response = await dispatch.staff.deleteStaff(ids)
        if(_response.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Xóa tài khoản nhân viên thành công!")
            console.log("Xóa thành công!")

        }
        else
        {
            console.log("Xóa thất bại")
            setMessageAlert("Xóa thất bại! Lý do: " + _response.message)
        }
        handleVisible()
      }
      const editStaff=(id)=>{
        navigate(Routes.StaffEdit.path.replace(":id",id),{state: {staff: {id:id}}})
      }
      const [showDetail, setShowDetail] = useState(false);
      const handleCloseShowDetail = () => setShowDetail(false);
      const [staffDetail,setStaffDetail]= useState({staff:Staff.getDefault(),members:[]})
      function _calculateAge(birthday) { // birthday is a date
        birthday= new Date(birthday)
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      }
      const getDetail=async (id)=>{
        let response = await Staff.getStaff(id)
        if(response.result == "okie")
        {
            setStaffDetail({staff:response.data.user,members:response.data.members})
            console.log("staffDetail",response.data)
        }
        else
        {
        }
        setShowDetail(true)
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
                <p>Bạn có chắc chắn muốn xóa nhân viên không ?</p>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>deleteStaff(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        <Modal centered show={showDetail} className="modal-secondary" onHide={handleCloseShowDetail}>
            <Modal.Header>
            <Modal.Title>
                <p className="mb-0 pe-3 pe-md-0">
                    Thông tin của {staffDetail.staff.full_name}
                </p>
            </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleCloseShowDetail} />
            </Modal.Header>
            <Modal.Body>
                <Card border="light" className="px-0 px-md-2 py-0 border-0">
                <Card.Body>
                <Form action="#" onSubmit={handleCloseShowDetail}>
                    <Form.Group>
                        <Form.Label>Email: {staffDetail.staff.email} </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Địa chỉ: {staffDetail.staff.address} </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Giới tính: {staffDetail.staff.gender==1?"Nam":"Nữ"} - {_calculateAge(staffDetail.staff.date_of_birth)} tuổi</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số điện thoại: {staffDetail.staff.phone}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Thông tin liên hệ khẩn cấp: {staffDetail.staff.emergency_info}</Form.Label>
                    </Form.Group>
                   
                </Form>
                </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>editStaff(id)}>Chỉnh sửa thông tin</Button>
            <Button variant="white" size="sm" onClick={handleCloseShowDetail}>Thoát</Button>
            </Modal.Footer>
        </Modal>
        <tr className="border-bottom">
              <td>
              <a className="d-flex align-items-center card-link">
                      <div className="d-block">
                          <span className="fw-bold">{index+1}</span>
                      </div>
                  </a>
              </td>
              <td>
                  <a className="d-flex align-items-center card-link" onClick={()=>getDetail(id)}>
                      <img src={avatar} className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="fw-bold">{full_name}</span>
                      </div>
                  </a>
              </td>
              <td><span className="fw-normal">{email}</span></td>
              <td><span className="fw-normal">{phone}</span></td>
              <td><span className="fw-normal">{moment(date_of_birth).format("DD/MM/YYYY")}</span></td>
              <td>
                  <div className="d-flex btn-group ">
                      <Dropdown >
                          <Dropdown.Toggle variant="link" size='sm'className="me-2 p-2">
                              <FontAwesomeIcon icon={faEllipsisH}  />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-end">
                                <Dropdown.Item className="fw-bold" onClick={() => editStaff(id)}>
                                <FontAwesomeIcon icon={faEdit} className="me-2"/>
                                    Chỉnh sửa
                                </Dropdown.Item>
                              {/* <Dropdown.Item  onClick={() => setShowEditPassword(true)} className="fw-bold">
                                <FontAwesomeIcon icon={faLock} className="me-2"/>Đặt lại mật khẩu</Dropdown.Item> */}
                              <Dropdown.Item onClick={()=>getDetail(id)} className="fw-bold">
                                <FontAwesomeIcon icon={faEye} className="me-2"/>Chi tiết</Dropdown.Item>
                              <Dropdown.Item className="fw-bold">
                                        <a onClick={() => setShowNotification(true)} className="mt-2">
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
    const [action,setAction]= useState("bulk_action")
    const [ saveSuccess, setSaveSuccess] = useState(false)
    const [ messageAlert, setMessageAlert] = useState("")
    const dispatch = useDispatch()

    return (
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0 min-vh-100 ">
            <div className="d-flex mb-3">
                {/* <select disabled={isCheck.length===0} onChange={e=>setAction(e.target.value)} className="fmxw-200 form-select" >
                <option value="bulk_action">Chọn hành động</option>
                <option value="active">Kích hoạt</option>
                <option value="inactive">Vô hiệu</option>
                <option value="delete_staff">Xóa</option>
                </select>
                <button onClick={()=>handleAction()} style={{opacity:0.65}} type="button" className="ms-3 btn-secondary btn">Áp dụng</button> */}
                {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"} className="ms-3 my-0">
                        {messageAlert}
                    </Alert>
                :<></>
                }
          </div>
          <Table responsive className="staff-table align-items-center table table-hover  ">
            <thead className="thead-light">
                <tr>
                <th className="border-bottom">STT</th>
                    <th className="border-bottom">Họ và tên</th>
                    <th className="border-bottom">Email</th>
                    <th className="border-bottom">Số điện thoại</th>
                    <th className="border-bottom">Ngày sinh</th>
                    <th className="border-bottom">Thao tác</th>
                </tr>
            </thead>
            <tbody className="border-0  min-vh-50" >
              {dataShow.length>0 && dataShow.map((staff,index) => 
              <TableRow key={`staff-${staff.id}`} {...staff} index={index} handleVisible={handleVisible} setSaveSuccess={setSaveSuccess} setMessageAlert={setMessageAlert} />
              )}
            </tbody>
          </Table>
          <Panigation pageSize={pageSize} items={data} onChangePage={onChangePage}/>
        </Card.Body>
      </Card>
    );
  };