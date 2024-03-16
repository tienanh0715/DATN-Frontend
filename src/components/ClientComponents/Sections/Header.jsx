import React from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
// Assets
import HeaderImage from "../../../assets/img/phong_kham.jpg";
import QuotesIcon from "../../../assets/svg/Quotes";
import Dots from "../../../assets/svg/Dots";
import { Routes } from "../../../routes";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, Modal,Card, Button } from '@themesberg/react-bootstrap';
import { Link as RouterLink} from 'react-router-dom';

import {
  useLocation,
  useNavigate
} from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()
  let link = "https://docs.google.com/forms/d/e/1FAIpQLSeAwle_E71iBrRrJ3xSgV9gtZhtht9R8YZvLbgIhL1_XNUyig/viewform?usp=pp_url"
  const redirect = (e) => {
    console.log("redirect")
    navigate(Routes.Signup.path,{state: {fromScreen: "client"}})
  }
  const redirectEvalution  = (e) => {
    window.open(link, '_blank');
  }
  return (
    <Wrapper id="home" className="container flexSpaceCenter">
      <LeftSide className="flexCenter">
        <div>
          <h1 className="extraBold font60">Phần mềm đặt lịch khám bệnh hiện đại.</h1>
          <HeaderP className="font13 semiBold">
          Một giải pháp phần mềm đặt lịch hẹn y tế phong phú và toàn diện về tính năng để mang lại trải nghiệm đặt lịch hẹn nhanh chóng và đáng tin cậy cho bệnh nhân.
          </HeaderP>
          <BtnWrapper className="d-flex">
            <Col>
              <FullButton action={()=>{redirect()}} title="Đăng ký tài khoản khám bệnh" />
            </Col>
            <Col className="ms-2">
                <FullButton action={()=>{redirectEvalution()}} title="Đánh giá chất lượng phòng khám" />
          </Col>
          </BtnWrapper>
        </div>
      </LeftSide>
      <RightSide>
        <ImageWrapper>
          <Img className="radius8" src={HeaderImage} alt="office" style={{zIndex: 9}} />
          <QuoteWrapper className="flexCenter darkBg radius8">
            <QuotesWrapper>
              <QuotesIcon />
            </QuotesWrapper>
            <div>
              <p className="font15 whiteColor">
                <em>Với 5 năm kinh nghiệm, chúng tôi tự tin mang đến cho bạn những dịch vụ khám đa dạng với đội ngũ bác sĩ 
                  giàu kinh nghiệm.
  </em>
              </p>
              <p className="font13 orangeColor textRight" style={{marginTop: '10px'}}>Vũ Tiến Anh</p>
            </div>
          </QuoteWrapper>
          <DotsWrapper>
            <Dots />
          </DotsWrapper>
        </ImageWrapper>
        <GreyDiv className="lightBg"></GreyDiv>
      </RightSide>
    </Wrapper>
  );
}


const Wrapper = styled.section`
  padding-top: 80px;
  width: 100%;
  min-height: 840px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const LeftSide = styled.div`
  width: 50%;
  height: 100%;
  @media (max-width: 960px) {
    width: 100%;
    order: 2;
    margin: 50px 0;
    text-align: center;
  }
  @media (max-width: 560px) {
    margin: 80px 0 50px 0;
  }
`;
const RightSide = styled.div`
  width: 50%;
  height: 100%;
  @media (max-width: 960px) {
    width: 100%;
    order: 1;
    margin-top: 30px;
  }
`;
const HeaderP = styled.div`
  max-width: 470px;
  padding: 15px 0 50px 0;
  line-height: 1.5rem;
  @media (max-width: 960px) {
    padding: 15px 0 50px 0;
    text-align: center;
    max-width: 100%;
  }
`;
const BtnWrapper = styled.div`
  max-width:390px;
  @media (max-width: 960px) {
    margin: 0 auto;
  }
`;
const GreyDiv = styled.div`
  width: 30%;
  height: 700px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
  @media (max-width: 960px) {
    display: none;
  }
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 9;
  @media (max-width: 960px) {
    width: 100%;
    justify-content: center;
  }
`;
const Img = styled.img`
  @media (max-width: 560px) {
    width: 80%;
    height: auto;
  }
`;
const QuoteWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 50px;
  max-width: 330px;
  padding: 30px;
  z-index: 99;
  @media (max-width: 960px) {
    left: 20px;
  }
  @media (max-width: 560px) {
    bottom: -50px;
  }
`;
const QuotesWrapper = styled.div`
  position: absolute;
  left: -20px;
  top: -10px;
`;
const DotsWrapper = styled.div`
  position: absolute;
  right: -100px;
  bottom: 100px;
  z-index: 2;
  @media (max-width: 960px) {
    right: 100px;
  }
  @media (max-width: 560px) {
    display: none;
  }
`;


