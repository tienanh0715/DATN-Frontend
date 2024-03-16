
import React, { useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMinus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup,Alert , Image, Nav, Tab, Breadcrumb } from '@themesberg/react-bootstrap';
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Routes } from "../../routes";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Doctor  from "../../api/doctor"
import Util from "../../utils"
import { ChoosePhotoWidget } from "../../components/Widgets";
import { faMinusSquare } from "@fortawesome/free-regular-svg-icons";
import { faLaptopCode, faPalette } from "@fortawesome/free-solid-svg-icons";

export default () => {

    const { doctors} = useSelector(state => {
        return {
            doctors:  state.doctor.doctors.data,
        }
    })
    const navigate = useNavigate()
    const { state } = useLocation()
    const { doctor } = state
    const { id } = doctor
    const [_doctor, setDoctor] = useState(Doctor.getDefault())

    useEffect(() => {
        if(id==0)
        {
            console.log("create new")
        }
        else
        {
            let editDoctor= doctors.find(item=>item.id==id)
            setDoctor(editDoctor)
            setBirthday(new Date(editDoctor.date_of_birth))
            setPreview(editDoctor.avatar)
        }
    },[]);
    const [_birthday, setBirthday] = useState(moment().format("YYYY-MM-DD"))
    useEffect(()=>{
        setDoctor(prevState=>({...prevState,date_of_birth:moment(_birthday).format("YYYY-MM-DD")}))
    },[_birthday])
    console.log("date",_birthday)
    
    const changeProperty= (key,val)=>{
        console.log(key,val)
        setDoctor(prevState=> ({
            ...prevState,
            [key]:val
        }))
    }
    
    const {  full_name,password,email,phone,schedules_of_week,address,city,gender,session_meeting_time,session_gap,emergency_info,avatar,work_experience,experience_year , qualifications } = _doctor
    const addDoctor= async ()=>{
        let doctor = {
            work_experience:work_experience,
            experience_year:experience_year,
            full_name: full_name,
            date_of_birth: moment(_birthday).format("YYYY-MM-DD"),
            gender:gender,
            password: password,
            address: address,
            city: city,
            email:email,
            phone:phone,
            avatar: preview,
            qualifications:qualifications
        }
        let response = await Doctor.addDoctor(doctor)
          if(response.result=="okie") 
          {
            setSaveSuccess(true)
            setMessageAlert("Thêm mới thành công!")
            setTimeout(()=>{
                navigate(Routes.DoctorsList.path)
            },1500)
          }
          else
          {
            setMessageAlert("Thêm mới thất bại! Lý do: " + response.message)
          }
          handleVisible()
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

    const updateDoctor = async ()=>{
        // console.log("_doctor",_doctor)
        let _Edit_Doctor= {..._doctor}
        _Edit_Doctor.avatar = preview
        let res = await Doctor.editDoctor(_Edit_Doctor)
        if(res.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Cập nhật thành công!")
        }
        else
        {
            setMessageAlert("Cập nhật thất bại! Lý do: " + res.message)
        }
        handleVisible()
    }
    const exit=()=>{
        navigate(Routes.DoctorsList.path)
    }
    
    // console.log("doctorGroups",doctorGroups)
    console.log("doctors",_doctor)


    const validate = ()=>{
        let passed = true
        let messageError= ""
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if( Util.isEmpty(full_name) )
        {
            passed = false
            messageError = "Bạn hãy nhập họ và tên"
        }
        if(!email.match(validRegex) && passed) 
        {
            passed = false
            messageError = "Bạn hãy nhập email"
        } 

        if(qualifications.length >= 1) 
        {
            qualifications.forEach(element => {
                if(element.degree == "" )
                {
                    passed = false
                    messageError = "Bạn hãy nhập bằng cấp"
                }
                if(element.specialition == "" && passed)
                {
                    passed = false
                    messageError = "Bạn hãy nhập chuyên môn"
                }
                if(element.university == "" && passed)
                {
                    passed = false
                    messageError = "Bạn hãy nhập trường đại học/ cao học"
                }
                if(element.year == "" && passed)
                {
                    passed = false
                    messageError = "Bạn hãy nhập năm tốt nghiệp"
                }
            });
        } 

        if(id==0 && password.length < 6 && passed)
        {
            passed = false
            messageError = "Bạn hãy nhập mật khẩu lớn hơn 6 ký tự"
        }
       
        if(Util.isEmpty(file) && Util.isEmpty(avatar) && passed) 
        {
            passed = false
            messageError = "Bạn hãy chọn ảnh"
        } 
        if(!passed) 
        {
            setMessageAlert(messageError)
            handleVisible()
        }
        return passed
    }

    const save = async (e) =>{
        if(validate())
        {
            if(id==0)
            {
                await addDoctor()
            }
            else
            {
                await updateDoctor()
            }
        }
        else
        {
            e.preventDefault()
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }

    const [file, setFile] = useState(null);

    useEffect(() => {
      console.log("File has been set.",file)
    },[file]);
    // On file select (from the pop up)

    const [preview, setPreview] = useState(null);

    const onFileChange = (key,e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile.type.split('/')[0] === 'image') {
            // The selected file is an image
            // Do something with the file here
            let nameFile = e.target?.files[0].name
            console.log("filename",nameFile)
            setDoctor(prevState=> ({
                ...prevState,
                [key]: e.target?.value
            }))
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            }
            reader.readAsDataURL(selectedFile);
        } else {
            // The selected file is not an image
            alert('Please select an image file');
        }
        console.log("image",avatar)
      };
    const handleAddQualification = ()=>{
        console.log("add qualification")
        let newqualifications = [...qualifications]
        newqualifications.push({
            id: Util.generateRandomId(),
            degree:"",
            university:"",
            year:"",
            specialization:""
        })
        setDoctor(prevState=> ({
            ...prevState,
            qualifications:newqualifications
        }))
    }
    const handleDelete = (id)=>{
        console.log("delete qualification")
        let newqualifications = qualifications.filter(item=>item.id!=id)
        setDoctor(prevState=> ({
            ...prevState,
            qualifications:newqualifications
        }))
    }

    const changePropertyQualification= (key,val,id)=>{
        let newqualifications = qualifications.map(item=>{
            if(item.id==id)
            {
                return {
                    ...item,
                    [key]:val
                }
            }
            else return item
        })

        setDoctor(prevState=> ({
            ...prevState,
            qualifications:newqualifications
        }))
    }

    const timeSession1 = [
        "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00",
        "10:30", "11:00", "11:30", "12:00"
    ];
    const timeSession2 = [
        "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
        "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];
    const default_days_of_week = [
        {
            id : 0,
            day_of_week:2, 
            status:1,
            name:"Thứ hai",
            session_time: [
                {
                    session_gap:1,
                    status:0,
                    startTime:"07:00",
                    startTimes: [],
                    endTime:"12:00",
                    endTimes:[]
                },
                {
                    session_gap:2,
                    status:0,
                    startTime:"13:00",
                    startTimes: [],
                    endTime:"17:30",
                    endTimes:[]
                },
            ]
        },
        {
            id : 0,
            day_of_week:3, 
            status:0,
            name:"Thứ ba",
            session_time: [
                {
                    session_gap:1,
                    status:0,
                    startTime:"07:00",
                    startTimes: [],
                    endTime:"12:00",
                    endTimes:[]
                },
                {
                    session_gap:2,
                    status:0,
                    startTime:"13:00",
                    startTimes: [],
                    endTime:"17:30",
                    endTimes:[]
                },
            ]
        },
        {
            id : 0,
            day_of_week:4, 
            status:0,
            name:"Thứ tư",
            session_time: [
                {
                    session_gap:1,
                    status:0,
                    startTime:"07:00",
                    startTimes: [],
                    endTime:"12:00",
                    endTimes:[]
                },
                {
                    session_gap:2,
                    status:0,
                    startTime:"13:00",
                    startTimes: [],
                    endTime:"17:30",
                    endTimes:[]
                },
            ]
        },
        {
            id : 0,
            day_of_week:5, 
            status:0,
            name:"Thứ năm",
            session_time: [
                {
                    session_gap:1,
                    status:0,
                    startTime:"07:00",
                    startTimes: [],
                    endTime:"12:00",
                    endTimes:[]
                },
                {
                    session_gap:2,
                    status:0,
                    startTime:"13:00",
                    startTimes: [],
                    endTime:"17:30",
                    endTimes:[]
                },
            ]
        },
        {
            id : 0,
            day_of_week:6, 
            status:0,
            name:"Thứ sáu",
            session_time: [
                {
                    session_gap:1,
                    status:0,
                    startTime:"07:00",
                    startTimes: [],
                    endTime:"12:00",
                    endTimes:[]
                },
                {
                    session_gap:2,
                    status:0,
                    startTime:"13:00",
                    startTimes: [],
                    endTime:"17:30",
                    endTimes:[]
                },
            ]
        },
        {
            id : 0,
            day_of_week:7, 
            status:0,
            name:"Thứ bảy",
            session_time: [
                {
                    session_gap:1,
                    status:0,
                    startTime:"07:00",
                    startTimes: [],
                    endTime:"12:00",
                    endTimes:[]
                },
                {
                    session_gap:2,
                    status:0,
                    startTime:"13:00",
                    startTimes: [],
                    endTime:"17:30",
                    endTimes:[]
                },
            ]
        },
        {
            id : 0,
            day_of_week:1, 
            status:0,
            name:"Chủ nhật",
            session_time: [
                {
                    session_gap:1,
                    status:0,
                    startTime:"07:00",
                    startTimes: [],
                    endTime:"12:00",
                    endTimes:[]
                },
                {
                    session_gap:2,
                    status:0,
                    startTime:"13:00",
                    startTimes: [],
                    endTime:"17:30",
                    endTimes:[]
                },
            ]
        },
    ]

    const [ days_of_week, setDaysOfWeek] = useState(default_days_of_week);
    useEffect(()=>{
        setDaysOfWeek(prev=>{
            let newDays_of_week = [...prev]
            if(schedules_of_week.length>0)
            {
                console.log("update days_of_week")
                newDays_of_week.forEach(item=>{
                    let schedule = schedules_of_week.find(s=>s.day_of_week == item.day_of_week)
                    const { id , session_time , status } = schedule
                    const session_times = session_time.split(";")
                    let newSession_Time = []
                    let session_gap = 1
                    session_times.forEach(t=>{
                        let isActive = t.includes("-")
                        if(isActive)
                        {
                            const times = t.split("-")
                            let startTime = times[0]
                            let endTime = times[1]
                            newSession_Time.push({
                                session_gap:session_gap,
                                status:1,
                                startTime:startTime,
                                startTimes: [],
                                endTime:endTime,
                                endTimes:[]
                            })
                        }
                        else
                        {
                            const times = t.split("+")
                            let startTime = times[0]
                            let endTime = times[1]
                            newSession_Time.push({
                                session_gap:session_gap,
                                status:0,
                                startTime:startTime,
                                startTimes: [],
                                endTime:endTime,
                                endTimes:[]
                            })
                        }
                        session_gap++
                    }) 
                    item.status = status
                    item.id= id
                    item.session_time = newSession_Time
                })
            }
            else
            {
                console.log("no")
            }
            newDays_of_week = [...newDays_of_week].map(item=>{
                
                let newSession_Time = [...item.session_time].map(item_session_time=>{
                    if(item_session_time.session_gap==2)
                    {
                       return {
                        ...item_session_time,
                        startTimes:filterTimesAfter(item.session_time[item.session_time.findIndex(i=>i.session_gap==1)].endTime,timeSession2),
                        endTimes:filterTimesAfter(item_session_time.startTime,timeSession2)}
                    }
                    return {...item_session_time,startTimes:timeSession1,endTimes:filterTimesAfter(item_session_time.startTime,timeSession1)}
                })
                return {...item,session_time:newSession_Time}
            })
           
        return newDays_of_week
    })
    },[schedules_of_week])
    
    function filterTimesAfter(startTime, times) {
        const [hour, minute] = startTime.split(":").map(Number);
        const _startTime = new Date();
        _startTime.setHours(hour);
        _startTime.setMinutes(minute);
        const filteredTimes = times.filter((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const date = new Date();
          date.setHours(hours);
          date.setMinutes(minutes);
          return date > _startTime;
        });
        return filteredTimes;
      }
    
   const handleCheckDay = (day_of_week)=>{
        setDaysOfWeek(prev=>{
                let newDays_of_week = [...prev].map(item=>{
                    if(item.day_of_week==day_of_week)
                    {
                        return {...item,status:!item.status}
                    }
                    return item
                })
            return newDays_of_week
        })
   }
    const handleChangeStartTime = (day_of_week,session_gap,val) => {
        setDaysOfWeek(prev=>{
                let newDays_of_week = [...prev].map(item=>{
                    if(item.day_of_week==day_of_week)
                    {
                        let newSession_Time = [...item.session_time].map(item_session_time=>{
                            if(item_session_time.session_gap==session_gap)
                            {
                                return {...item_session_time,startTime:val,endTimes:filterTimesAfter(val,session_gap==1?timeSession1 :timeSession2)}
                            }
                            return item_session_time
                        })
                        return {...item,session_time:newSession_Time}
                    }
                    return item
                })
            return newDays_of_week
        })
   }
   const handleChangeEndTime = (day_of_week,session_gap,val) => {
        setDaysOfWeek(prev=>{
                let newDays_of_week = [...prev].map(item=>{
                    if(item.day_of_week==day_of_week)
                    {
                        let newSession_Time = [...item.session_time].map(item_session_time=>{
                            if(item_session_time.session_gap==session_gap)
                            {
                                return {...item_session_time,endTime:val}
                            }
                            return item_session_time
                        })
                        if(session_gap==1)
                        {
                            newSession_Time = [...newSession_Time].map(_item_session_time=>{
                                if(item.session_gap==2)
                                {
                                    return {
                                        ..._item_session_time,
                                        startTimes:filterTimesAfter(newSession_Time[newSession_Time.findIndex(i=>i.session_gap==1)].endTime,timeSession1)
                                    }
                                }
                                return _item_session_time
                            })
                        }
                        return {...item,session_time:newSession_Time}
                    }
                    return item
                })
            return newDays_of_week
        })
    }
    const handleDeleteSessionTime = (day_of_week,session_gap)=>{
            setDaysOfWeek(prev=>{
                let newDays_of_week = [...prev].map(item=>{
                    if(item.day_of_week==day_of_week)
                    {
                        let newSession_Time = [...item.session_time].map(item_session_time=>{
                            if(item_session_time.session_gap==session_gap)
                            {
                                return {...item_session_time,status:!item_session_time.status}
                            }
                            return item_session_time
                        })
                        return {...item,session_time:newSession_Time}
                    }
                    return item
                })
            return newDays_of_week
            })
    }
    const handleAddSessionTime = (day_of_week)=>{
        setDaysOfWeek(prev=>{
            let newDays_of_week = [...prev].map(item=>{
                if(item.day_of_week==day_of_week)
                {
                    let noHaveSession = item.session_time.filter(item=>item.status==0).length==2
                    let newSession_Time = [...item.session_time].map(item_session_time=>{
                        if(noHaveSession)
                        {
                            if(item_session_time.session_gap==1)
                            {
                                return {...item_session_time,status:1}
                            }
                        }
                        else
                        {
                            return {...item_session_time,status:1}
                        }
                        return item_session_time
                    })
                    return {...item,session_time:newSession_Time}
                }
                return item
            })
        return newDays_of_week
        })
    }
    const saveSchedule = async () => {
        let passed = true
        let messageError =""
        if(Util.isEmpty(session_gap))
        {
            passed = false 
            messageError = "Bạn hãy chọn thời gian nghỉ"
        }
        if(Util.isEmpty(session_meeting_time) && passed)
        {
            passed = false 
            messageError = "Bạn hãy chọn thời gian khám"
        }
        if(passed) 
        {
            let data = {
                id: _doctor.id,
                session_meeting_time: session_meeting_time,
                session_gap:session_gap,
                days_of_week: days_of_week.map(day_of_week=>{
                    let newSession_Time = day_of_week.session_time.map(item=>{
                        if(item.status!=0 && day_of_week.status == 1)
                        {
                            return item.startTime + "-"+ item.endTime
                        }
                        else
                        {
                            return item.startTime + "+"+ item.endTime
                        }
                    })
                    return {...day_of_week,session_time:newSession_Time.join(";")}
                })
            }
            console.log("data",data)
            let res = await Doctor.updateSchedule(data)
            if(res.result == "okie")
            {
                setSaveSuccess(true)
                setMessageAlert("Cập nhật lịch khám bệnh thành công!")
            }
            else
            {
                setMessageAlert("Cập nhật thất bại! Lý do: " + res.message)
            }
            handleVisible()
            setTimeout(()=>{
                exit()
            },1500)
        }
        else
        {
            setMessageAlert(messageError)
            handleVisible()
        }
    }
    console.log(days_of_week)
    console.log("schedules_of_week",schedules_of_week)
    return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.DoctorsList.path,{replace:true})}>Quản lý bác sĩ</Breadcrumb.Item>
                    <Breadcrumb.Item active>{id==0 ?"Thêm bác sĩ":"Xem chi tiết"}</Breadcrumb.Item>
                </Breadcrumb>
                {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"}>
                        {messageAlert}
                    </Alert>
                :<></>
                }
            </div>
        </div>
        {_doctor.id == 0 ?
        <Row>
           <Col xs={12} xl={12}>
               <Card border="light" className="bg-white shadow-sm mb-4">
                   <Card.Body>
                       <Form>
                       <h5 className="mb-4">Thông tin chung</h5>
                       <Row  className="mb-3">
                           <Form.Group id="full_name">
                               <Form.Label>Họ và tên *</Form.Label>
                               <Form.Control
                                value={full_name} 
                                onChange={e=>{changeProperty("full_name",e.target.value)}} 
                                required type="text" placeholder="Nhập họ và tên" />
                           </Form.Group>
                       </Row>
                       <Row>
                           <Col md={6} className="mb-3">
                           <Form.Group id="email">
                               <Form.Label>Email *</Form.Label>
                               <Form.Control  value={email} 
                               onChange={e=>{changeProperty("email",e.target.value)}} required type="email" placeholder="Nhập email" />
                           </Form.Group>
                           
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="phone">
                               <Form.Label>Số điện thoại</Form.Label>
                               <Form.Control 
                               value={phone} 
                               onChange={e=>{changeProperty("phone",e.target.value)}} 
                               type="text" placeholder="Nhập số điện thoại" />
                           </Form.Group>
                           </Col>
                       </Row>
                       <Row>
                           <Col md={6} className="mb-3">
                           <Form.Group id="gender">
                               <Form.Label>Giới tính</Form.Label>
                               <Form.Select defaultValue={gender} onChange={e=>changeProperty("gender",e.target.value)}>
                               <option value="0">Nữ</option>
                               <option value="1">Nam</option>
                               </Form.Select>
                           </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="date_of_birth">
                               <Form.Label>Ngày sinh</Form.Label>
                               <Datetime
                               timeFormat={false}
                               onChange={setBirthday}
                               renderInput={(props, openCalendar) => (
                                   <InputGroup>
                                   <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                   <Form.Control
                                       // required
                                       type="text"
                                       value={_birthday ? moment(_birthday).format("YYYY-MM-DD") : ""}
                                       placeholder="yyyy-mm-dd"
                                       onFocus={openCalendar}
                                       onChange={() => {}} />
                                   </InputGroup>
                               )} />
                           </Form.Group>
                           </Col>
                       </Row>
                       <Row className="align-items-center">
                           <Col md={6} className="mb-3">
                           <Form.Group id="address">
                                   <Form.Label>Địa chỉ</Form.Label>
                                   <Form.Control value={address}
                                   onChange={e=>{changeProperty("address",e.target.value)}} 
                                   type="text" placeholder="Nhập địa chỉ" />
                               </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                                <Form.Group id="emergency_info">
                                   <Form.Label>Thông tin liên hệ khẩn cấp</Form.Label>
                                   <Form.Control value={emergency_info} 
                                   onChange={e=>{changeProperty("emergency_info",e.target.value)}} 
                                   type="text" placeholder="Nhập thông tin liên hệ khẩn cấp" />
                               </Form.Group>
                           </Col>
                       </Row>
                       <Row className="mb-3">
                           <Form.Group id="experience_year">
                               <Form.Label>Số năm kinh nghiệm</Form.Label>
                               <Form.Control
                                value={experience_year} 
                                onChange={e=>{changeProperty("experience_year",e.target.value)}} 
                                required type="text" placeholder="Nhập số năm kinh nghiệm" />
                           </Form.Group>
                       </Row>
                       <Row className="mb-3">
                           <Form.Group id="work_experience">
                               <Form.Label>Kinh nghiệm làm việc</Form.Label>
                               <Form.Control
                                value={work_experience} 
                                onChange={e=>{changeProperty("work_experience",e.target.value)}} 
                                required type="text" placeholder="Nhập kinh nghiệm làm việc" />
                           </Form.Group>
                       </Row>
                       <Row className="mb-3">
                            <Form.Group id="work_experience">
                               <Form.Label>Bằng cấp</Form.Label>
                            </Form.Group>
                            {qualifications.map((item,index)=>{
                                const { degree, specialization, university, year, id } = item
                                return (
                                    <Row key={index} className="ms-2 mt-2">
                                        <Col md={1} className="my-auto">
                                            {qualifications.length>1?
                                            <FontAwesomeIcon onClick={()=> handleDelete(id)} 
                                            className="ms-2 mt-4" 
                                            size="30" icon={faMinusSquare} 
                                            />:<></>}
                                        </Col>
                                        <Col >
                                            <Form.Group id="degree">
                                                <Form.Label>Bằng cấp *</Form.Label>
                                                <Form.Control
                                                    value={degree} 
                                                    onChange={e=>{changePropertyQualification("degree",e.target.value,id)}} 
                                                    required type="text" placeholder="Nhập bằng cấp" />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group id="specialization">
                                                <Form.Label>Chuyên ngành *</Form.Label>
                                                <Form.Control
                                                    value={specialization} 
                                                    onChange={e=>{changePropertyQualification("specialization",e.target.value,id)}} 
                                                    required type="text" placeholder="Nhập chuyên ngành" />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group id="university">
                                                <Form.Label>Đại học/ cao đẳng *</Form.Label>
                                                <Form.Control
                                                    value={university} 
                                                    onChange={e=>{changePropertyQualification("university",e.target.value,id)}} 
                                                    required type="text" placeholder="Nhập trường đại học/ cao đẳng" />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group id="year">
                                                <Form.Label>Năm tốt nghiệp *</Form.Label>
                                                <Form.Control
                                                    value={year} 
                                                    onChange={e=>{changePropertyQualification("year",e.target.value,id)}} 
                                                    required type="number" placeholder="Nhập năm tốt nghiệp" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )
                                })
                            }
                            <Row className="ms-2"  >
                                <Col md={1} className="my-auto">
                                    <FontAwesomeIcon onClick={()=>handleAddQualification()} 
                                    className="ms-2 mt-4" 
                                    size="30" icon={faPlusCircle} 
                                    />
                                </Col>
                                <Col md={11} className="mt-4" >
                                    <p onClick={()=>handleAddQualification()} >Thêm bằng cấp</p>
                                </Col>
                            </Row>
                       </Row>
                       <Row>
                           <Col sm={8} className="mb-3">
                           {(avatar || file)? 
                            <>
                                <Form.Group id="image">
                                <Form.Label>Ảnh đại diện *</Form.Label>
                                    <ChoosePhotoWidget 
                                        title="Chọn ảnh"
                                        photo={preview? preview: avatar}
                                        onFileChange = {onFileChange}
                                    />
                                </Form.Group>
                            </>
                            :
                            <>
                                {preview && <Image src={preview} alt="Preview" />}
                                <Form.Group id="image">
                                    <Form.Label>Chọn ảnh *</Form.Label>
                                    <Form.Control value={avatar} onChange={e=> onFileChange("avatar",e)} 
                                    accept="image/*" required type="file" placeholder="Nhập mô tả" />
                                </Form.Group>
                            </>
                            }
                           </Col>
                           <Col sm={4} className="mb-3">
                               <Form.Group id="password">
                                   <Form.Label>Mật khẩu *</Form.Label>
                                   <Form.Control value={password} onChange={e=> changeProperty("password",e.target.value)} required type="text" placeholder="Nhập mật khẩu" />
                               </Form.Group>
                           </Col>
                       </Row>
                       <div className="mt-3">
                           <Button onClick={(e)=>save(e)} variant="primary" className="me-2">Tạo mới</Button>
                           <Button onClick={()=>exit()} variant="primary" >Thoát</Button>
                       </div>
                       </Form>
                   </Card.Body>
               </Card>
           </Col>
       </Row>
        :
        <>
        <Tab.Container defaultActiveKey="info">
            <Row>
            <Col lg={12}>
                <Nav fill variant="pills" className="flex-column flex-sm-row">
                    <Nav.Item>
                        <Nav.Link eventKey="info" className="mb-sm-3 mb-md-0">
                            <FontAwesomeIcon icon={faUser} className="me-2" /> Thông tin chung
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="doctor_week_days" className="mb-sm-3 mb-md-0">
                            <FontAwesomeIcon icon={faLaptopCode} className="me-2" /> Lịch làm việc
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="info" className="py-2">
                        <Row>
                            <Col xs={12} xl={12}>
                                <Card border="light" className="bg-white shadow-sm mb-4">
                                    <Card.Body>
                                        <Form>
                                        <h5 className="mb-4">Thông tin chung</h5>
                                        <Row  className="mb-3">
                                            <Form.Group id="full_name">
                                                <Form.Label>Họ và tên </Form.Label>
                                                <Form.Control
                                                    value={full_name} 
                                                    disabled={true}
                                                    onChange={e=>{changeProperty("full_name",e.target.value)}} 
                                                    required type="text"/>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                            <Form.Group id="email">
                                                <Form.Label>Email </Form.Label>
                                                <Form.Control  value={email} 
                                                disabled={true}
                                                onChange={e=>{changeProperty("email",e.target.value)}} required type="email"  />
                                            </Form.Group>
                                            
                                            </Col>
                                            <Col md={6} className="mb-3">
                                            <Form.Group id="phone">
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control 
                                                value={phone} 
                                                disabled={true}
                                                onChange={e=>{changeProperty("phone",e.target.value)}} 
                                                type="text" />
                                            </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                            <Form.Group id="gender">
                                                <Form.Label>Giới tính</Form.Label>
                                                <Form.Select defaultValue={gender} disabled={true} onChange={e=>changeProperty("gender",e.target.value)}>
                                                <option value="0">Nữ</option>
                                                <option value="1">Nam</option>
                                                </Form.Select>
                                            </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                            <Form.Group id="date_of_birth">
                                                <Form.Label>Ngày sinh</Form.Label>
                                                <Datetime
                                                timeFormat={false}
                                                onChange={setBirthday}
                                                disabled={true}
                                                renderInput={(props, openCalendar) => (
                                                    <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                                    <Form.Control
                                                        disabled={true}
                                                        type="text"
                                                        value={_birthday ? moment(_birthday).format("YYYY-MM-DD") : ""}
                                                        placeholder="yyyy-mm-dd"
                                                        onFocus={openCalendar}
                                                        onChange={() => {}} />
                                                    </InputGroup>
                                                )} />
                                            </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="align-items-center">
                                            <Col md={6} className="mb-3">
                                            <Form.Group id="address">
                                                    <Form.Label>Địa chỉ</Form.Label>
                                                    <Form.Control value={address}
                                                    disabled={true}
                                                    onChange={e=>{changeProperty("address",e.target.value)}} 
                                                    type="text" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                    <Form.Group id="emergency_info">
                                                    <Form.Label>Thông tin liên hệ khẩn cấp</Form.Label>
                                                    <Form.Control value={emergency_info} 
                                                    disabled={true}
                                                    onChange={e=>{changeProperty("emergency_info",e.target.value)}} 
                                                    type="text"/>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group id="experience_year">
                                                <Form.Label>Số năm kinh nghiệm</Form.Label>
                                                <Form.Control
                                                    value={experience_year} 
                                                    disabled={true}
                                                    onChange={e=>{changeProperty("experience_year",e.target.value)}} 
                                                    required type="text" />
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group id="work_experience">
                                                <Form.Label>Kinh nghiệm làm việc</Form.Label>
                                                <Form.Control
                                                    value={work_experience} 
                                                    disabled={true}
                                                    onChange={e=>{changeProperty("work_experience",e.target.value)}} 
                                                    required type="text" />
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                                <Form.Group id="work_experience">
                                                <Form.Label>Bằng cấp</Form.Label>
                                                </Form.Group>
                                                {qualifications.map((item,index)=>{
                                                    const { degree, specialization, university, year, id } = item
                                                    if(item.status==0) return 
                                                    return (
                                                        <Row key={index} className="ms-2 mt-2">
                                                            <Col >
                                                                <Form.Group id="degree">
                                                                    <Form.Label>Bằng cấp</Form.Label>
                                                                    <Form.Control
                                                                        value={degree} 
                                                                        disabled={true}
                                                                        onChange={e=>{changePropertyQualification("degree",e.target.value,id)}} 
                                                                        required type="text" placeholder="Nhập bằng cấp" />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group id="specialization">
                                                                    <Form.Label>Chuyên ngành</Form.Label>
                                                                    <Form.Control
                                                                        value={specialization} 
                                                                        disabled={true}
                                                                        onChange={e=>{changePropertyQualification("specialization",e.target.value,id)}} 
                                                                        required type="text"  />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group id="university">
                                                                    <Form.Label>Đại học/ cao đẳng</Form.Label>
                                                                    <Form.Control
                                                                        value={university} 
                                                                        disabled={true}
                                                                        onChange={e=>{changePropertyQualification("university",e.target.value,id)}} 
                                                                        required type="text" />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group id="year">
                                                                    <Form.Label>Năm tốt nghiệp</Form.Label>
                                                                    <Form.Control
                                                                        value={year} 
                                                                        disabled={true}
                                                                        onChange={e=>{changePropertyQualification("year",e.target.value,id)}} 
                                                                        required type="number" />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    )
                                                    })
                                                }
                                        </Row>
                                        <Row>
                                            <Col sm={8} className="mb-3">
                                                    <Form.Group id="image">
                                                    <Form.Label>Ảnh đại diện</Form.Label>
                                                        <Image className="ms-2" style={{height:'100px'}} rounded fluid src={avatar}></Image>
                                                    </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="mt-3">
                                            <Button onClick={()=>exit()} variant="primary" >Đóng</Button>
                                        </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="doctor_week_days" className="py-2">
                    <Row>
                        <Col xs={12} xl={12}>
                            <Card border="light" className="bg-white shadow-sm mb-4">
                                <Card.Body>
                                    <Form>
                                        <Row  className="mb-3">
                                                <Col md={6} className="mb-3">
                                                    <Form.Group id="session_meeting_time">
                                                        <Form.Label>Thời gian khám *</Form.Label>
                                                        <Form.Select defaultValue={session_meeting_time} onChange={e=>changeProperty("session_meeting_time",e.target.value)}>
                                                            <option value="0">Chọn thời gian khám</option>
                                                            <option value="0.25">15 phút</option>
                                                            <option value="0.5">30 phút</option>
                                                            <option value="0.75">45 phút</option>
                                                            <option value="1">1 giờ</option>
                                                            <option value="1.25">1 giờ 15 phút</option>
                                                            <option value="1.5">1 giờ 30 phút</option>
                                                            <option value="2">2 giờ</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                    <Form.Group id="session_gap">
                                                        <Form.Label>Thời gian nghỉ giữa hai lần khám *</Form.Label>
                                                        <Form.Select defaultValue={session_gap} onChange={e=>changeProperty("session_gap",e.target.value)}>
                                                            <option value="0">Chọn thời gian nghỉ</option>
                                                            <option value="0.167">10 phút</option>
                                                            <option value="0.333">20 phút</option>
                                                            <option value="0.5">30 phút</option>
                                                            <option value="0.75">45 phút</option>
                                                            <option value="1">1 giờ</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                            </Col>
                                        </Row>
                                        {days_of_week.map((item,index)=>{
                                            return (
                                            <div key={item.day_of_week}>
                                            <Row className="pt-2 my-2">
                                                <Col md={2}>
                                                    <Form.Check 
                                                        onChange={(e)=>handleCheckDay(item.day_of_week)} 
                                                        label={item.name} 
                                                        checked={item.status}
                                                        id={item.day_of_week} 
                                                    />
                                                </Col>
                                                <Col>
                                                    {item.session_time.filter(item=>item.status!=0).length>0?
                                                    <>
                                                        {item.session_time.map((item_session_time,index)=>{
                                                        if(item_session_time.status == 0) return 
                                                        return (
                                                            <Row key={index}>
                                                                <Col>
                                                                    <Form>
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Select 
                                                                            value={item_session_time.startTime}
                                                                            onChange={(e)=>handleChangeStartTime(item.day_of_week,item_session_time.session_gap,e.target.value)}>
                                                                            {/* <option defaultValue>{item_session_time.startTime}</option> */}
                                                                            {item_session_time.startTimes.map((item,index)=>{
                                                                                return <option key={item} value={item}>{item}</option>
                                                                            })}
                                                                            </Form.Select>
                                                                        </Form.Group>
                                                                    </Form>
                                                                </Col>
                                                                <Col>
                                                                <Form>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Select
                                                                            value={item_session_time.endTime}
                                                                            onChange={(e)=>handleChangeEndTime(item.day_of_week,item_session_time.session_gap,e.target.value)}
                                                                        >
                                                                        {item_session_time.endTimes.map((item,index)=>{
                                                                            return <option key={index} value={item}>{item}</option>
                                                                        })}
                                                                        </Form.Select>
                                                                    </Form.Group>
                                                                    </Form>
                                                                </Col>
                                                                <Col>
                                                                    <Button variant="secondary" onClick={()=>handleDeleteSessionTime(item.day_of_week,item_session_time.session_gap)}>Xóa</Button>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })}
                                                    </>
                                                    :
                                                    <>
                                                    <label title="Không có lịch">Không có lịch</label>
                                                    </>
                                                    }
                                                    
                                                </Col>
                                                <Col md={1}>
                                                    {item.session_time.filter(item=>item.status!=0).length<2?
                                                        <Button size="16" variant="secondary"
                                                        onClick={()=>handleAddSessionTime(item.day_of_week)}
                                                        >Thêm</Button>
                                                        :
                                                        <></>
                                                    }
                                                </Col>
                                            </Row>
                                            <div style={{width:"100%",height:"1px",opacity:0.2,
                                            background:"black"}}></div>
                                        </div>)
                                        })}
                                    
                                        <div className="mt-3">
                                            <Button onClick={(e)=>saveSchedule()} variant="primary" className="me-2">Lưu lại</Button>
                                            <Button onClick={()=>exit()} variant="primary" >Hủy</Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    </Tab.Pane>
                </Tab.Content>
            </Col>
            </Row>
        </Tab.Container>
       
        </>

        }
        
    </>
  );
};
