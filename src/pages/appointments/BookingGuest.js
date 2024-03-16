import React, { useEffect, useState } from "react";
import { Row, Col, Form, Alert, Modal,Card, Button,InputGroup } from '@themesberg/react-bootstrap';
import { faTrash, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import Util from "../../utils"
import moment from "moment-timezone";
import Datetime from "react-datetime";
import Doctor from "../../api/doctor"
import Appointment from "../../api/appointment"
import { useNavigate } from "react-router-dom";
import Guest from "../../api/guest";

export default function BookingGuest(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { guests,userLogin } = useSelector(state => {
    return {
        guests:  state.guest.guests.data,
        userLogin: state.user.userLogin
    }
  })
  const {handleCloseBooking, isBooking, handleCloseShowDetail} = props
  const [doctor,setDoctor] = useState(Doctor.getDefault())
  const [appointments,setAppointments] = useState([])
  const [chosenService,setChosenService] = useState([])
  const [total,setTotal] = useState(0)
  const [dateAppointment, setDateAppointment] = useState(moment().format("YYYY-MM-DD"))
  const [timeAppointment,setTimeAppointment] = useState("")
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

  const save = ()=>{
    let passed = true
    let messageError= ""
    if(Util.isEmpty(timeAppointment))
    {
      passed = false;
      messageError= "Hãy chọn thời gian khám"
    }
    if(chosenService.length==0 && passed)
    {
      passed = false;
      messageError= "Hãy chọn dịch vụ khám bệnh"
    }
    if(passed)
    {
      let data = {
        doctor_id : doctor.id,
        status: 1,
        patient_id : guest.id,
        patient_type: 2,
        date: moment(dateAppointment).format("YYYY-MM-DD"),
        session_time:timeAppointment,
        service_amount : total,
        payment_amount : total,
        re_examine : 0,
        services: chosenService.map(item=>item)
      }
      Appointment.reExamine(data).then(result=>{
        console.log('result',result)
        if(result.result=="okie")
        {
          setMessageAlert('Đặt lịch khám bệnh cho khách thành công!')
          setSaveSuccess(true)
          handleVisible()
          window.scrollTo({ top: 0, left: 0, behavior: "auto" })
          setTimeout(()=>{
            handleCloseBooking()
          },2000)
          Appointment.getAppointments().then(data =>{
            if(data.result=="okie")
            {
              dispatch.appointment.setData(data.data)
              handleCloseBooking()
            }
            else
            {
              console.log("err_Appointments",data)
            }
          })
        }
      })
      setChosenService([])
      setDateAppointment(moment().format("YYYY-MM-DD"))
      setTimeAppointment("")
      // console.log("Đặt lịch")
    }
    else
    {
      setMessageAlert(messageError)
      handleVisible()
    }
    
  }
  const changeDoctor= async (val)=>{
    let newDoctor = doctors.find(item=>item.id==val)
    setDoctor(newDoctor)
    console.log("doctor",newDoctor)
  }
  useEffect(()=>{
    updateAppointmentDate()
  },[doctor])
  const changeDate = async (value)=>{
    let val = Util.isDateBeforeToday(value) ? moment().format("YYYY-MM-DD") : value;
    setDateAppointment(val)
    console.log(val)
    let day_of_week = getDayOfWeek(val)
    // console.log(day_of_week)
    console.log("doctor",doctor)
    let findIndex = doctor?.schedules_of_week?.findIndex(day=>day.day_of_week==day_of_week) 

    if(findIndex != -1)
    {
      let schedules_of_day = doctor.schedules_of_week[findIndex]
      console.log("schedules",schedules_of_day)
      // console.log("session_time",schedules_of_day.session_time)

      const session_times = schedules_of_day.session_time.split(";")
      // console.log("session_times",session_times)
      let newAppointments = []
      session_times?.forEach(session_time=>{
        if(session_time.includes("-"))
        {
          newAppointments = [...newAppointments,...Util.createAppointmentTimes(
            session_time.split("-")[0],
            session_time.split("-")[1],
            doctor.session_meeting_time.toString(),
            doctor.session_gap.toString()
            )]
        }
      })
      // console.log("newAppointments",newAppointments)
      let timeBooked = []
      await Appointment.getAppointmentByDoctor({
        doctor_id:doctor.id,
        date:moment(val).format("YYYY-MM-DD")
      }).then(res=>{
        if(res.result=="okie")
        {
          timeBooked = res.data
        }
      })
      console.log("timebooked",timeBooked)
      console.log("before",newAppointments)
      if(timeBooked.length>0)
      {
        newAppointments = newAppointments.filter(item=>{
          console.log(item)
          let findIndex=timeBooked.findIndex(s=>s.session_time==item)
          console.log(findIndex)
          if(findIndex != -1) 
          {
            console.log("have")
            return false
          }
          return true
        })
      }
      console.log("after",newAppointments)
      setAppointments(newAppointments)
    }
  }
  const { services , doctors} = useSelector(state => {
    return {
      doctors:  state.doctor.doctors.data,
      services:  state.service.services.data,
    }
  })
  useEffect(()=>{
    setDoctor(doctors[0])
    setGuest(guests[0])
  },[])
  useEffect(()=>{
    updateAppointmentDate()
  },[dateAppointment])
 
  const updateAppointmentDate = async ()=>{
    console.log("dateAppointment",dateAppointment)
    let day_of_week = getDayOfWeek(dateAppointment)
    console.log(day_of_week)
    console.log("doctor_",doctor)
    
    let findIndex = doctor?.schedules_of_week?.findIndex(day=>day.day_of_week==day_of_week) 

    if(findIndex != -1)
    {
      let schedules_of_day = doctor?.schedules_of_week[findIndex]

      const session_times = schedules_of_day?.session_time.split(";")
      // console.log("session_times",session_times)
      let newAppointments = []
      session_times?.forEach(session_time=>{
        if(session_time.includes("-"))
        {
          newAppointments = [...newAppointments,...Util.createAppointmentTimes(
            session_time.split("-")[0],
            session_time.split("-")[1],
            doctor?.session_meeting_time.toString(),
            doctor?.session_gap.toString()
            )]
        }
      })
      let timeBooked = []
      await Appointment.getAppointmentByDoctor({
        doctor_id:doctor?.id,
        date:moment(dateAppointment).format("YYYY-MM-DD")
      }).then(res=>{
        if(res.result=="okie")
        {
          timeBooked = res.data
        }
      })
      if(timeBooked.length>0)
      {
        newAppointments = newAppointments?.filter(item=>{
          console.log(item)
          let findIndex=timeBooked?.findIndex(s=>s.session_time==item)
          console.log(findIndex)
          if(findIndex != -1) 
          {
            return false
          }
          return true
        })
      }
      setAppointments(newAppointments)
    }
  }
  
  const removeService= (id)=>{
    setChosenService(prevState=>{
        let newChosenService = [...prevState]
        newChosenService = newChosenService.filter(item=>item.id != id)
        return [
            ...newChosenService
        ]
    })
  }
  const chooseService= (id)=>{
    console.log(id)
    let findIndex = chosenService.findIndex(item=>item.id==id)
    if(findIndex != -1) return
    else
    {
        let newService = services.filter(item=>item.id == id)[0]
        let newChosenService = [...chosenService]
        newChosenService.push(newService)
        setChosenService(newChosenService)
    }
  }
  useEffect(()=>{
    let newTotal = 0
    chosenService.forEach(item=>{
        newTotal+= parseInt(item.charge)
    })
    setTotal(newTotal)
  },[chosenService])
  // console.log("user",userLogin)
  // console.log("isLogin",isLogin)
  // console.log("doctors",doctors)
  
  function getDayOfWeek(dateString) {
    const daysOfWeek = [1,2,3,4,5,6,7];
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return daysOfWeek[dayOfWeek];
  }
  const changeGuest= (id)=>{
      console.log(id)
      let _guest = guests.find(item=>item.id == id)
      setGuest(_guest)
  }
  const [guest,setGuest] = useState(Guest.getDefault())
  return (
    <>
    <Modal scrollable centered size="lg" show={isBooking} className="modal-secondary" onHide={handleCloseBooking}>
            <Modal.Header>
            <Modal.Title>
                <p className="mb-0 pe-3 pe-md-0">
                    Đặt lịch khám bệnh
                </p>
                {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"} className="mt-2 fs-6">
                        {messageAlert}
                    </Alert>
                :<></>
                }
            </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleCloseBooking} />
            </Modal.Header>
            <Modal.Body >
                <Card border="light" className="px-0 px-md-2 py-0 border-0" style={{width:"100%"}}>
                <Card.Body>
                <Form>
                        <Row>
                            <Col md={6} className="mb-3">
                            <Row className="mb-3">
                              <Form.Group id="id_guest">
                                <Form.Label>Khách *</Form.Label>
                                  <Form.Select value={guest?.id} onChange={e=>changeGuest(e.target.value)}>
                                    {
                                      guests.map(item=>{
                                        return  <option value={item.id}>{item.full_name}</option>
                                      })
                                    }
                                </Form.Select>
                              </Form.Group>
                            </Row>
                            </Col>
                            <Col md={6} className="mb-3">
                            <Form.Group id="status">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control value={guest?.phone} disabled
                                    required type="text" />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                            <Row className="mb-3">
                                <Form.Group id="doctor">
                                <Form.Label>Bác sĩ *</Form.Label>
                                <Form.Select id="doctor"  onChange={e=>changeDoctor(e.target.value)}>
                                    {doctors?.map(doctor=>{
                                        return <option value={doctor.id}>{doctor.full_name}</option>
                                    })
                                    }
                                </Form.Select>
                                </Form.Group>
                            </Row>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group id="date">
                                    <Form.Label>Ngày khám bệnh *</Form.Label>
                                    <Datetime
                                    timeFormat={false}
                                    onChange={e=>changeDate(e._d)}
                                    renderInput={(props, openCalendar) => (
                                        <InputGroup>
                                        <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                        <Form.Control
                                            // required
                                            type="text"
                                            value={dateAppointment ? moment(dateAppointment).format("YYYY-MM-DD") : ""}
                                            placeholder="yyyy-mm-dd"
                                            onFocus={openCalendar}
                                            onChange={() => {}} />
                                        </InputGroup>
                                    )} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Label>Thời gian khám *</Form.Label>
                          <Row className="mb-3 ">
                              
                              {appointments.length==0?
                              <div className="ms-3 mt-2">
                                Không có thời gian khám phù hợp, vui lòng chọn lại bác sĩ hoặc ngày khám bệnh
                              </div>:
                              <>
                                {appointments?.map(item=>{
                                    return (
                                      <Col md={3}>
                                        <Button onClick={()=>setTimeAppointment(item)} variant="secondary" className={`me-2 mb-2 ${timeAppointment==item?"":"bg-gray-500"} `}>
                                          {item}
                                        </Button>
                                      </Col>
                                    )
                                  })
                                  }
                              </>
                              }
                          </Row>
                        </Form>
                        <Row className="mb-3">
                        <Col md={8}>
                            <Form.Group id="services">
                            <Form.Label>Dịch vụ khám bệnh *</Form.Label>
                            <Form.Select id="services"  onChange={e=>chooseService(e.target.value)}>
                                {services?.map(service=>{
                                    return <option value={service.id}>{service.name}</option>
                                })
                                }
                            </Form.Select>
                            </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={10}>
                              <Row className="w-100">
                                <Col md={6}>
                                Tên dịch vụ
                                </Col>
                                <Col md={3}>
                                Giá dịch vụ
                                </Col>
                                <Col md={3}>
                                </Col>
                              </Row>
                              {chosenService.map(item=>{
                                return(
                                    <Row className="w-100 mt-2">
                                        <Col md={6}>
                                        {item.name}
                                        </Col>
                                        <Col md={3}>
                                        {Util.formatNumber(item.charge)} VNĐ
                                        </Col>
                                        <Col md={3}>
                                        <FontAwesomeIcon onClick={()=>removeService(item.id)} icon={faTrash} className="me-2" />
                                        </Col>
                                    </Row>
                                )
                              })
                              }
                             
                              <Row className="w-100 mt-2" style={{marginLeft:"1px",height:"1px",backgroundColor:"gray"}}></Row>
                              <Row className="w-100 mt-2">
                                <Col md={6}>
                                Tổng phí dịch vụ
                                </Col>
                                <Col md={3}>
                                    {Util.formatNumber(total)} VNĐ
                                </Col>
                                <Col md={3}>
                                </Col>
                              </Row>
                            </Col>

                            <Col md={2}></Col>
                        </Row>
                </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={()=>save()} variant="secondary" className="me-2 lightBg">Xác nhận đặt lịch</Button>
              <Button onClick={()=>handleCloseBooking()} variant="secondary " className="lightBg">Thoát</Button>
            </Modal.Footer>
        </Modal>
      
    </>
  );
}


