import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import ServiceTable from "../Elements/ServiceTable";
import { useDispatch, useSelector } from "react-redux";
import Util from "../../../utils";

export default function Servicess() {
  const [dataShow, setdataShow]= useState([])
  const dispatch = useDispatch()
  const { services } = useSelector(state => {
    return {
      services:  state.service.services.data,
    }
  })

  let activeServices = services.filter(item=>item.status==1);
  // load when component did mount
  useEffect(()=>{
    dispatch.service.loadData()
  },[])
  useEffect(()=>{
    services && setdataShow(activeServices);
    // console.log("services",services)
  },[services])

  return (
    <Wrapper id="services">
      <div className="whiteBg">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Dịch vụ khám bệnh</h1>
            <p className="font13">
               Chúng tôi cung cấp đa dạng các dịch vụ khám bệnh
            </p>
          </HeaderInfo>
          <TablesWrapper className="flexSpaceNull">
          <div className="row">
            {dataShow.map(item=>{
              return(
            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <ServiceTable
                    service_id={item.id}
                    icon={item.image}
                    price={Util.formatNumber(item.charge)+" VNĐ"}
                    title={item.name}
                    text={item.description}
                    action={() => alert("clicked")}
                  />
            </div>
              )
            })}
            </div>
          </TablesWrapper>
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
const TablesWrapper = styled.div`
  @media (max-width: 860px) {
    flex-direction: row;
  }
`;





