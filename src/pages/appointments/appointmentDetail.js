
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup,Alert ,Image } from '@themesberg/react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Routes } from "../../routes";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Appointment  from "../../api/appointment"
import Util from "../../utils"
import Review from "../../api/review";
import Rating from 'react-rating-stars-component';

export default () => {

    const { appointments} = useSelector(state => {
        return {
            appointments:  state.appointment.appointments.data,
        }
    })
    const navigate = useNavigate()
    const {state} = useLocation()
    const { appointment } = state
    const { id } = appointment
    console.log("State",state)
    const [_appointment, setAppointment] = useState(Appointment.getDefault())
    const [detailReview,setDetailReview] = useState({})
    useEffect(() => {
        if(id==0)
        {
            console.log("create new")
        }
        else
        {
            let detailAppointment= appointments.find(item=>item.id==id)
            console.log("detailAppointment",detailAppointment)
            setAppointment(detailAppointment)
        }
    },[]);
   
    
    const {  payment_amount, status,date,session_time,cancel_reason,examination_info,service_amount,
        payment_fee,fee_info,payment_date,services,medicines,children_id,images,
        doctor_avatar,doctor_email,doctor_fullName,doctor_id, payment_user_name,payment_user_email,
        patient_avatar,patient_email,patient_fullName,patient_id,patient_type,patient_phone,review
     } = _appointment
    
    const exit=()=>{
        navigate(Routes.AppointmentsList.path)
    }
    useEffect(()=>{
        async function fetchData() {
            await Review.getReviewByAppointment(id).then(res=>{
                if(res.result == "okie")
                {
                    setDetailReview(res.data)
                }
            })
          }
        fetchData();
    },[_appointment])
    
    console.log("appointments",_appointment)
    // console.log("images",images)

    let patient_info = (patient_type == 1 )? patient_email : patient_phone
    let payment_info = status==4 ? payment_user_name + " (" + payment_user_email + ") - " + Util.FormatDate(payment_date) : ""
    let showImages = Util.isEmpty(images) ? [] : images?.split(";")
    // console.log("showImages",showImages)
    console.log("payment_date",payment_date)
    let _patient_info = Util.isEmpty(patient_info) ? patient_fullName + " (" + patient_phone + ")" : patient_fullName + " (" + patient_info + ")"
    
    let classTextStatus=status==1?"text-success":(status==2?"text-danger":(status==3?"text-warning":"text-info"))

  return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.AppointmentsList.path,{replace:true})}>Quản lý lịch khám</Breadcrumb.Item>
                    <Breadcrumb.Item active>Xem chi tiết</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>
       <Row>
           <Col xs={12} xl={12}>
               <Card border="light" className="bg-white shadow-sm mb-4">
                   <Card.Body>
                       <Form>
                        <Row  className="mb-4">
                            <Col>
                                 <h5>Thông tin chung</h5>
                            </Col>
                            <Col>
                                <Row className="justify-content-end">
                                    <Col >
                                        
                                    </Col>
                                    
                                    <Col>
                                       
                                    </Col>

                                    <Col>
                                        <Row>
                                            <Col md={1}>
                                            <FontAwesomeIcon className={`${classTextStatus}`}  icon={faCircle}></FontAwesomeIcon>
                                            </Col>
                                            <Col>
                                            {status==2?"Đã hủy":(status==4?"Đã thanh toán":(status==1?"Đã đặt lịch":"Đã khám"))}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                       <Row  className="mb-3">
                        <Col md={6}>
                            <Form.Group id="">
                                <Form.Label>Thời gian khám</Form.Label>
                                <Form.Control
                                    value={session_time +", "+ Util.formatDate(date)} 
                                    required type="text"
                                    disabled={true}
                                    />
                           </Form.Group>
                        </Col>
                        <Col md={6}>
                                {status==2?<>
                                    <Form.Group id="full_name">
                                <Form.Label>Lý do</Form.Label>
                                <Form.Control
                                    disabled={true}
                                    value={cancel_reason} 
                                    required type="text"/>
                           </Form.Group>
                                </>:
                                <></>}
                                {status==4?<>
                                    <Form.Group id="">
                                <Form.Label>Xác nhận thanh toán</Form.Label>
                                <Form.Control
                                    disabled={true}
                                    value={payment_info} 
                                    required type="text"/>
                           </Form.Group>
                                </>:
                                <></>}
                        </Col>
                       </Row>
                       <Row className="mb-3">
                           <Col md={6} className="mb-3">
                                <Form.Group id="">
                                        <Form.Label>Bác sĩ</Form.Label>
                                        <Form.Control
                                            disabled={true}
                                            value={doctor_fullName + " (" + doctor_email + ")"} 
                                            required type="text"/>
                                </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                                <Form.Group id="">
                                    <Form.Label>Bệnh nhân</Form.Label>
                                    <Form.Control
                                        disabled={true}
                                        value={_patient_info} 
                                        required type="text"/>
                                </Form.Group>
                           </Col>
                       </Row>
                       <Row className="mb-3">
                            <Col md={6} className="mb-3">
                                        <Form.Group id="">
                                            <Form.Label>Dịch vụ khám bệnh</Form.Label>
                                            <div className="border border-dark p-3 ps-5">
                                            <Row className="mb-2">
                                                <Col md={8}>
                                                    Tên dịch vụ
                                                </Col>
                                                <Col md={4}>
                                                    Giá dịch vụ
                                                </Col>
                                            </Row>
                                            {services?.map(item=>{
                                                return (
                                                    <Row key={item.id} className="mb-2">
                                                        <Col md={8}>
                                                            {item.name}
                                                        </Col>
                                                        <Col md={4}>
                                                            {Util.formatNumber(item.charge)} VNĐ
                                                        </Col>
                                                    </Row>
                                                )
                                            })}
                                            <div className="my-2" style={{height:"1px",backgroundColor:"gray"}}></div>
                                            <Row>
                                                <Col md={8}>
                                                    Tổng phí dịch vụ
                                                </Col>
                                                <Col md={4}>
                                                    {Util.formatNumber(service_amount)} VNĐ
                                                </Col>
                                            </Row>
                                            </div>

                                        </Form.Group>   
                            </Col>
                                <Col md={6} className="mb-3 ">
                                    <Row>
                                        {Util.isEmpty(payment_fee)?<></>: 
                                            <Form.Group id="">
                                            <Form.Label>Phụ phí</Form.Label>
                                                <Row className="mb-3">
                                                    <Col md={8}>
                                                        Thông tin phụ phí
                                                    </Col>
                                                    <Col md={4}>
                                                    Phụ phí
                                                    </Col>
                                                    <Col md={8}>
                                                        {fee_info}
                                                    </Col>
                                                    <Col md={4}>
                                                        {Util.formatNumber(payment_fee)} VNĐ
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        }
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group id="">
                                            <Form.Label>Tổng chi phí</Form.Label>
                                            <Form.Control
                                                disabled={true}
                                                value={Util.formatNumber(payment_amount) +" VNĐ"} 
                                                required type="text"/>
                                        </Form.Group>
                                    </Row>
                                </Col>
                            </Row>

                        {(status ==3 || status ==4)?
                        <>
                       <h5 className="mb-4">Chi tiết khám bệnh</h5>
                       <Row className="mb-3">
                            <Form.Group id="">
                                <Form.Label>Thông tin khám bệnh</Form.Label>
                                <Form.Control
                                    disabled={true}
                                    value={examination_info} 
                                    required type="text"/>
                            </Form.Group>
                       </Row>
                       <Row className="mb-3">
                            <Form.Group id="">
                                <Form.Label>Ảnh khám bệnh</Form.Label>
                                <Row>

                                {showImages?.map(item=>{
                                    return(
                                    <Col md={3}>
                                        <img className="img-fluid img-thumbnail" src={item} />
                                    </Col>
                                    )
                                })}
                                </Row>
                            </Form.Group>
                       </Row>
                       {medicines?.length>0?
                       <Row className="mb-3">
                            <Form.Group id="">
                                <div className="border border-dark p-3 ps-5">
                                <Form.Label>Đơn thuốc</Form.Label>
                                <Row className="mb-2">
                                    <Col md={4}>Tên thuốc</Col>
                                    <Col md={4}>Đơn vị thuốc</Col>
                                    <Col md={4}>Cách dùng</Col>
                                </Row>
                                {medicines?.map(item=>{
                                    return (
                                        <Row className="mb-2">
                                        <Col md={4}>
                                            <Row>
                                                <Col md={3}>
                                                <img src={item.image} className="img-fluid img-thumbnail"/>
                                                </Col>
                                                <Col>
                                                {item.name}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={4}>{item.unit}</Col>
                                        <Col md={4}>{item.usage}</Col>
                                    </Row>
                                    )
                                })}
                                </div>
                            </Form.Group>
                       </Row>:<></>}
                       </>:<></>}   
                       {(review == 1 && !Util.isEmpty(detailReview.star_rating)) ? 
                            <Row className="mb-4">
                                    <h5>Đánh giá bác sĩ</h5>
                                    <div className="ms-3">
                                    <div style={{height:"1px",backgroundColor:"black",opacity:0.3,width:"30%",marginTop:"10px"}}>
                                    </div>
                                    <div className="my-2">
                                    {Util.FormatDate(detailReview.created_date)}
                                    </div>
                                    <div>
                                        <Rating
                                            count={5}
                                            value={detailReview.star_rating}
                                            size={21} // Adjust the size of the stars
                                            activeColor="#FFD700" // Custom star color (in this case, yellow)
                                        />
                                    </div>
                                    <div className="my-2">
                                        {detailReview.review_text}
                                    </div>
                                    </div>
                                </Row>
                       :
                       <></>}    
                       <div className="mt-3">
                           <Button onClick={()=>exit()} variant="primary" >Đóng</Button>
                       </div>
                       </Form>
                   </Card.Body>
               </Card>
           </Col>
       </Row>
    </>
  );
};
