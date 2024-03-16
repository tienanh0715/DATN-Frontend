
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faChartArea, faChartBar, faChartLine, faFlagUsa, faFolderOpen, faGlobeEurope, faPaperclip, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faAngular, faBootstrap, faReact, faVuejs } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Card, Image, Button, ListGroup, ProgressBar,Form } from '@themesberg/react-bootstrap';
import { CircleChart, BarChart, SalesValueChart, SalesValueChartphone } from "./Charts";
import  Util  from "../utils"
import Profile1 from "../assets/img/team/profile-picture-1.jpg";
import ProfileCover from "../assets/img/profile-cover.jpg";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack } from 'victory';
import Report from "../api/report";
import { useEffect } from "react";
import { useState } from "react";

export const ChoosePhotoWidget = (props) => {
  const { title, photo, onFileChange } = props;

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">{title}</h5>
        <div className="d-xl-flex align-items-center">
          <div className="user-avatar xl-avatar">
            <Image fluid rounded src={photo} />
          </div>
          <div className="file-field">
            <div className="d-flex justify-content-xl-center ms-xl-3">
              <div className="d-flex">
                <span className="icon icon-md">
                  <FontAwesomeIcon icon={faPaperclip} className="me-3" />
                </span>
                <input type="file" onChange={e=>onFileChange("avatar",e)} />
                <div className="d-md-block text-start">
                  <div className="fw-normal text-dark mb-1">Choose Image</div>
                  <div className="text-gray small">JPG, GIF or PNG. Max size of 800K</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export const InfoWidget = (props) => {
  const {title, number } = props;
  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <Row className="d-block d-xl-flex align-items-center">
          <Col xs={12} xl={12} className="px-xl-0">
            <div className="d-none d-sm-block">
              <h5>{title}</h5>
              <h3 className="mt-2 ">{number}</h3>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export const CircleChartIncomeWidget = (props) => {
  const { title } = props;
  const [income,setIncome] = useState([]);
  const series = income.map(d => d.value);
  useEffect(()=>{
    Report.getReportIncome().then(res=>{
      setIncome(res.data)
    })
  },[])
  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <Row className="d-block d-xl-flex align-items-center">
          <Col xs={12} xl={5} className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0">
            <CircleChart series={series} />
          </Col>
          <Col xs={12} xl={7} className="px-xl-0">
            <h5 className="mb-3">{title}</h5>

           
          </Col>
        </Row>
        <Row>
        {income.map(d => (
          <Col>
              <h6 key={`circle-element-${d.id}`} style={{"color":d.color}} className={`fw-normal`}>
                {` ${d.label} `}{`${Util.formatNumber(d.value) } VNĐ`}
              </h6> 
              </Col>
            ))}
        </Row>

       
           
      </Card.Body>
    </Card>
  );
};


export const ReportWidget = (props) => {
  const { title } = props
  const [data,setData] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [isAllDoctor,setIsAllDoctor] = useState(true)
  const [isAllPatient,setIsAllPatient] = useState(true)
  const [doctorIds,setDoctorIds] = useState([])
  const [patientIds,setPatientIds] = useState([])
  const selectDoctor=(id)=>{
    let newDoctorIds = []
    if(id==0)
    {
      setIsAllDoctor(true)
      doctors.forEach(doctor => {
        newDoctorIds.push(doctor.id)
      });
    }
    else
    {
      setIsAllDoctor(false)
      newDoctorIds.push(id)
    }
    setDoctorIds(newDoctorIds)
  }
  const selectPatient=(id)=>{
    let newPatientIds = []
    if(id==0)
    {
      setIsAllPatient(true)
      patients.forEach(patient => {
        newPatientIds.push(patient.id)
      });
    }
    else
    {
      setIsAllPatient(false)
      newPatientIds.push(id)
    }
    setPatientIds(newPatientIds)
  }
  useEffect(()=>{
    Report.getAllDoctor().then(res=>{
      setDoctors(res.data)
    })
    Report.getAllPatient().then(res=>{
      setPatients(res.data)
    })
    
  },[])
  useEffect(()=>{
    let data = {
      doctorIds : doctorIds,
      patientIds : patientIds
    }
    Report.getReportAppointments(data).then(res=>{
      let newData = []
      for(let i=1; i<=12; i++)
      {
        let foundIndex = res.data.findIndex(item=>item.month==i)
        if(foundIndex!=-1)
        {
          newData.push(res.data[foundIndex])
        }
        else
        {
          newData.push({
            month:i,
            examined_appointments:0,
            total_appointments:0
          })
        }
      }
      console.log("newData",newData)
      setData(newData)
    })
  },[doctorIds,patientIds,doctors,patients])
  useEffect(()=>{
    if(isAllDoctor)
    {
      console.log(doctors)
      let newDoctorIds=[]
      doctors.forEach(doctor => {
        newDoctorIds.push(doctor.id)
      });
      setDoctorIds(newDoctorIds)
    }
    if(isAllPatient)
    {
      let newPatientIds=[] 
      patients.forEach(doctor => {
        newPatientIds.push(doctor.id)
      });
      setPatientIds(newPatientIds)
    }
   
  },[doctors,patients])
  let examined = data?.map(item=>{
    return {month:item.month, value:item.examined_appointments}
  })
  let total =  data?.map(item=>{
    return {month:item.month, value:item.total_appointments - item.examined_appointments}
  })
  console.log(examined,total)
  return (
    <>
    <Row>
      <Col>
        <h3>{title}</h3>
      </Col>
      <Col>
        <Row>
          <Col >
          <Row className="flex-content-start">
            <Col md={2}>
              <div style={{backgroundColor:"#FFF59D",height:20,width:20}}></div></Col>
            <Col md={10}>
              Tất cả các lịch
            </Col>
          </Row>
          </Col>
          <Col >
          <Row>
            <Col  md={2}>
            <div style={{backgroundColor:"#F4511E",height:20,width:20}}></div>
            </Col>
            <Col md={10}>
            Lịch đã khám
            </Col>
          </Row>
          </Col>
        </Row>
        <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="gender">
                  <Form.Label>Bác sĩ</Form.Label>
                  <Form.Select defaultValue={isAllDoctor?0:doctorIds[0]} onChange={e=>selectDoctor(e.target.value)}>
                    <option value={0}>Tất cả</option>
                    {doctors?.map(item=>{
                      return <option value={item.id}>{item.full_name}</option>
                    })}
                  </Form.Select>
              </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
              <Form.Group id="gender">
                  <Form.Label>Bệnh nhân</Form.Label>
                  <Form.Select defaultValue={isAllPatient?0:patientIds[0]} onChange={e=>selectPatient(e.target.value)}>
                    <option value={0}>Tất cả</option>
                    {patients?.map(item=>{
                      return <option value={item.id}>{item.full_name}</option>
                    })}
                  </Form.Select>
              </Form.Group>
              </Col>
        </Row>
      </Col>
    </Row>
    <VictoryChart
          theme={VictoryTheme.material}
          width={200} // Đặt chiều rộng thành 300
          height={200} // Đặt chiều cao thành 200
        >
          <VictoryAxis
            tickValues={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
            style={{
              axis: { stroke: "black", strokeWidth:1}, // Đặt độ dày và màu sắc cho đường axis
              tickLabels: { fontSize: 4 }, // Đặt kích thước cho nhãn tick
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`${x}`)}
            style={{
              axis: { stroke: "black", strokeWidth: 1 }, // Đặt độ dày và màu sắc cho đường axis
              tickLabels: { fontSize: 4 }, // Đặt kích thước cho nhãn tick
            }}
          />
          <VictoryStack >
            <VictoryBar
              data={examined}
              x={"month"}
              y={"value"}
            />
            <VictoryBar
              data={total}
              x={"month"}
              y={"value"}
            />
          </VictoryStack>
    </VictoryChart>
    </>
    
  );
};
