
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup, Alert, Image, Modal } from '@themesberg/react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Routes } from "../../routes";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Appointment from "../../api/appointment"
import Util from "../../utils"

export default (props) => {
    const { _appointment, isShow, handleCloseShowDetail } = props
    const { payment_amount, status, date, session_time, cancel_reason, examination_info, service_amount,
        payment_fee, fee_info, payment_date, services, medicines, children_id, images,
        doctor_avatar, doctor_email, doctor_fullName, doctor_id, payment_user_name, payment_user_email,
        patient_avatar, patient_email, patient_fullName, patient_id, patient_type, patient_phone
    } = _appointment

    let patient_info = (patient_type == 1) ? patient_email : patient_phone
    let payment_info = status == 4 ? payment_user_name + " (" + payment_user_email + ") - " + Util.FormatDate(payment_date) : ""
    let showImages = Util.isEmpty(images) ? [] : images?.split(";")
    let classTextStatus = status == 1 ? "text-success" : (status == 2 ? "text-danger" : (status == 3 ? "text-warning" : "text-info"))

    return (
        <>
            <Modal scrollable centered size="xl" show={isShow} className="modal-secondary" onHide={handleCloseShowDetail}>
                <Modal.Header>
                    <Modal.Title>
                        <p className="mb-0 pe-3 pe-md-0">
                            Lịch tái khám
                        </p>
                    </Modal.Title>
                    <Button variant="close" aria-label="Close" onClick={handleCloseShowDetail} />
                </Modal.Header>
                <Modal.Body scrollable>
                    <Card border="light" className="px-0 px-md-2 py-0 border-0" style={{ width: "100%" }}>
                        <Card.Body>
                            <Row>
                                <Col xs={12} xl={12}>
                                    <Card border="light" className="bg-white shadow-sm mb-4">
                                        <Card.Body>
                                            <Form>
                                                <Row className="mb-4">
                                                    <Col>
                                                        <h5>Thông tin chung</h5>
                                                    </Col>
                                                    <Col>
                                                        <Row className="justify-content-end">
                                                            <Col>
                                                                <Row>
                                                                    <Col md={1}>
                                                                        <FontAwesomeIcon className={`${classTextStatus}`} icon={faCircle}></FontAwesomeIcon>
                                                                    </Col>
                                                                    <Col>
                                                                        {status == 2 ? "Đã hủy" : (status == 4 ? "Đã thanh toán" : (status == 1 ? "Đã đặt lịch" : "Đã khám"))}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Col md={6}>
                                                        <Form.Group id="">
                                                            <Form.Label>Thời gian khám</Form.Label>
                                                            <Form.Control
                                                                value={session_time + ", " + Util.formatDate(date)}
                                                                required type="text"
                                                                disabled={true}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        {status == 2 ? <>
                                                            <Form.Group id="full_name">
                                                                <Form.Label>Lý do</Form.Label>
                                                                <Form.Control
                                                                    disabled={true}
                                                                    value={cancel_reason}
                                                                    required type="text" />
                                                            </Form.Group>
                                                        </> :
                                                            <></>}
                                                        {status == 4 ? <>
                                                            <Form.Group id="">
                                                                <Form.Label>Xác nhận thanh toán</Form.Label>
                                                                <Form.Control
                                                                    disabled={true}
                                                                    value={payment_info}
                                                                    required type="text" />
                                                            </Form.Group>
                                                        </> :
                                                            <></>}
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Col md={6} className="mb-3">
                                                        <Form.Group id="">
                                                            <Form.Label>Bác sĩ</Form.Label>
                                                            <Form.Control
                                                                disabled={true}
                                                                value={doctor_fullName + " (" + doctor_email + ")"}
                                                                required type="text" />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6} className="mb-3">
                                                        <Form.Group id="">
                                                            <Form.Label>Bệnh nhân</Form.Label>
                                                            <Form.Control
                                                                disabled={true}
                                                                value={patient_fullName + " (" + patient_info + ")"}
                                                                required type="text" />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Col md={6} className="mb-3">
                                                        <Form.Group id="">
                                                            <Form.Label>Dịch vụ khám bệnh</Form.Label>
                                                            <div className="border border-dark p-3 ps-5">
                                                                <Row className="mb-2">
                                                                    <Col md={8}>
                                                                        Tên dịch vụ
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        Giá dịch vụ
                                                                    </Col>
                                                                </Row>
                                                                {services?.map(item => {
                                                                    return (
                                                                        <Row key={item.id} className="mb-2">
                                                                            <Col md={8}>
                                                                                {item.name}
                                                                            </Col>
                                                                            <Col md={4}>
                                                                                {Util.formatNumber(item.charge)} VNĐ
                                                                            </Col>
                                                                        </Row>
                                                                    )
                                                                })}
                                                                <div className="my-2" style={{ height: "1px", backgroundColor: "gray" }}></div>
                                                                <Row>
                                                                    <Col md={8}>
                                                                        Tổng phí dịch vụ
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        {Util.formatNumber(service_amount)} VNĐ
                                                                    </Col>
                                                                </Row>
                                                            </div>

                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6} className="mb-3 ">
                                                        <Row>
                                                            {Util.isEmpty(payment_fee) ? <></> :
                                                                <Form.Group id="">
                                                                    <Form.Label>Phụ phí</Form.Label>
                                                                    <Row className="mb-3">
                                                                        <Col md={8}>
                                                                            Thông tin phụ phí
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            Phụ phí
                                                                        </Col>
                                                                        <Col md={8}>
                                                                            {fee_info}
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            {Util.formatNumber(payment_fee)} VNĐ
                                                                        </Col>
                                                                    </Row>
                                                                </Form.Group>
                                                            }
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Form.Group id="">
                                                                <Form.Label>Tổng chi phí</Form.Label>
                                                                <Form.Control
                                                                    disabled={true}
                                                                    value={Util.formatNumber(payment_amount) + " VNĐ"}
                                                                    required type="text" />
                                                            </Form.Group>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                                {(status == 3 || status == 4) ?
                                                    <>
                                                        <h5 className="mb-4">Chi tiết khám bệnh</h5>
                                                        <Row className="mb-3">
                                                            <Form.Group id="">
                                                                <Form.Label>Thông tin khám bệnh</Form.Label>
                                                                <Form.Control
                                                                    disabled={true}
                                                                    value={examination_info}
                                                                    required type="text" />
                                                            </Form.Group>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Form.Group id="">
                                                                <Form.Label>Ảnh khám bệnh</Form.Label>
                                                                <Row>

                                                                    {showImages?.map(item => {
                                                                        return (
                                                                            <Col md={3}>
                                                                                <img className="img-fluid img-thumbnail" src={item} />
                                                                            </Col>
                                                                        )
                                                                    })}
                                                                </Row>
                                                            </Form.Group>
                                                        </Row>
                                                        {medicines?.length > 0 ?
                                                            <Row className="mb-3">
                                                                <Form.Group id="">
                                                                    <div className="border border-dark p-3 ps-5">
                                                                        <Form.Label>Đơn thuốc</Form.Label>
                                                                        <Row className="mb-2">
                                                                            <Col md={4}>Tên thuốc</Col>
                                                                            <Col md={4}>Đơn vị thuốc</Col>
                                                                            <Col md={4}>Cách dùng</Col>
                                                                        </Row>
                                                                        {medicines?.map(item => {
                                                                            return (
                                                                                <Row className="mb-2">
                                                                                    <Col md={4}>
                                                                                        <Row>
                                                                                            <Col md={3}>
                                                                                                <img src={item.image} className="img-fluid img-thumbnail" />
                                                                                            </Col>
                                                                                            <Col>
                                                                                                {item.name}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                    <Col md={4}>{item.unit}</Col>
                                                                                    <Col md={4}>{item.usage}</Col>
                                                                                </Row>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </Form.Group>
                                                            </Row> : <></>}
                                                    </> : <></>}
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleCloseShowDetail()} variant="secondary " className="lightBg">Thoát</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
