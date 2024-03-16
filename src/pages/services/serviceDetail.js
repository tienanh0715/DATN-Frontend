
import React, { useState,useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, Alert ,Breadcrumb, Image } from '@themesberg/react-bootstrap';
import { faCheck, faHome,faPlus } from "@fortawesome/free-solid-svg-icons";
import Service  from "../../api/service"
import APIs  from "../../api/APIs"

import { Routes } from "../../routes";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Util from "../../utils"
import { ChoosePhotoWidget } from "../../components/Widgets";

export default () => {

    const { services} = useSelector(state => {
        return {
            services: state.service.services.data,
        }
    })
    const navigate = useNavigate()
    const {state} = useLocation()
    const { service } = state
    console.log("service",service)
    const { id } = service
    const [_service, setService] = useState(Service.getDefault())

    useEffect(() => {
        if(id==0)
        {
            console.log("Tạo mới")
        }
        else
        {
            console.log("Sửa", id)
            console.log("servies",services)
            let editService= services.find(item=>item.id===id)
            console.log("Sửa service",editService)
            setService(editService)
            setPreview(editService.image)
        }
    },[]);
    
    const changeProperty= (key,val)=>{
        console.log(key,val)
        setService(prevState=> ({
            ...prevState,
            [key]:val
        }))
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
            setService(prevState=> ({
                ...prevState,
                [key]: e.target?.value
            }))
            setFile(selectedFile);
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend  = () => {
                console.log("image",reader.result)
                setPreview(reader.result);
            }
        } else {
            // The selected file is not an image
            alert('Please select an image file');
        }
        console.log("image",image)
      };

    const { status, name, charge, image, description } = _service
    const addService = async ()=>{
        let data = {
            status: status,
            image:preview,
            charge:charge,
            name:name,
            description:description,
            id:id
        }
        let response = await Service.addService(data)
        if(response.result=="okie") 
        {
            setSaveSuccess(true)
            setMessageAlert("Tạo mới dịch vụ khám bệnh thành công!")
            setTimeout(()=>{
                navigate(Routes.ServiceList.path)
            },1500)
        }
        else
        {
            setMessageAlert("Thêm mới thất bại! Lý do: " + response.message)
        }
        handleVisible()
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
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
    const updateService = async () => {
        let data = {
            status: status,
            image:preview,
            charge:charge,
            name:name,
            description:description,
            id:id
        }
        let res = await Service.editService(data)
        if (res) 
        {
            console.log("ress",res)
            if(res.result == "okie")
            {
                setSaveSuccess(true)
                setMessageAlert("Cập nhật thành công!")
                setTimeout(()=>{
                    navigate(Routes.ServiceList.path)
                },1500)
            }
            else
            {
                setMessageAlert("Cập nhật thất bại! Lý do: " + res.message)
            }
            handleVisible()
        }
    }
    const exit=()=>{
        navigate(Routes.ServiceList.path)
    }
    const save = ()=>{
        if(validate())
        {
            if(id==0)
            {
                addService()
            }
            else
            {
                updateService()
            }
        }
        
    }
    const validate = ()=>{
        let passed = true
        let messageError= ""
       
        if(Util.isEmpty(name)) 
        {
            passed = false
            messageError = "Bạn hãy nhập tên dịch vụ"
        } 
        if( Util.isEmpty(charge) && passed)
        {
            passed= false
            messageError = "Bạn hãy nhập giá"
        }
        if(Util.isEmpty(file) && Util.isEmpty(image) ) 
        {
            passed = false
            messageError = "Bạn hãy chọn ảnh"
        } 
        setMessageAlert(messageError)
        handleVisible()
        return passed
    }
  return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2 px-2 rounded-3 ">
            <div className="d-block mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item >Quản lý danh mục</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.ServiceList.path,{replace:true})}>Dịch vụ khám bệnh</Breadcrumb.Item>
                    <Breadcrumb.Item active>{id==0 ?"Tạo mới dịch vụ khám bệnh":"Sửa dịch vụ khám bệnh"}</Breadcrumb.Item>
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
                        <Row>
                            <Col md={8} className="mb-3">
                            <Row className="mb-3">
                                <Form.Group id="name">
                                    <Form.Label>Tên dịch vụ *</Form.Label>
                                    <Form.Control value={name} onChange={e=>changeProperty("name",e.target.value)} 
                                    required type="text" placeholder="Nhập tên dịch vụ" />
                                </Form.Group>
                            </Row>
                            </Col>
                            <Col md={4} className="mb-3">
                            <Form.Group id="status">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Select id="status" value={status} onChange={e=>changeProperty("status",e.target.value)}>
                                        <option value={1}>Hoạt động</option>
                                        <option value={2}>Tạm dừng hoạt động</option>
                               </Form.Select>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group id="charge">
                                <Form.Label>Giá dịch vụ (VNĐ) *</Form.Label>
                                <Form.Control value={charge} onChange={e=>changeProperty("charge",e.target.value)} 
                                required type="text" placeholder="Nhập giá dịch vụ" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            {(image || file)? 
                            <Row>
                                <Form.Group id="image">
                                <Form.Label>Hình ảnh dịch vụ *</Form.Label>
                                    <ChoosePhotoWidget 
                                        title="Chọn ảnh"
                                        photo={preview? preview: image}
                                        onFileChange = {onFileChange}
                                    />
                                </Form.Group>
                            </Row>
                            :
                            <>
                                {preview && <Image src={preview} alt="Preview" />}
                                <Form.Group id="image">
                                    <Form.Label>Chọn ảnh *</Form.Label>
                                    <Form.Control value={image} onChange={e=> onFileChange("image",e)} 
                                    accept="image/*" required type="file" placeholder="Nhập mô tả" />
                                </Form.Group>
                            </>
                            }
                        </Row>
                        <Row className="mb-3">
                            <Col md={12} className="mb-3">
                            <Form.Group id="description">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control value={description} onChange={e=>changeProperty("description",e.target.value)} 
                                as="textarea" rows="3" type="text" placeholder="Nhập mô tả" />
                            </Form.Group>
                            </Col>
                        </Row>
                        <div className="mt-3">
                            <Button onClick={()=>save()} variant="primary" className="me-2">Lưu lại</Button>
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
