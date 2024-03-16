
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBoxOpen, faChartPie, faCog, faFileAlt, faHandHoldingUsd, faSignOutAlt, faTable, faTimes, faCalendarAlt, faMapPin, faInbox, faRocket, faPersonBooth, faBuilding, faUser, faHistory, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Accordion, Navbar, Row } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile2 from '../assets/img/team/profile-picture-2.jpg'
import LogoIcon from "../assets/svg/Logo";

export default (props = {}) => {
  const { userLogin} = useSelector(state => {
    return {
      userLogin: state.user.userLogin
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const logout = async () =>{
    console.log("logout")
    await dispatch.user.logout()
    navigate(Routes.Home.path,{replace:true})
  }
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };
  const LogoNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };



  const NavItem = (props) => {
    const { title, link, external, target, icon, image, logo, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = (pathname.includes(link) && link !=Routes.Home.path)? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon fa-solid"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}
            {logo ? <span className="pe-2">{logo}</span>: null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.DashboardOverview.path}>
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block text-black`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image src={Profile2} className="card-img-top rounded-circle border-white" />
                </div>
                <div className="d-block">
                  <h6>Xin chào, {userLogin.first_name}</h6>
                  <Button as={Link} variant="secondary" size="xs" to={Routes.Signin.path} className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" onClick={()=>logout()} /> Đăng xuất
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
                <NavItem title="Trang chủ" logo={<LogoIcon />} link={Routes.Home.path}  /> 
                {userLogin.code=="ADMIN"?
                <>
                  <NavItem title="Thống kê" link={Routes.DashboardOverview.path}  />
                  <CollapsableNavItem eventKey="categories/" title="Quản lý danh mục" icon={faFileAlt}>
                    <NavItem title="Dịch vụ khám bệnh" icon={faBuilding} link={Routes.ServiceList.path}/>
                    <NavItem title="Thuốc" icon={faBuilding} link={Routes.MedicineList.path}/>
                  </CollapsableNavItem>
                  <NavItem title="Quản lý nhân viên" icon={faUser} link={Routes.StaffsList.path} />
                  <NavItem title="Quản lý bác sĩ" icon={faPersonBooth} link={Routes.DoctorsList.path} />
                </>
                :<></>}
                <NavItem title="Quản lý lịch khám" icon={faPersonBooth} link={Routes.AppointmentsList.path} />
                {(userLogin.code=="ADMIN" || userLogin.code=="STAFF")?
                  <NavItem title="Quản lý thanh toán" icon={faPersonBooth} link={Routes.CheckoutList.path} />:<></>  
                }
                <NavItem title="Quản lý bệnh nhân" icon={faPersonBooth} link={Routes.PatientsList.path} />
                {userLogin.code=="DOCTOR"?<></>:<NavItem title="Quản lý khách" icon={faPersonBooth} link={Routes.GuestsList.path} />
                }
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
