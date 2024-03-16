
import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup, Alert } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import {
  useLocation,
  useNavigate
} from "react-router-dom"
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";


const Signup = (props) => {
  // state
  const { isLogin} = useSelector(state => {
    return {
      isLogin:  state.user.isLogin,
    }
  })
  //  console.log(userLogin)
  const [fullName, setFullName] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  // effects
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {state} = useLocation()
  const { fromScreen } = state
  console.log("from",fromScreen)

  useEffect(()=>{
    // console.log(isLogin)
    // if(isLogin)
    // {
    //   navigate(from, { replace: true })
    // }
    
  },[])
  const handleSubmit = async (event) => {
    event.preventDefault()
    let passed = true;
    if( fullName == "")
    {
      passed = false;
      setMessageAlert("Hãy nhập họ và tên")
      handleVisible()
    }
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(passed && !email.match(validRegex))
    {
      passed = false;
      setMessageAlert("Địa chỉ email không hợp lệ")
      handleVisible()
    }
    if(passed)
    {
      let messageError = ""
      if(password == "")
      {
        passed = false
        messageError = "Vui lòng nhập mật khẩu"
      }
      if(passed && confirmPassword != password)
      {
        messageError = "Xác nhận mật khẩu không đúng"
        passed = false;
      }
      if(!passed)
      {
        setMessageAlert(messageError)
        handleVisible()
      }
    }
    if(passed)
    {
      let data = {
        full_name: fullName,
        email: email,
        password: password
      }
      let response = fromScreen =="client"? await dispatch.user.register(data) : await dispatch.user.register(data)
      if(response.result=="okie")
      {
        setSaveSuccess(true)
        setMessageAlert(response.message)
        handleVisible()
        setTimeout(() => {
          navigate(fromScreen =="client"?Routes.ClientSignin.path: Routes.Signin.path, { replace: true })
      }, 2000);
      }
      else
      {
        setSaveSuccess(false)
        console.log("res_register",response)
        setMessageAlert(response.message)
        handleVisible()
      }
    }
    
  }
  
  const [visibleAlert, setVisibleAlert] = useState(false)
  const handleVisible = () => {  
      setVisibleAlert(true)
      setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" })
          setVisibleAlert(false)
      }, 2000);
  } 
  const [ messageAlert, setMessageAlert] = useState("")
  const [ saveSuccess, setSaveSuccess] = useState(false)

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <p className="text-center">
            <Card.Link as={Link} to={fromScreen =="client"?Routes.Home.path: Routes.Signin.path} className="text-gray-700">
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Quay lại trang chủ
            </Card.Link>
          </p>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Đăng ký tài khoản</h3>
                </div>
                <Form className="mt-4">
                <Form.Group id="fullName" className="mb-4">
                    <Form.Label>Họ và tên *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required value={fullName} onChange={e=>setFullName(e.target.value)} type="text" placeholder="Nhập họ và tên" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Email *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control required value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Nhập email" />
                    </InputGroup>
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                        <Form.Group id="password" className="mb-4">
                          <Form.Label>Mật khẩu *</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FontAwesomeIcon icon={faUnlockAlt} />
                            </InputGroup.Text>
                            <Form.Control required value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Nhập mật khẩu" />
                          </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group id="confirmPassword" className="">
                        <Form.Label>Xác nhận lại mật khẩu *</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FontAwesomeIcon icon={faUnlockAlt} />
                            </InputGroup.Text>
                            <Form.Control required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type="password" placeholder="Xác nhận mật khẩu" />
                          </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  {visibleAlert?
                    <Form.Group>
                        <Alert variant={saveSuccess?"success":"danger"} className="my-2">
                          {messageAlert}
                      </Alert>
                    </Form.Group>
                  :<></>
                  }
                  <FormCheck type="checkbox" className="d-flex mb-2">
                    <FormCheck.Input required id="terms" className="me-2" />
                    <FormCheck.Label htmlFor="terms">
                      Tôi đồng ý với <Card.Link className="text-secondary">các điều khoản và điều kiện</Card.Link>
                    </FormCheck.Label>
                  </FormCheck>
                  <Button onClick={e=>handleSubmit(e)} variant="secondary text-white" type="submit" className="w-100">
                    Đăng ký
                  </Button>
                </Form>

                <div className="mt-2 mb-2 text-center">
                  <span className="fw-normal">hoặc</span>
                </div>
              
                <div className="d-flex justify-content-center align-items-center mt-2">
                  <span className="fw-normal">
                    Bạn đã có tài khoản?
                    <Card.Link as={Link} to={fromScreen =="client"?Routes.ClientSignin.path: Routes.Signin.path} className="fw-bold text-secondary">
                      {` Đăng nhập ở đây `}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
export default Signup