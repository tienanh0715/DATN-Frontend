import styled from "styled-components";
// Components
import DoctorTable from "../Elements/DoctorTable";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
export default function Doctorss() {
  const dispatch = useDispatch()
  const [dataShow, setdataShow]= useState([])
  const { doctors } = useSelector(state => {
    return {
      doctors:  state.doctor.doctors.data,
    }
  })
  // load when component did mount
  useEffect(()=>{
    dispatch.doctor.loadData()
  },[])
  useEffect(()=>{
    doctors && setdataShow(doctors);
  },[doctors])
  // console.log("doctors",doctors)

  const booking=()=>{

  }
  return (
    <Wrapper id="doctors">
      <div className="whiteBg">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Đội ngũ bác sĩ</h1>
            <p className="font13">
              Đội ngũ bác sĩ có bằng cấp và nhiều năm kinh nghiệm trong nghề
            </p>
          </HeaderInfo>
          <div className="row">
              {dataShow.map(item=>{
                return(
                  <div key={item.id} className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <DoctorTable
                  doctor_id={item.id}
                  average_rating= {item.average_rating}
                  img={item.avatar}
                  name={item.full_name}
                  experience_year={item.experience_year}
                  qualifications={item.qualifications}
                  action={() => booking(item)}
                  />
                </div>
                )
              })}
            
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 50px 0;
`;
const HeaderInfo = styled.div`
  margin-bottom: 50px;
  @media (max-width: 860px) {
    text-align: center;
  }
`;





