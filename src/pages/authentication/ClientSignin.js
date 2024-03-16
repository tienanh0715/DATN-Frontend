
import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt, faFacebook, faTwitter, faGithub } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Button, Container, InputGroup,Alert,Card,FormCheck } from '@themesberg/react-bootstrap';
import BgImage from "../../assets/img/illustrations/signin.svg";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import {
  useLocation,
  useNavigate
} from "react-router-dom"
import { Routes } from "../../routes";
/**
 * WordPress dependencies
 */
const ClientLogin = (props) => {
  // state
  const { isLogin} = useSelector(state => {
    return {
      isLogin:  state.user.isLogin,
    }
  })
//  console.log(userLogin)
  const [usr, setUsr] = useState("")
  const [pw, setPW] = useState("")

  // effects
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location =  useLocation()
  let from = location.state?.from?.pathname || Routes.Home.path
  console.log("from",from)
  useEffect(()=>{
    console.log(isLogin)
    // if(isLogin)
    // {
    //   navigate(from, { replace: true })
    // }
  },[])
  const handleSubmit = async (event) => {
    event.preventDefault()
    let passed = true
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if( !usr.match(validRegex))
    {
      passed= false
      setMessageAlert("Tài khoản không hợp lệ!")
      handleVisible()
    }
    if( passed && pw == "")
    {
      setMessageAlert("Mật khẩu không hợp lệ")
      handleVisible()
    }
    if(passed)
    {
      let response = await dispatch.user.login({usr,pw})
      if(response.result=="okie")
      {
        console.log(from)
        navigate(from, { replace: true })
        // await dispatch.room.loadData()
        // await dispatch.userGroup.loadData()
      }
      else
      {
        console.log("res_login",response)
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
  const redirect = (e) => {
    console.log("redirect")
    e.preventDefault()
    navigate(Routes.Signup.path,{state: {fromScreen: "client"}})
  }
  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0 ">Đăng nhập</h3>
                </div>
                <Form className="mt-4">
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Tài khoản</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="text" value={usr} onChange={e=>setUsr(e.target.value)} placeholder="Tài khoản" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Mật khẩu</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" value={pw} onChange={e=>setPW(e.target.value)} placeholder="Mật khẩu" />
                      </InputGroup>
                    </Form.Group>
                  </Form.Group>
                  {visibleAlert?
                    <Form.Group>
                        <Alert variant="danger" className=" my-4">
                          {messageAlert}
                      </Alert>
                    </Form.Group>
                  :<></>
                  }
                  {/* <div className="d-flex justify-content-end align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                      </Form.Check>
                      <Card.Link as={Link} to={Routes.ForgotPassword.path}  className="small text-secondary">Quên mật khẩu?</Card.Link>
                    </div> */}
                  <Button variant="secondary text-white" type="submit" onClick={(e)=>handleSubmit(e)} className="w-100">
                    Đăng nhập
                  </Button>
                </Form>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Bạn chưa có tài khoản?
                    <Card.Link as={Link} onClick={(e)=>redirect(e)}  className="fw-bold text-secondary">
                      {` Tạo tài khoản `}
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
export default ClientLogin
