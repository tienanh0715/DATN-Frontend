
import React, { useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup,Alert ,Image } from '@themesberg/react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Routes } from "../../routes";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Staff  from "../../api/staff"
import Util from "../../utils"
import { ChoosePhotoWidget } from "../../components/Widgets";

export default () => {

    const { staffs} = useSelector(state => {
        return {
            staffs:  state.staff.staffs.data
        }
    })
    const navigate = useNavigate()
    const {state} = useLocation()
    const { staff } = state
    const { id } = staff
    const [_staff, setStaff] = useState(Staff.getDefault())

    useEffect(() => {
        if(id==0)
        {
            console.log("create new")
        }
        else
        {
            let editStaff= staffs.find(item=>item.id==id)
            setStaff(editStaff)
            setBirthday(new Date(editStaff.date_of_birth))
            setPreview(editStaff.avatar)
        }
    },[]);
    const [_birthday, setBirthday] = useState(moment().format("YYYY-MM-DD"))
    useEffect(()=>{
        setStaff(prevState=>({...prevState,date_of_birth:moment(_birthday).format("YYYY-MM-DD")}))
    },[_birthday])
    console.log("date",_birthday)
    
    const changeProperty= (key,val)=>{
        console.log(key,val)
        setStaff(prevState=> ({
            ...prevState,
            [key]:val
        }))
    }
    
    const {  full_name,password,email,phone,info,address,city,gender,date_of_birth,emergency_info,avatar } = _staff
    const addStaff= async ()=>{
        let staff = {
            full_name: full_name,
            date_of_birth: moment(_birthday).format("YYYY-MM-DD"),
            gender:gender,
            password: password,
            address: address,
            city: city,
            email:email,
            phone:phone,
            avatar: preview
        }
        let response = await Staff.addStaff(staff)
          if(response.result=="okie") 
          {
            setSaveSuccess(true)
            setMessageAlert("Thêm mới thành công!")
            setTimeout(()=>{
                navigate(Routes.StaffsList.path)
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

    const updateStaff = async ()=>{
        // console.log("_staff",_staff)
        let _Edit_Staff= {..._staff}
        _Edit_Staff.avatar = preview
        let res = await Staff.editStaff(_Edit_Staff)
        if(res.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Cập nhật thành công!")
            setTimeout(()=>{
                navigate(Routes.StaffsList.path)
            },1500)
        }
        else
        {
            setMessageAlert("Cập nhật thất bại! Lý do: " + res.message)
        }
        handleVisible()
    }
    const exit=()=>{
        navigate(Routes.StaffsList.path)
    }
    
    // console.log("userGroups",userGroups)
    console.log("staffs",_staff)


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
                await addStaff()
            }
            else
            {
                await updateStaff()
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
            setStaff(prevState=> ({
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


  return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.StaffsList.path,{replace:true})}>Quản lý nhân viên</Breadcrumb.Item>
                    {_staff.id == 0?<Breadcrumb.Item active>Thêm nhân viên</Breadcrumb.Item> : <Breadcrumb.Item active>Sửa nhân viên</Breadcrumb.Item>}
                </Breadcrumb>
                {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"}>
                        {messageAlert}
                    </Alert>
                :<></>
                }
            </div>
        </div>
        {_staff.id == 0?
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
                               required type="text" placeholder="Nhập số điện thoại" />
                           </Form.Group>
                           </Col>
                       </Row>
                       <Row>
                           <Col md={6} className="mb-3">
                           <Form.Group id="gender">
                               <Form.Label>Giới tính</Form.Label>
                               <Form.Select defaultValue={gender} onChange={e=>changeProperty("gender",e.target.value)}>
                               <option value="2">Chọn giới tính</option>
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
                               onChange={e=>{changeProperty("email",e.target.value)}} required disabled type="email" placeholder="Nhập email" />
                           </Form.Group>
                           
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="phone">
                               <Form.Label>Số điện thoại</Form.Label>
                               <Form.Control 
                               value={phone} 
                               onChange={e=>{changeProperty("phone",e.target.value)}} 
                               required type="text" placeholder="Nhập số điện thoại" />
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
                                   <Form.Control value={address} type="text" placeholder="Nhập địa chỉ" />
                               </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                                <Form.Group id="emergency_info">
                                   <Form.Label>Thông tin liên hệ khẩn cấp</Form.Label>
                                   <Form.Control value={emergency_info} type="text" placeholder="Nhập thông tin liên hệ khẩn cấp" />
                               </Form.Group>
                           </Col>
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
                           <Button onClick={()=>exit()} variant="primary" >Quay lại</Button>
                       </div>
                       </Form>
                   </Card.Body>
               </Card>
           </Col>
       </Row>
        </>

        }
        
    </>
  );
};
