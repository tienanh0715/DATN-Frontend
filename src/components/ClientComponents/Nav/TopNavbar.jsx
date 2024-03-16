import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
import Datetime from "react-datetime";

// Components
import Sidebar from "../Nav/Sidebar";
import Backdrop from "../Elements/Backdrop";
// Assets
import LogoIcon from "../../../assets/svg/Logo";
import BurgerIcon from "../../../assets/svg/BurgerIcon";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Alert, Modal,Card, Button,InputGroup } from '@themesberg/react-bootstrap';
import { faBell, faCalendar, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faTrash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faMinus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Routes } from "../../../routes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,useLocation, redirect } from "react-router-dom";
import { Link as RouterLink} from 'react-router-dom';
import avatarDefault from '../../../assets/img/avatar_default.jpg'
import Util from "../../../utils";
import User from '../../../api/user'
import moment from "moment-timezone";
import { ChoosePhotoWidget } from "../../../components/Widgets";
import { Server } from "../../../api/APIs";
import localStore from '../../../utils/localStorage'
export default function TopNavbar() {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);
  const [userEdit,setUserEdit] = useState({})
  useEffect(() => {
    window.addEventListener("scroll", () => setY(window.scrollY));
    return () => {
      window.removeEventListener("scroll", () => setY(window.scrollY));
    };
  }, [y]);
  const { isLogin, userLogin} = useSelector(state => {
    return {
      isLogin:  state.user.isLogin,
      userLogin:  state.user.userLogin,
      
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const logout = async () =>{
    console.log("logout")
    await dispatch.user.logout()
    navigate(Routes.Home.path,{replace:true})
  }
  // console.log("user",userLogin)
  // console.log("isLogin",isLogin)

  const book = (e)=>{
    e.preventDefault()
    console.log("book")
    dispatch.appointment.showBooking(true)
  }
  const updateInfo= ()=>{
    setShowEditInfo(true)
    setUserEdit(userLogin)
    setPreview(userLogin.avatar)
  }
  const showAppointments= ()=>{
    navigate(Routes.MyAppointment.path)
  }
  const changPassword= () =>{
    setShowEditPassword(true)
  }
  const redirectHome = (path) =>{
    if(location.pathname!=Routes.MyAppointment.path)
    {
      navigate(Routes.Home.path)
    }
    else
    {
      navigate(path,{replace:true})
    }
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

  const changeProperty= (key,val)=>{
    console.log(key,val)
    setUserEdit(prevState=> ({
        ...prevState,
        [key]:val
    }))
}
  const [showEditInfo, setShowEditInfo] = useState(false);
  const handleCloseEditInfo = () => setShowEditInfo(false);
  const changeInfo = async ()=>{
        console.log("a")
        let passed = true
        if(Util.isEmpty(full_name))
        {
            passed = false
            setMessageAlert("Hãy nhập họ và tên")
        }
        if(!preview)
        {
            passed = false
            setMessageAlert("Hãy chọn ảnh đại diện!")
        }
        if(passed)
        {
            let data ={
                id: userLogin.id,
                gender: gender,
                full_name: full_name,
                phone:phone,
                date_of_birth:moment(_birthday).format("YYYY-MM-DD"),
                address:address,
                blood_group:blood_group,
                identity_card_number:identity_card_number,
                allergy_info:allergy_info,
                health_insurance_number:health_insurance_number,
                emergency_info:emergency_info,
                avatar: preview
            }
            User.editUser(data).then(res=>{
              console.log("Res",res)
            if (res.result === 'okie') {
              setSaveSuccess(true);
              setMessageAlert('Cập nhật thông tin thành công!');
              dispatch.user.updateUserLogin(res.data)
            } else {
              setMessageAlert(
                'Cập nhật thông tin thất bại! Lý do: ' + res.message
              );
            }})
            setTimeout(()=>{
                handleCloseEditInfo()
            },1500)
        }
        handleVisibleAlert()
  }

  useEffect(()=>{
    setPreview(userLogin.avatar)
  },[userLogin])
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
  
  const {  full_name,allergy_info,phone,address,identity_card_number,gender,emergency_info,avatar,health_insurance_number,blood_group } = userEdit

  const [date_of_birth,setDateOfBirth] = useState("")
  const [_birthday, setBirthday] = useState(moment().format("YYYY-MM-DD"))
    useEffect(()=>{
      setDateOfBirth(moment(_birthday).format("YYYY-MM-DD"))
    },[_birthday])
    // console.log("date",_birthday)
  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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
      <Modal scrollable size="lg" centered show={showEditInfo} className="modal-secondary" onHide={handleCloseEditInfo}>
          <Modal.Header>
          <Modal.Title>
               
                    <p className="mb-0 pe-3 pe-md-0">
                      Cập nhật thông tin
                    </p>
                 
                    
          </Modal.Title>
          {visibleAlert?
              <Alert variant="secondary" className="ms-2 my-0">
                  {messageAlert}
              </Alert>
            :<></>
          }
          <Button variant="close" aria-label="Close" onClick={handleCloseEditInfo} />
          </Modal.Header>
          <Modal.Body>
              <Card border="light" className="px-0 px-md-4 py-0 border-0">
              <Card.Body>
              <Form action="#" onSubmit={handleCloseEditInfo}>
             
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="email">
                        <Form.Label>Họ và tên *</Form.Label>
                        <Form.Control  value={full_name} 
                        onChange={e=>{changeProperty("full_name",e.target.value)}} required type="text" placeholder="Nhập họ và tên" />
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
                          <Form.Select value={gender} onChange={e=>changeProperty("gender",e.target.value)}>
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
                
              </Form>
              </Card.Body>
          </Card>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="white" size="sm" onClick={()=>changeInfo()}>Cập nhật</Button>
          <Button variant="white" size="sm" onClick={handleCloseEditInfo}>Hủy</Button>
          </Modal.Footer>
      </Modal>
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper className="flexCenter animate whiteBg" style={y > 100 ? { height: "60px" } : { height: "80px" }}>
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" onClick={()=>{redirectHome("/#home")}} to="home" smooth={true}>
            <LogoIcon />
            <h1 style={{ marginLeft: "15px" }} className="font20 extraBold">
              Phòng khám tai mũi họng Ngôi sao
            </h1>
          </Link>
          <BurderWrapper className="pointer" onClick={() => toggleSidebar(!sidebarOpen)}>
            <BurgerIcon />
          </BurderWrapper>
          <UlWrapper className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} onClick={()=>{redirectHome("/#home")}} to="home" spy={true} smooth={true} offset={-80}>
                Trang chủ
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} onClick={()=>{redirectHome("/#doctors")}} to="doctors" spy={true} smooth={true} offset={-80}>
              Đội ngũ bác sĩ
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} onClick={()=>{redirectHome("/#services")}} to="services" spy={true} smooth={true} offset={-80}>
                Dịch vụ khám bệnh
              </Link>
            </li>
          </UlWrapper>
          <UlWrapperRight className="flexNullCenter">
          
          {isLogin?
          <>
            {
              userLogin.code!="PATIENT"?
              <Button as={RouterLink} variant="secondary" className="animate-hover me-2" 
              to={userLogin.code=="ADMIN"? Routes.DashboardOverview.path: Routes.AppointmentsList.path}>
                  Dashboard
              </Button>
              :
              <Button as={RouterLink} variant="secondary" className="animate-hover  me-2" onClick={(e)=> book(e)}>
                  Đặt lịch ngay
              </Button>

            }
          </>:
          <Button as={RouterLink} variant="secondary" className="animate-hover me-2" to={Routes.ClientSignin.path}>
              Đăng nhập
          </Button>
          }
          {
          isLogin?
          <>
              <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                    <div className="media d-flex align-items-center">
                      <Image src={Util.isEmpty(userLogin.avatar)? avatarDefault: userLogin.avatar} className="user-avatar md-avatar rounded-circle" />
                      <div className="d-flex flex-column media-body ms-2 text-dark">
                        <span className="mb-0 font-small fw-bold">{userLogin.full_name}</span>
                        <span className="mb-0 font-small">{userLogin.code=="ADMIN"?"Quản trị viên":(userLogin.code=="DOCTOR"?"Bác sĩ":(userLogin.code=="PATIENT"?"Bệnh nhân":"Nhân viên"))}</span>
                      </div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  {userLogin.code=="PATIENT"? 
                    <Dropdown.Item onClick={()=>updateInfo()} className="fw-bold">
                      <FontAwesomeIcon icon={faUserCircle} className="me-2" /> Cập nhật thông tin
                    </Dropdown.Item>
                    :null
                  }
                    {userLogin.code=="PATIENT"? 
                    <Dropdown.Item onClick={()=>showAppointments()} className="fw-bold">
                      <FontAwesomeIcon icon={faCalendar} className="me-2" /> Lịch khám bệnh
                    </Dropdown.Item>:null
                    }
                  
                    <Dropdown.Item onClick={()=>changPassword()} className="fw-bold">
                      <FontAwesomeIcon icon={faCog} className="me-2" /> Đổi mật khẩu
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    <Dropdown.Item className="fw-bold" onClick={()=>logout()}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2"/> Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
            
          
          </>:
          <>
            <li className="semiBold font15 pointer flexCenter">
              <Button as={RouterLink} variant="secondary" className="animate-hover me-2 lightBg " to={Routes.ClientSignin.path}>
                  Đặt lịch ngay
              </Button>
            </li>
          </>
        }
        
          </UlWrapperRight>
        </NavInner>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;
const NavInner = styled.div`
  position: relative;
  height: 100%;
`
const BurderWrapper = styled.button`
  outline: none;
  border: 0px;
  background-color: transparent;
  height: 100%;
  padding: 0 15px;
  display: none;
  @media (max-width: 760px) {
    display: block;
  }
`;
const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 760px) {
    display: none;
  }
`;
const UlWrapperRight = styled.ul`
  @media (max-width: 760px) {
    display: none;
  }
`;


