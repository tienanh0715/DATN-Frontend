
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
    
    const {  full_name,password,email,phone,info,address,city,gender,session_meeting_time,session_gap,emergency_info,avatar,work_experience,experience_year , qualifications } = _doctor
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
        _Edit_Doctor.qualifications=qualifications.map(item=>{
            if (typeof item.id === 'string' || item.id instanceof String)
            {
                return {...item,id:0}
            }
            else return {...item}
        })
        _Edit_Doctor.avatar = preview
        let res = await Doctor.editDoctor(_Edit_Doctor)
        if(res.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Cập nhật thông tin bác sĩ thành công!")
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
                if(element.status == 0)  return
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
            specialization:"",
            status:1
        })
        setDoctor(prevState=> ({
            ...prevState,
            qualifications:newqualifications
        }))
    }
    const handleDelete = (id)=>{
        console.log("delete qualification")
        let newqualifications = qualifications.map(item=>{
            if(item.id==id)
            {
                return {...item,status:0}
            }
            return item
        })
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
    

    return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.DoctorsList.path,{replace:true})}>Quản lý bác sĩ</Breadcrumb.Item>
                    <Breadcrumb.Item active >Sửa thông tin bác sĩ</Breadcrumb.Item>
                </Breadcrumb>
                {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"}>
                        {messageAlert}
                    </Alert>
                :<></>
                }
            </div>
        </div>
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
                               onChange={e=>{changeProperty("email",e.target.value)}} disabled required type="email" placeholder="Nhập email" />
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
                                if(item.status==0) return 
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
                       </Row>
                       <div className="mt-3">
                           <Button onClick={(e)=>save(e)} variant="primary" className="me-2">Lưu lại</Button>
                           <Button onClick={()=>exit()} variant="primary" >Thoát</Button>
                       </div>
                       </Form>
                   </Card.Body>
               </Card>
           </Col>
        </Row>
    </>
  );
};
