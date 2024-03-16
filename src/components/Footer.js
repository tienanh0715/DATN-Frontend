
import React from "react";
import moment from "moment-timezone";
import { Row, Col, Card } from '@themesberg/react-bootstrap';

export default (props) => {
  const currentYear = moment().get("year");
  return (
    <div className="mt-auto">
      <footer className="bg-white rounded shadow p-5 mb-2 mt-4">
        <Row>
          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <p className="mb-0 text-center text-xl-left">
              Copyright ©{`${currentYear} `}
              <Card.Link href="#" target="_blank" className="text-blue text-decoration-none fw-normal">
                TienAnh
              </Card.Link>
            </p>
          </Col>
          <Col xs={12} lg={6}>
            <ul className="list-inline list-group-flush list-group-borderless text-center text-xl-right mb-0">
              <li className="list-inline-item px-0 px-sm-2">
                <Card.Link href="#" target="_blank">
                  Giới thiệu
                </Card.Link>
              </li> 
              <li className="list-inline-item px-0 px-sm-2">
                <Card.Link href="#" target="_blank">
                  Hỗ trợ
                </Card.Link>
              </li>
              <li className="list-inline-item px-0 px-sm-2">
                <Card.Link href="#" target="_blank">
                  Liên hệ
                </Card.Link>
              </li>
            </ul>
          </Col>
        </Row>
      </footer>
    </div>
  );
};
