
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
import Guest  from "../../api/guest"
import Util from "../../utils"

export default () => {

    const { guests} = useSelector(state => {
        return {
            guests:  state.guest.guests.data
        }
    })
    const navigate = useNavigate()
    const {state} = useLocation()
    const { guest } = state
    const { id } = guest
    const [_guest, setGuest] = useState(Guest.getDefault())

    useEffect(() => {
        if(id==0)
        {
            console.log("create new")
        }
        else
        {
            let editGuest= guests.find(item=>item.id==id)
            setGuest(editGuest)
            setBirthday(new Date(editGuest.date_of_birth))
        }
    },[]);
    const [_birthday, setBirthday] = useState(moment().format("YYYY-MM-DD"))
    useEffect(()=>{
        setGuest(prevState=>({...prevState,date_of_birth:moment(_birthday).format("YYYY-MM-DD")}))
    },[_birthday])
    console.log("date",_birthday)
    
    const changeProperty= (key,val)=>{
        console.log(key,val)
        setGuest(prevState=> ({
            ...prevState,
            [key]:val
        }))
    }
    
    const { 
        health_insurance_number, identity_card_number, full_name,phone,
        address,city,gender,date_of_birth,emergency_info,allergy_info,blood_group
    } = _guest
    const addGuest= async ()=>{
        let guest = {
            full_name: full_name,
            date_of_birth: moment(_birthday).format("YYYY-MM-DD"),
            gender:gender,
            address: address,
            city: city,
            phone:phone,
            emergency_info:emergency_info,
            allergy_info:allergy_info,
            blood_group:blood_group,
            health_insurance_number:health_insurance_number,
            identity_card_number:identity_card_number,
        }
        let response = await Guest.addGuest(guest)
          if(response.result=="okie") 
          {
            setSaveSuccess(true)
            setMessageAlert("Thêm mới khách thành công!")
            setTimeout(()=>{
                navigate(Routes.GuestsList.path)
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

    const updateGuest = async ()=>{
        // console.log("_guest",_guest)
        let _Edit_Guest= {..._guest}
        let res = await Guest.editGuest(_Edit_Guest)
        if(res.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Cập nhật thông tin khách thành công!")
            setTimeout(()=>{
                navigate(Routes.GuestsList.path)
            },1500)
        }
        else
        {
            setMessageAlert("Cập nhật thất bại! Lý do: " + res.message)
        }
        handleVisible()
    }
    const exit=()=>{
        navigate(Routes.GuestsList.path)
    }
    
    // console.log("userGroups",userGroups)
    console.log("guests",_guest)


    const validate = ()=>{
        let passed = true
        let messageError= ""

        if( Util.isEmpty(full_name) )
        {
            passed = false
            messageError = "Bạn hãy nhập họ và tên"
        }
        if(Util.isEmpty(phone) && passed) 
        {
            passed = false
            messageError = "Bạn hãy nhập số điện thoại"
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
                await addGuest()
            }
            else
            {
                await updateGuest()
            }
        }
        else
        {
            e.preventDefault()
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }

  return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.GuestsList.path,{replace:true})}>Quản lý khách</Breadcrumb.Item>
                    <Breadcrumb.Item active>{id==0?"Thêm khách":"Sửa thông tin"}</Breadcrumb.Item>
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
                           <Col md={6} className="mb-3">
                           <Form.Group id="full_name">
                               <Form.Label>Họ và tên *</Form.Label>
                               <Form.Control
                                value={full_name} 
                                onChange={e=>{changeProperty("full_name",e.target.value)}} 
                                required type="text" placeholder="Nhập họ và tên" />
                           </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="phone">
                               <Form.Label>Số điện thoại *</Form.Label>
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
                       <Row>
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
                  <Col md={6} className="mb-3">
                    <Form.Group id="email">
                        <Form.Label>CMND/CCCD</Form.Label>
                        <Form.Control  value={identity_card_number} 
                        onChange={e=>{changeProperty("identity_card_number",e.target.value)}} required type="text" placeholder="Nhập CMND/CCCD" />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="phone">
                        <Form.Label>Số BHYT</Form.Label>
                        <Form.Control 
                        value={health_insurance_number} 
                        onChange={e=>{changeProperty("health_insurance_number",e.target.value)}} 
                        type="text" placeholder="Nhập số BHYT" />
                    </Form.Group>
                  </Col>
                <Row>
                 
                </Row>

                       </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                            <Form.Group id="gender">
                                <Form.Label>Nhóm máu</Form.Label>
                                <Form.Select value={blood_group} onChange={e=>changeProperty("blood_group",e.target.value)}>
                                <option value="1">O+</option>
                                <option value="2">A+</option>
                                <option value="3">B+</option>
                                <option value="4">AB+</option>
                                <option value="5">O-</option>
                                <option value="6">A-</option>
                                <option value="7">B-</option>
                                <option value="8">AB-</option>
                                </Form.Select>
                            </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                            <Form.Group id="phone">
                                <Form.Label>Thông tin dị ứng</Form.Label>
                                <Form.Control 
                                value={allergy_info} 
                                onChange={e=>{changeProperty("allergy_info",e.target.value)}} 
                                type="text" placeholder="Nhập thông tin dị ứng" />
                            </Form.Group>
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
