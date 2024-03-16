import moment from "moment-timezone";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH,  faEye,  faLock,faUserCheck,faUserSlash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Dropdown,Alert, Modal,Button, Form } from '@themesberg/react-bootstrap';
import { Panigation } from "../../components/Panigation";
import Util from "../../utils"
import { useNavigate } from "react-router-dom";
import { Routes } from '../../routes'
import { useDispatch, useSelector } from "react-redux";
import Doctor from "../../api/doctor"

export const DoctorTable = (props) => {
   const { data, pageSize } = props
    const TableRow = (props) => {
      const dispatch = useDispatch()
      const { id, email, full_name,date_of_birth, phone,avatar,index, experience_year} = props 
      const { handleVisible, setSaveSuccess, setMessageAlert} = props
      const navigate = useNavigate()
      const deleteDoctor = async (doctor_id)=>{
        let ids = []
        ids.push({id:doctor_id})
        console.log("ids",ids)
        let _response = await dispatch.doctor.deleteDoctor(ids)
        if(_response.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Xóa tài khoản bác sĩ thành công!")
        }
        else
        {
            setMessageAlert("Xóa thất bại! Lý do: " + _response.message)
        }
        handleVisible()
      }
      
      const [showDetail, setShowDetail] = useState(false);
      const handleCloseShowDetail = () => setShowDetail(false);
      const [doctorDetail,setUserDetail]= useState({doctor:Doctor.getDefault(),members:[]})
      const editDoctor=(id)=>{
        navigate(Routes.DoctorEdit.path.replace(":id",id),{state: {doctor: {id:id}}})
      }
      const detailDoctor =(id)=>{
        navigate(Routes.DoctorDetail.path.replace(":id",id),{state: {doctor: {id:id}}})
      }
      const getDetail=async (id)=>{
        let response = await Doctor.getDoctor(id)
        if(response.result == "okie")
        {
            setUserDetail({doctor:response.data.doctor,members:response.data.members})
            console.log("doctorDetail",response.data)
        }
        else
        {
        }
        setShowDetail(true)
      }
      const changePW= async (doctor_id)=>{
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
                let _Edit_User= { id: doctor_id, password: pw}
                let res = await Doctor.editDoctor(_Edit_User)
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
      function convertDateOfBirth(birthday) { // birthday is a date
       // Create a new date object with the provided date string
        const date = new Date(birthday);

        // Get the day, month, and year from the date object
        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // add 1 to month because it is 0-indexed
        const year = date.getUTCFullYear();

        // Combine the day, month, and year into the desired format
        return `${day}/${month}/${year}`;
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
                <p>Bạn có chắc chắn muốn xóa bác sĩ không ?</p>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>deleteDoctor(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
       
        <Modal centered show={showDetail} className="modal-secondary" onHide={handleCloseShowDetail}>
            <Modal.Header>
            <Modal.Title>
                <p className="mb-0 pe-3 pe-md-0">
                    Thông tin của {doctorDetail.doctor.full_name}
                </p>
            </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleCloseShowDetail} />
            </Modal.Header>
            <Modal.Body>
                <Card border="light" className="px-0 px-md-2 py-0 border-0">
                <Card.Body>
                <Form action="#" onSubmit={handleCloseShowDetail}>
                    <Form.Group>
                        <Form.Label>Email: {doctorDetail.doctor.email} </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Địa chỉ: {doctorDetail.doctor.address} </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Giới tính: {doctorDetail.doctor.gender==1?"Nam":"Nữ"} - {_calculateAge(doctorDetail.doctor.date_of_birth)} tuổi</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số điện thoại: {doctorDetail.doctor.phone}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Thông tin liên hệ khẩn cấp: {doctorDetail.doctor.emergency_info}</Form.Label>
                    </Form.Group>
                   
                </Form>
                </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>editDoctor(id)}>Chỉnh sửa thông tin</Button>
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
                  <a className="d-flex align-items-center card-link" onClick={()=>detailDoctor(id)}>
                      <img src={avatar} className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="fw-bold">{full_name}</span>
                      </div>
                  </a>
              </td>
              <td><span className="fw-normal">{email}</span></td>
              <td><span className="fw-normal">{phone}</span></td>
              <td><span className="fw-normal">{moment(date_of_birth).format("DD/MM/YYYY")}</span></td>
              <td><span className="fw-normal">{experience_year??0}</span></td>

              <td>
                  <div className="d-flex btn-group ">
                      <Dropdown >
                          <Dropdown.Toggle variant="link" size='sm'className="me-2 p-2">
                              <FontAwesomeIcon icon={faEllipsisH}  />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-end">
                                <Dropdown.Item className="fw-bold" onClick={() => editDoctor(id)}>
                                <FontAwesomeIcon icon={faEdit} className="me-2"/>
                                    Chỉnh sửa
                                </Dropdown.Item>
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
   
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    const doctorLogin = useSelector(state=>state.doctor.doctorLogin)

    const handleSelectAll = e => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(dataShow.filter(li => li.id!=doctorLogin.id).map(li =>  "checkbox_doctor_"+li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = e => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    };

    useEffect(() => {
        console.log("isCheck",isCheck)
      }, [isCheck]);

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
    const handleAction= async ()=>{
        
        switch(action)
        {
            case "active":
            case "inactive":
                let data = isCheck.map(item=> ({id:item.split("_")[2],status:action=="active"?1:0}))
                // console.log("data",data)
                let response = await dispatch.doctor.changeStatus(data)
                if(response.result == "okie")
                {
                    setSaveSuccess(true)
                    setMessageAlert("Cập nhật trạng thái thành công!")
                }
                else
                {
                    setMessageAlert("Cập nhật trạng thái thất bại! Lý do: " + response.message)
                }
                break
            case "delete_doctor":
                let ids = isCheck.map(item=> ({id:item.split("_")[2]}))
                // console.log("ids",ids)
                let _response = await dispatch.doctor.deleteDoctor(ids)
                if(_response.result == "okie")
                {
                    setSaveSuccess(true)
                    setMessageAlert("Xóa thành công!")
                }
                else
                {
                    setMessageAlert("Xóa thất bại! Reason: " + _response.message)
                }
                break
            default:
                setSaveSuccess(false)
                setMessageAlert("Xin hãy chọn hành động!")
                break
        }
        handleVisible()
        
    }

    return (
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0 min-vh-100 ">
        {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"} className="ms-0 my-2">
                        {messageAlert}
                    </Alert>
                :<></>
                }
          <Table responsive className="doctor-table align-items-center table table-hover  ">
            <thead className="thead-light">
                <tr>
                    <th className="border-bottom">STT</th>
                    <th className="border-bottom">Tên bác sĩ</th>
                    <th className="border-bottom">Email</th>
                    <th className="border-bottom">Số điện thoại</th>
                    <th className="border-bottom">Ngày sinh</th>
                    <th className="border-bottom">Số năm kinh nghiệm</th>
                    <th className="border-bottom">Thao tác</th>
                </tr>
            </thead>
            <tbody className="border-0  min-vh-50" >
              {dataShow.length>0 && dataShow.map((doctor,index) => 
              <TableRow key={`doctor-${doctor.id}`} {...doctor} index={index} handleVisible={handleVisible} setSaveSuccess={setSaveSuccess} setMessageAlert={setMessageAlert} />
              )}
            </tbody>
          </Table>
          <Panigation pageSize={pageSize} items={data} onChangePage={onChangePage}/>
        </Card.Body>
      </Card>
    );
  };