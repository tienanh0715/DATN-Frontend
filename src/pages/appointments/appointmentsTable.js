
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH,  faEye,  faLock,faPlusCircle,faMinusSquare,faEdit, faCircle, faMoneyCheckAlt, faMoneyCheck, faSpinner, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Dropdown,Alert, Modal,Button, Form ,Row,Col} from '@themesberg/react-bootstrap';
import { Panigation } from "../../components/Panigation";
import Util from "../../utils"
import { useNavigate } from "react-router-dom";
import { Routes } from '../../routes'
import { useDispatch, useSelector } from "react-redux";
import Appointment from "../../api/appointment"
import localStore from '../../utils/localStorage'
import avatarDefault from '../../assets/img/avatar_default.jpg'
import Booking from "./Booking";
import Detail from "./detail";
import PreDetail from "./preDetail"
import { Server } from "../../api/APIs";

export const AppointmentTable = (props) => {
    const { userLogin,origin_medicines,appointments } = useSelector(state => {
        return {
            userLogin:  state.user.userLogin,
            origin_medicines:  state.medicine.data,
            appointments:  state.appointment.appointments.data,
        }
    })
   
   const { data, pageSize } = props
    const TableRow = (props) => {
      const dispatch = useDispatch()
      const appointmentLogin = useSelector(state=>state.appointment.appointmentLogin)
      const { index, id, re_examine,parent_id,payment_amount, status,date,session_time,
        doctor_avatar,doctor_email,doctor_fullName,doctor_id,children_id,
        patient_avatar,patient_email,patient_fullName,patient_id,patient_type,patient_phone
        } = props 
      const { handleVisible, setSaveSuccess, setMessageAlert} = props
      let classTextStatus=status==1?"text-success":(status==2?"text-danger":(status==3?"text-warning":"text-info"))
      let textStatus = status==1?"Đã đặt lịch":(status==2?"Đã hủy lịch":(status==3?"Đã khám bệnh":"Đã thanh toán"))
      const navigate = useNavigate()
      const edit = (appointment_id) =>{
        console.log("path",Routes.AppointmentEdit.path.replace(":id",appointment_id.split("_")[2]))
        navigate(Routes.AppointmentEdit.path.replace(":id",appointment_id.split("_")[2]),{state: {appointment: {id:appointment_id.split("_")[2]}}})
      }
      const getDetail=async (id)=>{
        console.log("apppointment",id)
        navigate(Routes.AppointmentDetail.path.replace(":id",id),{state: {appointment: {id:id}}})
      }

      const [showNotification, setShowNotification] = useState(false);
      const handleClose = () => setShowNotification(false);

      const [showCheckout, setShowCheckout] = useState(false);
      const handleCloseCheckout = () => setShowCheckout(false);

      const [visibleAlert, setVisibleAlert] = useState(false)
      const handleVisibleAlert = () => {  
          setVisibleAlert(true)
          setTimeout(() => {
              setVisibleAlert(false)
          }, 2000);
      } 
      const [ messageAlertChangePW, setMessageAlertChangePW] = useState("")
      const [cancel_reason,setCancelReason] = useState("")
      const [invalidCancelReason,setInvalidCancelReason] = useState(false)

      const cancelAppointment = async (appointment_id)=>{
        if(!Util.isEmpty(cancel_reason))
        {
            let data ={
                id:appointment_id,
                cancel_reason:cancel_reason
            }
            let _response = await dispatch.appointment.edit(data)
            if(_response.result == "okie")
            {
                setSaveSuccess(true)
                setMessageAlert("Hủy lịch khám thành công!")
            }
            else
            {
                setMessageAlert("Hủy lịch thất bại! Lý do: " + _response.message)
            }
            handleVisible()
        }
        else
        {
            setInvalidCancelReason(true)
            setCancelReason("Hãy nhập lý do vào đây!")
            setTimeout(()=>{
                setCancelReason("")
                setInvalidCancelReason(false)
            },1000)
        }
        
      }

    const checkoutAppointment = async (appointment_id)=>{
        let data ={
            id:appointment_id,
            payment_user_id:userLogin.id,
            status:4
        }
        let _response = await dispatch.appointment.edit(data)
        if(_response.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Xác nhận thanh toán thành công!")
        }
        else
        {
            setMessageAlert("Xác nhận thanh toán lịch thất bại! Lý do: " + _response.message)
        }
        handleVisible()
    }
    const [showPreviousAppointment, setShowPreviousAppointment] = useState(false);
    const handleClosePreviousAppointment = () => setShowPreviousAppointment(false);
    // const getPreviousAppointment = async (parent_id)=>{
    //     let found = appointments.filter(item =>item.id == parent_id)
    //     if(found.length > 0)
    //     {
    //         return found[0];
    //     }
    //     else
    //     {
    //         let previousAppointment = await Appointment.getAppointment(parent_id);
    //         if(previousAppointment.result=="okie")
    //         {
    //             return previousAppointment.data;
    //         }
    //     }
    // }
    const getPreviousAppointment =(parent_id)=>{
        return appointments.filter( item =>item.id == parent_id)[0]
    }
    const [showAfterAppointment, setShowAfterAppointment] = useState(false);
    const handleCloseAfterAppointment = () => setShowAfterAppointment(false);
    // const getAfterAppointment = async (children_id) =>{
    //     let found = appointments.filter(item =>item.id == children_id)
    //     if(found.length > 0)
    //     {
    //         return found[0];
    //     }
    //     else
    //     {
    //         let afterAppointment = await Appointment.getAppointment(children_id);
    //         console.log(afterAppointment);
    //         if(afterAppointment.result=="okie")
    //         {
    //             return afterAppointment.data;
    //         }
    //     }
    // }

    const getAfterAppointment =(children_id)=>{
        return appointments.filter( item =>item.id == children_id)[0]
    }

    const [showExamination, setShowExamination] = useState(false);
    const handleCloseExamination = () => setShowExamination(false);
    const examinate = async (appointment_id)=>{
        let passed = true
        if(Util.isEmpty(examinationInfo))
        {
            passed = false
            setInvalidCancelReason(true)
            setExaminationInfo("Hãy nhập thông tin khám bệnh vào đây!")
            setTimeout(()=>{
                setCancelReason("")
                setInvalidCancelReason(false)
            },1000)
        }
        if(selectedFiles.length==0 && passed)
        {
            passed = false
            setMessageAlert("Hãy chọn ảnh!")
        }
        if(passed)
        {
            let data ={
                id:appointment_id,
                status:3,
                re_examine:needReExamine?1:0,
                examination_info:examinationInfo,
                payment_fee:paymentFee,
                fee_info:feeInfo,
                medicines:medicines
            }
            const formData = new FormData();
            selectedFiles.forEach((file) => {
              formData.append('files', file);
            });
            formData.append("data",JSON.stringify(data) )
        
            try {
                let token = await localStore.get('accessToken', "not-set")
                fetch(Server+'appointment/update/' + appointment_id, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData
                  })
                    .then((response) => response.json())
                    .then((_response) => {
                      if (_response.result === 'okie') {
                        setSaveSuccess(true);
                        setMessageAlert('Cập nhật thông tin khám bệnh thành công!');
                        Appointment.getAppointments().then(data =>{
                            if(data.result=="okie")
                            {
                              dispatch.appointment.setData(data.data)
                            }
                            else
                            {
                              console.log("err_Appointments",data)
                            }
                          })
                      } else {
                        setMessageAlert(
                          'Cập nhật thông tin khám bệnh thất bại! Lý do: ' + _response.message
                        );
                      }
                    })
                    .catch((error) => {
                      console.log('Error updating appointment:', error);
                      setMessageAlert('Có lỗi xảy ra khi cập nhật thông tin khám bệnh!');
                    });
                  
              console.log('Files uploaded successfully!');
              // Handle success response from the server if needed
            } catch (error) {
              console.error('Error uploading files:', error);
              // Handle error response from the server if needed
            }
           
            handleVisible()
            setSelectedFiles([]);
            setPreviewImages([]);
        }
        else
        {
            handleVisible()
        }
    }
    const [needReExamine,setNeedReExamine] = useState(false)
    const [examinationInfo,setExaminationInfo] =useState("")
    const [feeInfo,setFeeInfo] =useState("")
    const [paymentFee,setPaymentFee] =useState(0)
    const [medicines,setMedicines] = useState([])

    const handleAddMedicine = ()=>{
        console.log("add medicine")
        let newMedicines = [...medicines]
        newMedicines.push({
            id: Util.generateRandomId(),
            medicine_id:origin_medicines[0].id,
            name:origin_medicines[0].name,
            uses:"",
        })
        setMedicines(newMedicines)
    }
    const handleDelete = (medicine_id)=>{
        console.log("delete medicine")
        let newMedicines = medicines.filter(item=>item.id!=medicine_id)
        setMedicines(newMedicines)
    }
    const changePropertyMedicine= (key,val,id)=>{
        let medicine_id
        if(key=="name")
        {
            medicine_id = origin_medicines.filter(item=>item.name==val)[0].id
        }
        else
        {
            medicine_id  = medicines.filter(item=>item.id==id)[0].medicine_id
        }
        let newMedicines = medicines.map(item=>{
            if(item.id==id)
            {
                return {
                    ...item,
                    medicine_id:medicine_id,
                    [key]:val
                }
            }
            else return item
        })
        setMedicines(newMedicines)
    }
    
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles([...selectedFiles,...files]);

        const images = [];
        files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
            images.push(reader.result);
            if (images.length === files.length) {
            setPreviewImages([...previewImages,...images]);
            }
        };
        reader.readAsDataURL(file);
        });
    };
    const handleImageRemove = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    
        const updatedImages = [...previewImages];
        updatedImages.splice(index, 1);
        setPreviewImages(updatedImages);
      };
      const [showBooking, setShowBooking] = useState(false);
      const handleCloseBooking = () => setShowBooking(false);
      const [show,setShow] = useState(false);
    
    return (
        <>
        <Modal centered show={showNotification} className="modal-secondary" onHide={handleClose}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleClose} />
            </Modal.Header>
            <Modal.Body>
            <div className="text-center">
                <Modal.Title className="h4 my-3">Bạn có chắc chắn muốn hủy lịch khám không ?</Modal.Title>
            </div>
            <Form.Group id="full_name">
                    <Form.Label>Lý do *</Form.Label>
                    <Form.Control
                    className={invalidCancelReason?"text-danger":""}
                    value={cancel_reason} 
                    onChange={e=>setCancelReason(e.target.value)} 
                    required type="text" placeholder="Nhập lý do" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" disabled={invalidCancelReason} onClick={()=>cancelAppointment(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        <Modal centered show={showCheckout} className="modal-secondary" onHide={handleCloseCheckout}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleCloseCheckout} />
            </Modal.Header>
            <Modal.Body>
            <div className="text-center">
                <Modal.Title className="h4 my-3">Xác nhận lịch đã được thanh toán ?</Modal.Title>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" disabled={invalidCancelReason} onClick={()=>checkoutAppointment(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleCloseCheckout}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        <Modal size="lg" centered show={showExamination} className="modal-secondary" onHide={handleCloseExamination}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleCloseExamination} />
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <Modal.Title className="h4 my-3">Cập nhật thông tin khám bệnh</Modal.Title>
                </div>
                <Card border="light" className="shadow-sm mb-4">
                    <Card.Body className="pb-0 min-vh-100 ">
                        <Row className="mb-2">
                            <Col>
                                Thông tin khám bệnh *
                            </Col>
                            <Col className={"d-flex justify-content-end"}>
                                <Form.Check 
                                    onChange={(e)=>setNeedReExamine(pre=>!pre)} 
                                    label="Cần tái khám"
                                    checked={needReExamine}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group id="examination_info">
                                   <Form.Control value={examinationInfo} 
                                   onChange={e=>setExaminationInfo(e.target.value)} 
                                   type="text" placeholder="Nhập thông tin khám bệnh" />
                               </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group id="images_examination" className="mb-3">
                                    <Form.Label>Ảnh khám bệnh *</Form.Label>
                                   <Form.Control
                                    // value={examinationInfo} 
                                   onChange={handleFileChange} 
                                   type="File" multiple  placeholder="Chọn ảnh" />
                            </Form.Group>
                            <Row>
                            {previewImages?.map((image, index) => (
                                <Col md={3}>
                                    <Row className="mb-2">
                                        <Col>
                                            <img key={index} src={image} alt="Preview" className="img-fluid img-thumbnail" />
                                        </Col>
                                        <Col md={2} className="d-flex justify-content-end align-items-center ">
                                        <FontAwesomeIcon className="pointer user-select-auto" onClick={()=>handleImageRemove(index)} icon={faTrash}/> 
                                        </Col>
                                    </Row>
                                </Col>
                                ))}
                            </Row>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group id="examination_info">
                                    <Form.Label>Phụ phí (nếu có)</Form.Label>

                                   <Form.Control value={paymentFee} 
                                   onChange={e=>setPaymentFee(e.target.value)} 
                                   type="number" placeholder="Nhập phụ phí" />
                               </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group id="examination_info">
                                    <Form.Label>Thông tin phụ phí (nếu có)</Form.Label>
                                   <Form.Control value={feeInfo} 
                                   disabled={paymentFee==0}
                                   onChange={e=>setFeeInfo(e.target.value)} 
                                   type="text" placeholder="Nhập thông tin phụ phí" />
                               </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group id="medicines">
                               <Form.Label>Đơn thuốc</Form.Label>
                            </Form.Group>
                            {medicines?.map((item,index)=>{
                                const { name, uses, id } = item
                                return (
                                    <Row key={index} className="ms-2 mt-2">
                                        <Col md={1} className="my-auto">
                                            <FontAwesomeIcon onClick={()=> handleDelete(id)} 
                                            className="ms-2 mt-4" 
                                            size="30" icon={faMinusSquare} 
                                            />
                                        </Col>
                                        <Col >
                                            <Form.Group id="medicine_name">
                                                <Form.Label>Thuốc</Form.Label>
                                                <Form.Select value={name} onChange={e=>changePropertyMedicine("name",e.target.value,id)}>
                                                        {origin_medicines.map(item=>{
                                                            return (
                                                                <option key={item.id} value={item.name}>{item.name}</option>
                                                            )
                                                        })
                                                        }
                                                    </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col >
                                            <Form.Group id="medicine_uses">
                                                <Form.Label>Cách dùng</Form.Label>
                                                <Form.Control
                                                    value={uses} 
                                                    onChange={e=>{changePropertyMedicine("uses",e.target.value,id)}} 
                                                    required type="text" placeholder="Nhập cách dùng" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )
                                })
                            }
                            <Row className="ms-2"  >
                                <Col md={1} className="my-auto">
                                    <FontAwesomeIcon onClick={()=>handleAddMedicine()} 
                                    className="ms-2 mt-4" 
                                    size="30" icon={faPlusCircle} 
                                    />
                                </Col>
                                <Col md={11} className="mt-4" >
                                    <p onClick={()=>handleAddMedicine()} >Thêm thuốc</p>
                                </Col>
                            </Row>
                       </Row>
                    </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" disabled={invalidCancelReason} onClick={()=>examinate(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleCloseExamination}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        {showBooking?
        <Booking patient_type={patient_type} patient_phone={patient_phone} parent_id={id} patient_id={patient_id} patient_fullName={patient_fullName} patient_email={patient_email} isBooking={showBooking} handleCloseShowDetail={handleCloseBooking} />
        :<></>}
        {!Util.isEmpty(children_id)?
        <Detail isShow={showAfterAppointment} handleCloseShowDetail={handleCloseAfterAppointment} _appointment={getAfterAppointment(children_id)} />
        :<></>}
        {!Util.isEmpty(parent_id)?
        <PreDetail isShow={showPreviousAppointment} handleCloseShowDetail={handleClosePreviousAppointment} _appointment={getPreviousAppointment(parent_id)} />
        :<></>}
        <tr className="border-bottom">
              <td>
              <a className="d-flex align-items-center card-link">
                      <div className="d-block">
                          <span className="fw-bold">{index+1}</span>
                      </div>
                  </a>
              </td>
              <td>
                    <div className="d-block align-items-start">
                        <span className="row ">{session_time}</span>
                        <span className="row">{Util.formatDate(date)}</span>
                        {re_examine == 1 ? <span className="row text-secondary">Cần tái khám</span>:<></>}
                        {!Util.isEmpty(parent_id) ?<><span className=" row text-secondary">Lịch tái khám</span></>:<></>}
                    </div>
              </td>
              {userLogin.code=="DOCTOR"?<></>:
              <td>
                  <a className="d-flex align-items-center" onClick={()=>{}}>
                      <img src={Util.isEmpty(doctor_avatar)? avatarDefault :doctor_avatar} className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="row">{doctor_fullName}</span>
                          <span className="row">{doctor_email}</span>

                      </div>
                  </a>
              </td>
              }
              <td>
                  <a className="d-flex align-items-center" onClick={()=>{}}>
                      <img src={Util.isEmpty(patient_avatar)? avatarDefault :patient_avatar } className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="row"> {patient_type == 1 ? patient_fullName : patient_fullName + " (Khách)"}</span>
                          <span className="row">{patient_type == 1 ? patient_email : patient_phone}</span>

                      </div>
                  </a>
              </td>
              <td><span className="fw-normal">{Util.formatNumber(payment_amount)} VNĐ</span></td>
              <td>
                <FontAwesomeIcon className={`${classTextStatus}`}  icon={faCircle}/>
                <span className={`ms-2 fw-normal ${classTextStatus}` }>{textStatus}</span>
                </td>
              <td>
                  <div className="d-flex btn-group ">
                      <Dropdown >
                          <Dropdown.Toggle variant="link" size='sm'className="me-2 p-2">
                              <FontAwesomeIcon icon={faEllipsisH}  />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-end">
                              <Dropdown.Item onClick={()=>getDetail(id)} className="fw-bold">
                                <FontAwesomeIcon icon={faEye} className="me-2"/> Xem chi tiết</Dropdown.Item>
                                {(userLogin.code=="STAFF")?
                                <>
                                {status == 3?
                                <Dropdown.Item className="fw-bold" onClick={() => setShowCheckout(true)}>
                                <FontAwesomeIcon icon={faMoneyCheck} className="me-2"/>
                                    Thanh toán
                                </Dropdown.Item>
                                :<></>}
                                {(re_examine==1 && Util.isEmpty(children_id))?
                                <Dropdown.Item className="fw-bold" onClick={() => setShowBooking(true)}>
                                <FontAwesomeIcon icon={faSpinner} className="me-2"/>
                                    Tái khám
                                </Dropdown.Item>:<></>}
                                </>:<></>}
                                {!Util.isEmpty(children_id)?
                                <Dropdown.Item className="fw-bold" onClick={() => setShowAfterAppointment(true)}>
                                <FontAwesomeIcon icon={faSpinner} className="me-2"/>
                                    Lịch tái khám
                                </Dropdown.Item>:<></>}
                                {!Util.isEmpty(parent_id)?
                                <Dropdown.Item className="fw-bold" onClick={() => setShowPreviousAppointment(true)}>
                                    <FontAwesomeIcon icon={faCalendar} className="me-2"/>
                                    Lịch khám trước
                                </Dropdown.Item>:<></>}
                                {((userLogin.code=="DOCTOR") && status==1)?
                                <>
                                    <Dropdown.Item className="fw-bold" onClick={() => setShowExamination(true)}>
                                        <FontAwesomeIcon icon={faCircle} className="me-2"/>
                                        Khám bệnh
                                    </Dropdown.Item>
                                    <Dropdown.Item className="fw-bold">
                                        {id!=appointmentLogin.id?
                                                <a onClick={() => setShowNotification(true)} className="mt-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="icon icon-xs text-danger"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                                    <p className="ms-2 d-inline">Hủy lịch</p> 
                                                </a>
                                                :<></>
                                        }
                                    </Dropdown.Item>
                                </>
                                :<></>}
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
          <Table responsive className="appointment-table align-items-center table table-hover  ">
            <thead className="thead-light">
                <tr>
                <th className="border-bottom">STT</th>
                    <th className="border-bottom">Thời gian khám</th>
                    {(userLogin.code=="STAFF" || userLogin.code=="ADMIN")?
                    <th className="border-bottom">Bác sĩ</th>
                    :<></>}
                    <th className="border-bottom">{(userLogin.code=="STAFF" || userLogin.code=="ADMIN"||userLogin.code=="DOCTOR")?"Bệnh nhân":"Bác sĩ"}</th>
                    <th className="border-bottom">Tổng chi phí</th>
                    <th className="border-bottom">Trạng thái</th>
                    <th className="border-bottom">Thao tác</th>
                </tr>
            </thead>
            <tbody className="border-0  min-vh-50" >
              {dataShow.length>0 && dataShow.map((appointment,index) => 
              <TableRow key={`appointment-${appointment.id}`} {...appointment} index={index} handleVisible={handleVisible} setSaveSuccess={setSaveSuccess} setMessageAlert={setMessageAlert} />
              )}
            </tbody>
          </Table>
          <Panigation pageSize={pageSize} items={data} onChangePage={onChangePage}/>
        </Card.Body>
      </Card>
    );
  };