
import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';

import { InfoWidget, CircleChartIncomeWidget, ReportWidget} from "../../components/Widgets";
import { NewPatientsTable } from "../../components/Tables";

import Report from "../../api/report"
import { useState } from "react";

export default () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [accounts,setAccounts] = useState({})
  useEffect(()=>{
    Report.getReportAccounts().then(res=>{
      setAccounts(res.data)
    })
  },[])
  console.log(accounts)
  return (
    <>
      <Row>
      <Col xs={12} sm={3} xl={4} className="mb-4">
          <InfoWidget
            title="Tổng số bệnh nhân"
            number={accounts.patient}
          />
        </Col>

        <Col xs={12} sm={3} xl={4} className="mb-4">
          <InfoWidget
            title="Tổng số bác sĩ"
            number={accounts.doctor}
          />
        </Col>
        <Col xs={12} sm={3} xl={4} className="mb-4">
          <InfoWidget
            title="Tổng số nhân viên"
            number={accounts.staff}
          />
        </Col>

        <Col xs={12} sm={3} xl={4} className="mb-4">
          <InfoWidget
            title="Tổng số khách"
            number={accounts.guest}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
      
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <ReportWidget
            title={`Thống kê lịch khám bệnh (Năm ${currentYear})`}
          />
        </Col>    
        
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} sm={8} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <NewPatientsTable />
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={4} xl={4} className="mb-4">
                  <CircleChartIncomeWidget
                    title={"Doanh thu (Năm " +currentYear+")"}
                     />
                </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
