
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH,  faEye,  faLock,faPlusCircle,faMinusSquare,faEdit, faCircle, faMoneyCheckAlt, faMoneyCheck, faSpinner, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Dropdown,Alert, Modal,Button, Form ,Row,Col} from '@themesberg/react-bootstrap';
import { Panigation } from "../../../../components/Panigation";
import Util from "../../../../utils"
import { json, useNavigate } from "react-router-dom";
import { Routes } from '../../../../routes'
import { useDispatch, useSelector } from "react-redux";
import avatarDefault from '../../../../assets/img/avatar_default.jpg'
import Detail from './appointmentDetail'
import Rating from 'react-rating-stars-component';
import Review from "../../../../api/review";

export const AppointmentTable = (props) => {
    const { userLogin } = useSelector(state => {
        return {
            userLogin:  state.user.userLogin,
        }
    })
  const dispatch = useDispatch()
   
   const { data, pageSize } = props
    const TableRow = (props) => {
      const { index, id, re_examine,parent_id,payment_amount, status,date,session_time,
        doctor_avatar,doctor_email,doctor_fullName,doctor_id,children_id,review,
        patient_avatar,patient_email,patient_fullName,patient_id,patient_type,patient_phone
        } = props 
      let classTextStatus=status==1?"text-success":(status==2?"text-danger":(status==3?"text-warning":"text-info"))
      let textStatus = status==1?"Đã đặt lịch":(status==2?"Đã hủy lịch":(status==3?"Đã khám bệnh":"Đã thanh toán"))
     const [detailReview,setDetailReview] = useState({})
    const toggle = async ()=>{
        if(review === 1)
        {
            await Review.getReviewByAppointment(id).then(res=>{
                if(res.result == "okie")
                {
                    setDetailReview(res.data)
                }
            })
        } 
        setShow(prev=>!prev)
    }
    const [show,setShow] = useState(false);
    const submitRating = async () =>{
        let data_review = {
            appointment_id : id , 
            patient_id: userLogin.id,
            doctor_id: doctor_id, 
            star_rating: rating, 
            review_text: comment
        }
        await Review.addReview(data_review).then(async res => {
            if(res.result == "okie")
            {
                setShowRate(false)
                setComment("")
                setRating(5)
                let newData = JSON.parse(JSON.stringify(data))
                newData.forEach(item=>{
                    if(item.id == id)
                    {
                        item.review = 1
                    }
                })
                dispatch.appointment.setData(newData)
            }
        })
    }
    const [comment,setComment] = useState("")
    const [rating, setRating] = useState(5);
    const [showRate,setShowRate]  = useState(false);
    const handleClose = () => {
        setShowRate(false)
    }
    const handleChange = (newRating) => {
        setRating(newRating);
    };
    
   
    return (
        <>
        <Modal centered show={showRate} className="modal-secondary" onHide={handleClose}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleClose} />
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <Modal.Title className="h4 mb-3">Đánh giá bác sĩ</Modal.Title>
                    <p className="h6 my-1">{doctor_fullName}</p>
                </div>
                <Form.Group id="full_name">
                        <Form.Label>Đánh giá</Form.Label>
                        <Form.Control
                            value={comment}
                            onChange={e=>setComment(e.target.value)}
                            required as="textarea" rows="3" type="text" placeholder="Hãy chia sẻ những nhận xét của bạn về bác sĩ nhé!" />
                </Form.Group>
                <div className="ms-1">
                    <Rating
                        count={5}
                        value={rating}
                        onChange={handleChange}
                        size={40} // Adjust the size of the stars
                        activeColor="#FFD700" // Custom star color (in this case, yellow)
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>submitRating()}>Đánh giá</Button>
            <Button variant="white" size="sm" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        <tr className="border-bottom" >
              <td onClick={()=>toggle(id)}>
              <a className="d-flex align-items-center card-link">
                      <div className="d-block">
                          <span className="fw-bold">{index+1}</span>
                      </div>
                  </a>
            
              </td>
              <td onClick={()=>toggle(id)}>
                    <div className="d-block align-items-start">
                        <span className="row ">{session_time}</span>
                        <span className="row">{Util.formatDate(date)}</span>
                        {re_examine == 1 ? <span className="row text-secondary">Cần tái khám</span>:<></>}
                        {!Util.isEmpty(parent_id)?<><span className=" row text-secondary">Lịch tái khám</span></>:<></>}
                        {(patient_type == 1 & ( status == 3 || status == 4) && review == 0)?
                        <><span className=" row text-secondary">Chưa đánh giá</span></>
                        :<></>
                        }

                    </div>
              </td>
              {userLogin.code=="DOCTOR"?<></>:
              <td onClick={()=>toggle()}>
                  <a className="d-flex align-items-center" onClick={()=>{}}>
                      <img src={Util.isEmpty(doctor_avatar)? avatarDefault :doctor_avatar} className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="row">{doctor_fullName}</span>
                          <span className="row">{doctor_email}</span>

                      </div>
                  </a>
              </td>
              }
              <td onClick={()=>toggle()}><span className="fw-normal">{Util.formatNumber(payment_amount)} VNĐ</span></td>
              <td onClick={()=>toggle()}>
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
                              <Dropdown.Item onClick={()=>toggle()} className="fw-bold">
                                <FontAwesomeIcon icon={faEye} className="me-2"/> Xem chi tiết</Dropdown.Item>
                                {(patient_type == 1 && ( status == 3 || status == 4 ) && review == 0)?
                                <Dropdown.Item onClick={()=>setShowRate(true)} className="fw-bold">
                                <FontAwesomeIcon icon={faMoneyCheck} className="me-2"/> Đánh giá</Dropdown.Item>
                                :<></>}
                          </Dropdown.Menu>
                      </Dropdown> 
                  </div>
              </td>
        </tr>
        {show?
        <tr className="border-bottom">
            <td colSpan={6}>
                <Detail detailReview={detailReview} setShow={setShow} _appointment={props} />
            </td>
        </tr>
        :<></>}
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
        <>
        
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
      </>
    );
  };