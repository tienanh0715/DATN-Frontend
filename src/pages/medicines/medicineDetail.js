
import React, { useState,useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, Alert ,Breadcrumb, Image } from '@themesberg/react-bootstrap';
import { faCheck, faHome,faPlus } from "@fortawesome/free-solid-svg-icons";
import Medicine  from "../../api/medicine"
import APIs  from "../../api/APIs"

import { Routes } from "../../routes";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Util from "../../utils"
import { ChoosePhotoWidget } from "../../components/Widgets";

export default () => {

    const { medicines} = useSelector(state => {
        return {
            medicines: state.medicine.data,
        }
    })
    const navigate = useNavigate()
    const {state} = useLocation()
    const { medicine } = state
    console.log("medicine",medicine)
    const { id } = medicine
    const [_medicine, setMedicine] = useState(Medicine.getDefault())

    useEffect(() => {
        if(id==0)
        {
            console.log("Tạo mới")
        }
        else
        {
            console.log("Sửa", id)
            console.log("medicined",medicines)
            let editMedicine= medicines.find(item=>item.id===id)
            console.log("Sửa medicine",editMedicine)
            setMedicine(editMedicine)
            setPreview(editMedicine.image)
        }
    },[]);
    
    const changeProperty= (key,val)=>{
        console.log(key,val)
        setMedicine(prevState=> ({
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
            setMedicine(prevState=> ({
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
        console.log("image",image)
      };

    const {  name, effect, image, unit, origin } = _medicine
    const addMedicine = async ()=>{
        let data = {
            name: name,
            effect:effect,
            image:preview,
            unit:unit,
            origin: origin
        }
        let response = await Medicine.addMedicine(data)
          if(response.result=="okie") 
          {
            setSaveSuccess(true)
            setMessageAlert("Tạo mới thuốc khám bệnh thành công!")
            setTimeout(()=>{
                navigate(Routes.MedicineList.path)
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
    const updateMedicine = async () => {
        let data = {
            id:id,
            name: name,
            effect:effect,
            image:preview,
            unit:unit,
            origin: origin
        }
        let res = await Medicine.editMedicine(data)
        if (res) {
            console.log("ress",res)
            if(res.result == "okie")
            {
                setSaveSuccess(true)
                setMessageAlert("Cập nhật thành công!")
                setTimeout(()=>{
                    navigate(Routes.MedicineList.path)
                },1500)
            }
            else
            {
                setMessageAlert("Cập nhật thất bại! Lý do: " + res.message)
            }
        }
        handleVisible()
    }
    const exit=()=>{
        navigate(Routes.MedicineList.path)
    }
    const save = ()=>{
        if(validate())
        {
            if(id==0)
            {
                addMedicine()
            }
            else
            {
                updateMedicine()
            }
        }
        
    }
    const validate = ()=>{
        let passed = true
        let messageError= ""
        
        if( Util.isEmpty(unit) && passed)
        {
            passed = false
            messageError = "Bạn hãy nhập đơn vị thuốc"
        }
        if(Util.isEmpty(name) && passed) 
        {
            passed = false
            messageError = "Bạn hãy nhập tên thuốc"
        } 
        if(Util.isEmpty(effect) && passed) 
        {
            passed = false
            messageError = "Bạn hãy nhập công dụng"
        } 
       
        if( Util.isEmpty(origin) && passed)
        {
            passed= false
            messageError = "Bạn hãy nhập xuất xứ"
        }
        if(Util.isEmpty(file) && Util.isEmpty(image) && passed) 
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
  return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2 px-2 rounded-3 ">
            <div className="d-block mb-xl-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item >Quản lý danh mục</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={()=>navigate(Routes.MedicineList.path,{replace:true})}>Thuốc</Breadcrumb.Item>
                    <Breadcrumb.Item active>{id==0 ?"Tạo mới":"Sửa"}</Breadcrumb.Item>
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
                                    <Form.Group id="name">
                                        <Form.Label>Tên thuốc *</Form.Label>
                                        <Form.Control value={name} onChange={e=>changeProperty("name",e.target.value)} 
                                        required type="text" placeholder="Nhập tên thuốc" />
                                    </Form.Group>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Form.Group id="unit">
                                    <Form.Label>Đơn vị thuốc*
                                    </Form.Label>
                                    <Form.Control value={unit} onChange={e=>changeProperty("unit",e.target.value)} 
                                        required type="text" placeholder="Nhập đơn vị thuốc" />
                                </Form.Group>
                            </Col>
                        </Row>
                       
                        <Row className="mb-3">
                            <Form.Group id="effect">
                                <Form.Label>Công dụng *</Form.Label>
                                <Form.Control value={effect} onChange={e=>changeProperty("effect",e.target.value)} 
                                as="textarea" rows="2" type="text" required placeholder="Nhập công dụng" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group id="origin">
                                <Form.Label>Xuất xứ *
                                </Form.Label>
                                <Form.Control value={origin} onChange={e=>changeProperty("origin",e.target.value)} 
                                    required type="text" placeholder="Nhập xuất xứ" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            {(image || file)? 
                            <>
                                <Form.Group id="image">
                                <Form.Label>Hình ảnh thuốc *</Form.Label>
                                    <ChoosePhotoWidget 
                                        title="Chọn ảnh"
                                        photo={preview? preview: image}
                                        onFileChange = {onFileChange}
                                    />
                                </Form.Group>
                            </>
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
