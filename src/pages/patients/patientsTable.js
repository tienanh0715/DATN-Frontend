
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Alert, Modal,Button, Form } from '@themesberg/react-bootstrap';
import { Panigation } from "../../components/Panigation";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { Routes } from '../../routes'
import { useDispatch, useSelector } from "react-redux";
import Patient from "../../api/patient"
import Util from "../../utils"

export const PatientTable = (props) => {
   const { data, pageSize } = props
    const TableRow = (props) => {
      const dispatch = useDispatch()
      const userLogin = useSelector(state=>state.user.userLogin)
      const { id, email, full_name, status,date_of_birth, phone,avatar,index, identity_card_number} = props 
      const { handleVisible, setSaveSuccess, setMessageAlert} = props
      let classTextStatus=status==1?"text-success":(status==0?"text-warning":"text-danger")
      let textStatus = status==1?"Active":(status==0?"Inactive":"Suspend")
      const navigate = useNavigate()
      const edit = (user_id) =>{
        console.log("path",Routes.PatientEdit.path.replace(":id",user_id))
        navigate(Routes.PatientEdit.path.replace(":id",user_id),{state: {patient: {id:user_id}}})
      }
      const deleteUser = async (user_id)=>{
        let ids = []
        ids.push({id:user_id})
        console.log("ids",ids)
        let _response = await dispatch.patient.deleteUser(ids)
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
      
      const [showDetail, setShowDetail] = useState(false);
      const handleCloseShowDetail = () => setShowDetail(false);
      const [userDetail,setUserDetail]= useState({user:Patient.getDefault(),members:[]})
      const editUser=(id)=>{
        navigate(Routes.PatientEdit.path.replace(":id",id),{state: {user: {id:id}}})
      }
      const getDetail=async (id)=>{
        let response = await Patient.getUser(id)
        if(response.result == "okie")
        {
            setUserDetail({user:response.data.user,members:response.data.members})
            console.log("userDetail",response.data)
        }
        else
        {
        }
        setShowDetail(true)
      }
      const changePW= async (user_id)=>{
        if(pw != confirmpw)
        {
            handleVisibleAlert()
            setMessageAlertChangePW("Mật khẩu không giống nhau !")
        }
        else
        {
            if(pw.length<3)
            {
                handleVisibleAlert()
                setMessageAlertChangePW("Mật khẩu phải có độ dài hơn 6 ký tự !")
            }
            else
            {
                let _Edit_User= { id: user_id, password: pw}
                let res = await Patient.editPatient(_Edit_User)
                if(res.result == "okie")
                {
                    setSaveSuccess(true)
                    setMessageAlert("Đặt lại mật khẩu thành công!")
                }
                else
                {
                    setMessageAlert("Đặt lại mật khẩu thất bại! Lý do: " + res.message)
                }
                handleVisible()
            }
        }
      }
      const [pw,setPW]= useState("")
      const [confirmpw,setConfirmPW]= useState("")

      const [showNotification, setShowNotification] = useState(false);
      const handleClose = () => setShowNotification(false);
      const [showEditPassword, setShowEditPassword] = useState(false);
      const handleCloseEditPassword = () => setShowEditPassword(false);
      const [visibleAlert, setVisibleAlert] = useState(false)
      const handleVisibleAlert = () => {  
          setVisibleAlert(true)
          setTimeout(() => {
              setVisibleAlert(false)
          }, 2000);
      } 
      const [ messageAlertChangePW, setMessageAlertChangePW] = useState("")
      function _calculateAge(birthday) { // birthday is a date
        birthday= new Date(birthday)
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
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
                <p>Bạn có chắc chắn muốn xóa nhân viên không ?</p>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>deleteUser(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        <Modal centered show={showEditPassword} className="modal-secondary" onHide={handleCloseEditPassword}>
            <Modal.Header>
            <Modal.Title>
                <p className="mb-0 pe-3 pe-md-0">
                    Đặt lại mật khẩu
                </p>
            </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleCloseEditPassword} />
            </Modal.Header>
            <Modal.Body>
                <Card border="light" className="px-0 px-md-4 py-0 border-0">
                <Card.Body>
                <Form action="#" onSubmit={handleCloseEditPassword}>
                    <Form.Group>
                    <Form.Group className="mb-4" id="newPW">
                        <Form.Control value={pw} onChange={e=>setPW(e.target.value)} type="password" placeholder="Nhập mật khẩu mới" />
                    </Form.Group>
                    <Form.Group className="mb-4" id="confirmNewPW">
                        <Form.Control value={confirmpw} onChange={e=>setConfirmPW(e.target.value)} type="password" placeholder="Xác nhận mật khẩu" />
                    </Form.Group>
                    </Form.Group>
                    {visibleAlert?
                    <Alert variant="danger" className="my-0">
                        {messageAlertChangePW}
                    </Alert>
                :<></>
                }
                </Form>
                </Card.Body>
            </Card>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>changePW(id)}>Thay đổi</Button>
            <Button variant="white" size="sm" onClick={handleCloseEditPassword}>Thoát</Button>
            </Modal.Footer>
        </Modal>
        <Modal centered show={showDetail} className="modal-secondary" onHide={handleCloseShowDetail}>
            <Modal.Header>
            <Modal.Title>
                <p className="mb-0 pe-3 pe-md-0">
                    Thông tin của {userDetail.user.full_name}
                </p>
            </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleCloseShowDetail} />
            </Modal.Header>
            <Modal.Body>
                <Card border="light" className="px-0 px-md-2 py-0 border-0">
                <Card.Body>
                <Form action="#" onSubmit={handleCloseShowDetail}>
                    <Form.Group>
                        <Form.Label>Email: {userDetail.user.email} </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Địa chỉ: {userDetail.user.address} </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Giới tính: {userDetail.user.gender==1?"Nam":"Nữ"} - {_calculateAge(userDetail.user.date_of_birth)} tuổi</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số điện thoại: {userDetail.user.phone}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Thông tin liên hệ khẩn cấp: {userDetail.user.emergency_info}</Form.Label>
                    </Form.Group>
                   
                </Form>
                </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>editUser(id)}>Chỉnh sửa thông tin</Button>
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
                  <a className="d-flex align-items-center card-link" onClick={()=>edit(id)}>
                      <img src={avatar} className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="fw-bold">{full_name}</span>
                      </div>
                  </a>
              </td>
              <td><span className="fw-normal">{email}</span></td>
              <td><span className="fw-normal">{phone}</span></td>
              <td><span className="fw-normal">{Util.isEmpty(date_of_birth) ? '': moment(date_of_birth).format("DD/MM/YYYY")}</span></td>
              <td><span className="fw-normal">{identity_card_number}</span></td>
              <td>
              <FontAwesomeIcon onClick={()=>edit(id)} icon={faEye} className="me-2"/>
              </td>
          </tr>
        </>

      );
    };
   
    const userLogin = useSelector(state=>state.user.userLogin)

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
    const dispatch = useDispatch()
    return (
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0 min-vh-100 ">
        {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"} className="ms-0 my-2">
                        {messageAlert}
                    </Alert>
                :<></>
                }
          <Table responsive className="user-table align-items-center table table-hover  ">
            <thead className="thead-light">
                <tr>
                <th className="border-bottom">STT</th>
                   
                    <th className="border-bottom">Họ và tên</th>
                    <th className="border-bottom">Email</th>
                    <th className="border-bottom">Số điện thoại</th>
                    <th className="border-bottom">Ngày sinh</th>
                    <th className="border-bottom">CMND/CCCD</th>
                    <th className="border-bottom">Thao tác</th>
                </tr>
            </thead>
            <tbody className="border-0  min-vh-50" >
              {dataShow.length>0 && dataShow.map((user,index) => 
              <TableRow key={`user-${user.id}`} {...user} index={index} handleVisible={handleVisible} setSaveSuccess={setSaveSuccess} setMessageAlert={setMessageAlert} />
              )}
            </tbody>
          </Table>
          <Panigation pageSize={pageSize} items={data} onChangePage={onChangePage}/>
        </Card.Body>
      </Card>
    );
  };