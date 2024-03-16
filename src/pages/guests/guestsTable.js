
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH,  faEye,  faLock,faGuestCheck,faGuestSlash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Dropdown,Alert, Modal,Button, Form } from '@themesberg/react-bootstrap';
import { Panigation } from "../../components/Panigation";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { Routes } from '../../routes'
import { useDispatch, useSelector } from "react-redux";
import Guest from "../../api/guest"
import avatarDefault from '../../assets/img/avatar_default.jpg'

export const GuestsTable = (props) => {
   const { data, pageSize } = props
    const TableRow = (props) => {
      const dispatch = useDispatch()
      const { id, email, full_name, status,date_of_birth, phone,avatar,index, emergency_info,identity_card_number,created_date} = props 
      const { handleVisible, setSaveSuccess, setMessageAlert} = props
      const navigate = useNavigate()
      
      const deleteGuest = async (guest_id)=>{
        let ids = []
        ids.push({id:guest_id})
        console.log("ids",ids)
        let _response = await dispatch.guest.deleteGuest(ids)
        if(_response.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Xóa thành công!")
            console.log("Xóa thành công!")

        }
        else
        {
            console.log("Xóa thất bại")
            setMessageAlert("Xóa thất bại! Lý do: " + _response.message)
        }
        handleVisible()
      }
      const editGuest=(id)=>{
        if(userLogin.code != "STAFF") return
        navigate(Routes.GuestEdit.path.replace(":id",id),{state: {guest: {id:id}}})
      }
      const [showDetail, setShowDetail] = useState(false);
      const handleCloseShowDetail = () => setShowDetail(false);
      const [guestDetail,setGuestDetail]= useState({guest:Guest.getDefault(),members:[]})
      function _calculateAge(birthday) { // birthday is a date
        birthday= new Date(birthday)
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      }
      const getDetail=async (id)=>{
        let response = await Guest.getGuest(id)
        if(response.result == "okie")
        {
            setGuestDetail({guest:response.data.user,members:response.data.members})
            console.log("guestDetail",response.data)
        }
        else
        {
        }
        setShowDetail(true)
      }
     
      const [showNotification, setShowNotification] = useState(false);
      const handleClose = () => setShowNotification(false);

      const getNameBloodGroup= (blood_group)=>{
        switch (blood_group) {
            case 1: return "O+"
            case 2: return "A+"
            case 3: return "B+"
            case 4: return "AB+"
            case 5: return "O-"
            case 6: return "A-"
            case 7: return "B-"
            default: return "AB-"
        }
      }
      return (
        <>
        <Modal centered show={showNotification} className="modal-secondary" onHide={handleClose}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleClose} />
            </Modal.Header>
            <Modal.Body>
            <div className="text-center">
                <Modal.Title className="h4 my-3">Thông báo xác nhận!</Modal.Title>
                <p>Bạn có chắc chắn muốn xóa khách không ?</p>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>deleteGuest(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        <Modal centered show={showDetail} className="modal-secondary" onHide={handleCloseShowDetail}>
            <Modal.Header>
            <Modal.Title>
                <p className="mb-0 pe-3 pe-md-0">
                    Thông tin của khách: {guestDetail.guest.full_name}
                </p>
            </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleCloseShowDetail} />
            </Modal.Header>
            <Modal.Body>
                <Card border="light" className="px-0 px-md-2 py-0 border-0">
                <Card.Body>
                <Form action="#" onSubmit={handleCloseShowDetail}>
                    <Form.Group>
                        <Form.Label>Số điện thoại: {guestDetail.guest.phone}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Giới tính: {guestDetail.guest.gender==1?"Nam":"Nữ"} - {_calculateAge(guestDetail.guest.date_of_birth)} tuổi</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Địa chỉ: {guestDetail.guest.address} </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Thông tin liên hệ khẩn cấp: {guestDetail.guest.emergency_info}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>CMND/CCCD: {guestDetail.guest.identity_card_number}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số thẻ BHYT: {guestDetail.guest.health_insurance_number}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nhóm máu: {getNameBloodGroup(guestDetail.guest.blood_group)}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Thông tin dị ứng: {guestDetail.guest.allergy_info}</Form.Label>
                    </Form.Group>
                </Form>
                </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
            {userLogin.code == "STAFF" ? <Button variant="white" size="sm" onClick={()=>editGuest(id)}>Chỉnh sửa thông tin</Button>:<></>}
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
                  <a className="d-flex align-items-center card-link" onClick={()=>editGuest(id)}>
                      <img src={avatar?avatar:avatarDefault} className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="fw-bold">{full_name}</span>
                      </div>
                  </a>
              </td>
              <td><span className="fw-normal">{phone}</span></td>
              <td><span className="fw-normal">{moment(date_of_birth).format("DD/MM/YYYY")}</span></td>
              <td><span className="fw-normal">{identity_card_number}</span></td>
              <td><span className="fw-normal">{moment(created_date).format("DD/MM/YYYY")}</span></td>

              <td>
                {userLogin.code == "STAFF"?
                <div className="d-flex btn-group ">
                      <Dropdown >
                          <Dropdown.Toggle variant="link" size='sm'className="me-2 p-2">
                              <FontAwesomeIcon icon={faEllipsisH}  />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-end">
                                <Dropdown.Item className="fw-bold" onClick={() => editGuest(id)}>
                                <FontAwesomeIcon icon={faEdit} className="me-2"/>
                                    Chỉnh sửa
                                </Dropdown.Item>
                              <Dropdown.Item onClick={()=>getDetail(id)} className="fw-bold">
                                <FontAwesomeIcon icon={faEye} className="me-2"/>Chi tiết</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown> 
                  </div>
                :
                <FontAwesomeIcon onClick={()=>getDetail(id)} icon={faEye} className="me-2"/>
                }
                  
              </td>
          </tr>
        </>

      );
    };
    const { guests,userLogin } = useSelector(state => {
        return {
            guests:  state.guest.guests.data,
            userLogin: state.user.userLogin
        }
    })
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
                {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"} className="ms-3 my-0">
                        {messageAlert}
                    </Alert>
                :<></>
                }
          </div>
          <Table responsive className="guest-table align-items-center table table-hover  ">
            <thead className="thead-light">
                <tr>
                <th className="border-bottom">STT</th>
                    <th className="border-bottom">Tên khách</th>
                    <th className="border-bottom">Số điện thoại</th>
                    <th className="border-bottom">Ngày sinh</th>
                    <th className="border-bottom">CMND/CCCD</th>
                    <th className="border-bottom">Ngày tạo</th>
                    <th className="border-bottom">Thao tác</th>
                </tr>
            </thead>
            <tbody className="border-0  min-vh-50" >
              {dataShow.length>0 && dataShow.map((guest,index) => 
              <TableRow key={`guest-${guest.id}`} {...guest} index={index} handleVisible={handleVisible} setSaveSuccess={setSaveSuccess} setMessageAlert={setMessageAlert} />
              )}
            </tbody>
          </Table>
          <Panigation pageSize={pageSize} items={data} onChangePage={onChangePage}/>
        </Card.Body>
      </Card>
    );
  };