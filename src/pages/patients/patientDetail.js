
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
import Patient  from "../../api/patient"
import Util from "../../utils"
import { ChoosePhotoWidget } from "../../components/Widgets";
import avatarDefault from '../../assets/img/avatar_default.jpg'

export default () => {

    const { patients} = useSelector(state => {
        return {
            patients:  state.patient.patients.data,
        }
    })
    const [_birthday, setBirthday] = useState(moment().format("YYYY-MM-DD"))
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate()
    const {state} = useLocation()
    const { patient } = state
    const { id } = patient
    const [_patient, setPatient] = useState(Patient.getDefault())

    useEffect(() => {
        let editPatient= patients.find(item=>item.id==id)
        setPatient(editPatient)
        setBirthday(Util.isEmpty(editPatient.date_of_birth) ? null :new Date(editPatient.date_of_birth))
        setPreview(editPatient.avatar)
    },[]);
    
    const {  full_name,health_insurance_number,email,phone,info,address,blood_group, allergy_info,gender,date_of_birth,emergency_info,avatar,identity_card_number } = _patient
  
    const exit=()=>{
        navigate(Routes.PatientsList.path)
    }
    
    // console.log("patientGroups",patientGroups)
    console.log("patients",_patient)

    
  return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.PatientsList.path,{replace:true})}>Quản lý bệnh nhân</Breadcrumb.Item>
                    <Breadcrumb.Item active>Chi tiết bệnh nhân</Breadcrumb.Item>
                </Breadcrumb>
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
                               <Form.Label>Họ và tên</Form.Label>
                               <Form.Control
                                value={full_name + " ("+ email +")"} 
                                disabled
                                required type="text"  />
                           </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="phone">
                               <Form.Label>Số điện thoại</Form.Label>
                               <Form.Control 
                               value={phone} 
                               disabled
                               required type="text"  />
                           </Form.Group>
                           </Col>
                       </Row>
                       <Row>
                           <Col md={6} className="mb-3">
                           <Form.Group id="gender">
                               <Form.Label>Giới tính</Form.Label>
                               <Form.Select disabled value={gender} >
                               <option value={0}>Nữ</option>
                               <option value={1}>Nam</option>
                               </Form.Select>
                           </Form.Group>
                          
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="date_of_birth">
                               <Form.Label>Ngày sinh</Form.Label>
                               <Datetime
                               timeFormat={false}
                               renderInput={(props, openCalendar) => (
                                   <InputGroup>
                                   <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                   <Form.Control
                                       disabled
                                       type="text"
                                       value={!Util.isEmpty(_birthday) ? moment(_birthday).format("YYYY-MM-DD") : ""}
                                    //    placeholder="yyyy-mm-dd"
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
                                   <Form.Control value={address} disabled type="text" />
                               </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="emergency_info">
                                   <Form.Label>Thông tin liên hệ khẩn cấp</Form.Label>
                                   <Form.Control value={emergency_info} disabled type="text" />
                               </Form.Group>
                           </Col>
                       </Row>
                       <Row className="align-items-center">
                           <Col md={6} className="mb-3">
                            <Form.Group id="email">
                                <Form.Label>CMND/CCCD</Form.Label>
                                <Form.Control  value={identity_card_number} 
                                disabled required type="text"  />
                            </Form.Group>
                           </Col>
                           <Col md={6} className="mb-3">
                           <Form.Group id="phone">
                                <Form.Label>Số BHYT</Form.Label>
                                <Form.Control 
                                value={health_insurance_number} 
                                type="text" disabled/>
                            </Form.Group>
                           </Col>
                       </Row>
                       <Row>
                    <Col md={6} className="mb-3">
                    <Form.Group id="gender">
                        <Form.Label>Nhóm máu</Form.Label>
                        <Form.Select defaultValue={blood_group} disabled>
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
                        value={allergy_info} disabled
                        type="text"  />
                    </Form.Group>
                  </Col>
                </Row>
                       <Row>
                       <Form.Group id="phone">
                        <Form.Label>Ảnh đại diện</Form.Label>
                        
                            <Image className="user-avatar md-avatar" src={preview?preview:avatarDefault} alt="Preview" />
                            </Form.Group>
                       
                       </Row>
                       <div className="mt-3">
                           <Button onClick={()=>exit()} variant="primary" >Quay lại</Button>
                       </div>
                       </Form>
                   </Card.Body>
               </Card>
           </Col>
       </Row>
    </>
  );
};
