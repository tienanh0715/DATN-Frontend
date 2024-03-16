
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, ListGroup, Alert, Modal, Button, Card } from '@themesberg/react-bootstrap';

import avatarDefault from '../assets/img/avatar_default.jpg'

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes } from "../routes";
import Util from "../utils";
import User from '../api/user'
export default (props) => {
  // state
  const { isLogin, userLogin} = useSelector(state => {
    return {
      isLogin:  state.user.isLogin,
      userLogin:  state.user.userLogin,
    }
  })
  console.log("user",userLogin)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logout = async () =>{
    console.log("logout")
    await dispatch.user.logout()
    navigate(Routes.Home.path,{replace:true})
  }

  const [showEditPassword, setShowEditPassword] = useState(false);
  const handleCloseEditPassword = () => setShowEditPassword(false);
  const [ saveSuccess, setSaveSuccess] = useState(false)
  const [ messageAlert, setMessageAlert] = useState("")
  const [pw,setPW]= useState("")

  const [confirmpw,setConfirmPW]= useState("")
  const handleVisibleAlert = () => {  
    setVisibleAlert(true)
    setTimeout(() => {
        setVisibleAlert(false)
    }, 2000);
  } 
  const [visibleAlert, setVisibleAlert] = useState(false)
  const [ messageAlertChangePW, setMessageAlertChangePW] = useState("")
  const changePW = async ()=>{
    if(pw != confirmpw)
    {
        handleVisibleAlert()
        setMessageAlertChangePW("Mật khẩu không giống nhau !")
    }
    else
    {
        if(pw.length<3)
        {
            handleVisibleAlert()
            setMessageAlertChangePW("Mật khẩu phải có độ dài hơn 6 ký tự !")
        }
        else
        {
            let _Edit_User= { id: userLogin.id, password: pw}
            let res = await User.changePW(_Edit_User)
            if(res.result == "okie")
            {
                setSaveSuccess(true)
                setMessageAlertChangePW("Đặt lại mật khẩu thành công!")
                setTimeout(()=>{
                  handleCloseEditPassword()
                  setConfirmPW("")
                  setPW("")
                },1500)
                
            }
            else
            {
              setMessageAlertChangePW("Đặt lại mật khẩu thất bại! Lý do: " + res.message)
            }
            handleVisibleAlert()
        }
    }
  }

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Modal centered show={showEditPassword} className="modal-secondary" onHide={handleCloseEditPassword}>
            <Modal.Header>
            <Modal.Title>
                <p className="mb-0 pe-3 pe-md-0">
                    Đặt lại mật khẩu
                </p>
            </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleCloseEditPassword} />
            </Modal.Header>
            <Modal.Body>
                <Card border="light" className="px-0 px-md-4 py-0 border-0">
                <Card.Body>
                <Form action="#" onSubmit={handleCloseEditPassword}>
                    <Form.Group className="mb-4" id="newPW">
                        <Form.Control value={pw} onChange={e=>setPW(e.target.value)} type="password" placeholder="Nhập mật khẩu mới" />
                    </Form.Group>
                    <Form.Group className="mb-4" id="confirmNewPW">
                        <Form.Control value={confirmpw} onChange={e=>setConfirmPW(e.target.value)} type="password" placeholder="Xác nhận mật khẩu" />
                    </Form.Group>
                    {visibleAlert?
                    <Alert variant="danger" className="my-0">
                        {messageAlertChangePW}
                    </Alert>
                :<></>
                }
                </Form>
                </Card.Body>
            </Card>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>changePW()}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleCloseEditPassword}>Hủy</Button>
            </Modal.Footer>
        </Modal>
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            {/* <Form className="navbar-search">
              <Form.Group id="topbarSearch">
                <InputGroup className="input-group-merge search-bar">
                  <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                  <Form.Control type="text" placeholder="Tìm kiếm" />
                </InputGroup>
              </Form.Group>
            </Form> */}
          </div>
          <Nav className="align-items-center">

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={Util.isEmpty(userLogin.avatar)?avatarDefault:userLogin.avatar } className="user-avatar md-avatar rounded-circle" />
                  <div className="d-flex flex-column media-body ms-2 text-dark">
                    <span className="mb-0 font-small fw-bold">{userLogin.full_name}</span>
                    <span className="mb-0 font-small">{userLogin.code=="ADMIN"?"Quản trị viên":(userLogin.code=="DOCTOR"?"Bác sĩ":"Nhân viên")}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                {/* <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" /> Sửa thông tin cá nhân
                </Dropdown.Item> */}
                <Dropdown.Item className="fw-bold" onClick={()=>setShowEditPassword(true)}>
                  <FontAwesomeIcon icon={faCog} className="me-2" /> Đổi mật khẩu
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="fw-bold" onClick={()=>logout()}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2"/> Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
