import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
// Components
import TestimonialBox from "../Elements/TestimonialBox";

export default function TestimonialSlider() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      <Slider {...settings}>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Với 5 năm kinh nghiệm, chúng tôi tự tin mang đến cho bạn những dịch vụ khám đa dạng với đội ngũ bác sĩ 
                  giàu kinh nghiệm."
            author="Vũ Tiến Anh"
          />
        </LogoWrapper>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Với 5 năm kinh nghiệm, chúng tôi tự tin mang đến cho bạn những dịch vụ khám đa dạng với đội ngũ bác sĩ 
                  giàu kinh nghiệm."
            author="Trần Văn A"
          />
        </LogoWrapper>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Với 5 năm kinh nghiệm, chúng tôi tự tin mang đến cho bạn những dịch vụ khám đa dạng với đội ngũ bác sĩ 
                  giàu kinh nghiệm."
            author="Nguyễn Văn B"
          />
        </LogoWrapper>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Với 5 năm kinh nghiệm, chúng tôi tự tin mang đến cho bạn những dịch vụ khám đa dạng với đội ngũ bác sĩ 
                  giàu kinh nghiệm."
            author="Nguyễn Thị C"
          />
        </LogoWrapper>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Với 5 năm kinh nghiệm, chúng tôi tự tin mang đến cho bạn những dịch vụ khám đa dạng với đội ngũ bác sĩ 
                  giàu kinh nghiệm."
            author="Bá Văn A"
          />
        </LogoWrapper>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Với 5 năm kinh nghiệm, chúng tôi tự tin mang đến cho bạn những dịch vụ khám đa dạng với đội ngũ bác sĩ 
                  giàu kinh nghiệm."
            author="Cao Văn H"
          />
        </LogoWrapper>
      </Slider>
    </div>
  );
}

const LogoWrapper = styled.div`
  width: 90%;
  padding: 0 5%;
  cursor: pointer;
  :focus-visible {
    outline: none;
    border: 0px;
  }
`;
