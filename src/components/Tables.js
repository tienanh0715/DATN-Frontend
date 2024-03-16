
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import { useEffect } from "react";
import Report from "../api/report";
import { useState } from "react";
import Util from "../utils";


export const NewPatientsTable = () => {
  const [patients,setPatients] = useState([])
  useEffect(()=>{
    Report.getReportPatient().then(res=>{
      setPatients(res.data)
    })
  },[])
  const TableRow = (props) => {
    const { full_name, email, phone, created_date } = props;
    return (
      <tr>
        <th scope="row">{full_name}</th>
        <td>{email}</td>
        <td>{phone}</td>
        <td>
          {Util.formatDate(created_date) }
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Bệnh nhân mới</h5>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Họ và tên</th>
            <th scope="col">Email</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {patients?.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)}
        </tbody>
      </Table>
    </Card>
  );
};
