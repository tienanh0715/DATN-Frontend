import React from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
// Assets
import { Routes } from "../../../routes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink} from 'react-router-dom';
import Rating from 'react-rating-stars-component';
import { Col, Row, Card, Form, Button, InputGroup,Alert , Modal } from '@themesberg/react-bootstrap';
import { useState } from "react";
import Util from "../../../utils"
import Review from "../../../api/review";
import { useEffect } from "react";

export default function DoctorTable({ doctor_id, average_rating, img, name,experience_year, text, action,qualifications }) {
  const convertInfo= (qualification)=>{
    return "Năm " + qualification.year +": Tốt nghiệp bằng "+ qualification.degree +", chuyên ngành "
    + qualification.specialization+" " + qualification.university
  }
  const { isLogin, userLogin} = useSelector(state => {
    return {
      isLogin:  state.user.isLogin,
      userLogin:  state.user.userLogin,
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showReview= (id) => {
    Review.getReviewByDoctor(id).then(res=>{
      if(res.result=="okie")
      {
        setReviews(res.data)
      }
    })
    setShowReviews(true)
  }
  const [showReviews,setShowReviews] = useState(false)
  const handleClose = () => setShowReviews(false)

  const [reviews, setReviews] = useState([])
  const [star, setStar] = useState(0)
  const [dataShow, setDataShow] = useState([])

  useEffect(()=>{
    if(star==0)
    {
      setDataShow(reviews)
    }
    else
    {
      setDataShow(reviews.filter(item=>item.star_rating==star))
    }
  },[reviews,star])
  const filterStar = ( star )=>{
    setStar(star)
  }
  const checkBooking= (doctor_id) =>{
    if(isLogin)
    {
      dispatch.appointment.showBookingFromDoctor({isBooking: true, doctorId: doctor_id})
    }
    else
    {
      navigate(Routes.ClientSignin.path)
    }
  }
  return (
    <Wrapper className="whiteBg radius8 shadow">
        <Modal centered show={showReviews} className="modal-secondary" onHide={handleClose}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleClose} />
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <Modal.Title className="h4 mb-3">{`Xem đánh giá bác sĩ (${dataShow.length})`}</Modal.Title>
                    <p className="h6 my-1">{name}</p>
                </div>
                <Row className="my-4">
                  <Col md={2} className="d-flex align-items-center">
                  Số sao
                  </Col>
                  <Col md={3}>
                  <Form.Group id="star">
                      <Form.Select value={star} onChange={e=>filterStar(e.target.value)}>
                      <option value={0}>Tất cả</option>
                      <option value={1}>1 sao</option>
                      <option value={2}>2 sao</option>
                      <option value={3}>3 sao</option>
                      <option value={4}>4 sao</option>
                      <option value={5}>5 sao</option>
                      </Form.Select>
                  </Form.Group>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className="ms-3" style={{ overflow: "auto",maxHeight:"400px"}}>

                {dataShow?.map(item=>{
                  return(
                    <Row key={item.created_date} style={{width:"100%"}}  className="my-4">
                            <div className="">
                              <div>
                                {item.patient_name}
                              </div>
                              <div>
                                {Util.FormatDate(item.created_date)}
                              </div>
                            </div>
                            <div>
                                <Rating
                                    count={5}
                                    value={item.star_rating}
                                    size={21} // Adjust the size of the stars
                                    activeColor="#FFD700" // Custom star color (in this case, yellow)
                                />
                            </div>
                            <div className="mb-2">
                                {item.review_text}
                            </div>
                            <div style={{height:"1px",backgroundColor:"black",opacity:0.3,width:"50%",marginTop:"10px"}}>
                            </div>
                      </Row>
                  )
                })}

                {dataShow.length==0?<p>Không có đánh giá {star} sao</p>:<></>}
                </Row>
                
            </Modal.Body>
            
        </Modal>
      <div className=" d-flex justify-content-center align-item-center">
      <ImgBtn className="aniamte pointer" onClick={action ? () => action() : null}>
        <img className="radius8" style={{width:"150px",height:"150px",borderRadius:"30px"}} src={img} alt="doctor"></img>
      </ImgBtn>
      </div>
      <Row className="mt-3">
        <Col>
          {Math.ceil(average_rating)>0?
          <div>
              <Rating
                  count={5}
                  value={Math.ceil(average_rating)}
                  size={21} // Adjust the size of the stars
                  activeColor="#FFD700" // Custom star color (in this case, yellow)
              />
              <p>{average_rating.toFixed(1)}</p>
          </div>:<></>}
        </Col>
        <Col className="align-item-center">
          {Math.ceil(average_rating)>0?<p className="cursor-pointer" onClick={()=>showReview(doctor_id)} style={{color:"#09BAF2", cursor: "pointer"}}> Xem đánh giá</p>:<p style={{color:"#09BAF2"}}>Chưa có đánh giá</p>}
        </Col>
      </Row>
      <div style={{ margin: "30px 0" }}>
        <h4 className="font18 extraBold">{name}</h4>
        <p className="font13 mb-2">{"Số năm kinh nghiệm: " + experience_year}</p>
        {qualifications.map(item=>{
          if(item.status==0) return
          return (
            <p className="font13 mb-2">
              {convertInfo(item)}
            </p>
          )
        })}
        <p className="font13">{text}</p>
      </div>
      <div>
      </div>
      <div style={{ maxWidth: "180px", position:"absolute", bottom:"10px",left:"33%",}}>
        {(!isLogin || userLogin.code =="PATIENT")?<FullButton title="Đặt lịch khám" action={()=>checkBooking(doctor_id)} />:<></>}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  padding: 20px 30px;
  margin-top: 30px;
  position:relative;
  min-height:530px;
`;
const ImgBtn = styled.button`
  background-color: transparent;
  border: 0px;
  border-radius:30px;
  outline: none;
  padding: 0px;
  margin: 0px;
  :hover > img {
    opacity: 0.5;
  }
`;