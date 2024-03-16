import React from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Assets
import CloseIcon from "../../../assets/svg/CloseIcon";
import LogoIcon from "../../../assets/svg/Logo";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, ListGroup, InputGroup } from '@themesberg/react-bootstrap';
import { faBell, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Routes } from "../../../routes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  const { isLogin, userLogin} = useSelector(state => {
    return {
      isLogin:  state.user.isLogin,
      userLogin:  state.user.userLogin,
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logout = async () =>{
    console.log("logout")
    await dispatch.user.logout()
    navigate(Routes.Home.path,{replace:true})
  }
  // console.log("user",userLogin)
  // console.log("isLogin",isLogin)

  return (
    <Wrapper className="animate darkBg" sidebarOpen={sidebarOpen}>
      <SidebarHeader className="flexSpaceCenter">
        <div className="flexNullCenter">
          <LogoIcon />
          <h1 className="whiteColor font20" style={{ marginLeft: "15px" }}>
            Phòng khám Tiến Anh
          </h1>
        </div>
        <CloseBtn onClick={() => toggleSidebar(!sidebarOpen)} className="animate pointer">
          <CloseIcon />
        </CloseBtn>
      </SidebarHeader>

      <UlStyle className="flexNullCenter flexColumn">
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="home"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Trang chủ
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="doctors"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Đội ngũ bác sĩ
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="services"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Dịch vụ khám
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="blog"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Bài viết
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="pricing"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Chi phí
          </Link>
        </li>
        {/* <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="contact"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Liên hệ
          </Link>
        </li> */}
      </UlStyle>
      <UlStyle className="flexSpaceCenter">
        <li className="semiBold font15 pointer">
          <a href="/" style={{ padding: "10px 30px 10px 0" }} className="whiteColor">
            Đăng nhập
          </a>
        </li>
        {
          isLogin?
          <>
            {userLogin.code=="PAITEN"?
            <>

            </>:
            <>
              <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                    <div className="media d-flex align-items-center">
                      <Image src={userLogin.avatar} className="user-avatar md-avatar rounded-circle" />
                      <div className="d-flex flex-column media-body ms-2 text-dark">
                        <span className="mb-0 font-small fw-bold">{userLogin.full_name}</span>
                        <span className="mb-0 font-small">{userLogin.code=="ADMIN"?"Quản trị viên":(userLogin.code=="DODCTOR"?"Bác sĩ":"Nhân viên")}</span>
                      </div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                    <Dropdown.Item className="fw-bold">
                      <FontAwesomeIcon icon={faUserCircle} className="me-2" /> Sửa thông tin cá nhân
                    </Dropdown.Item>
                    <Dropdown.Item className="fw-bold">
                      <FontAwesomeIcon icon={faCog} className="me-2" /> Đổi mật khẩu
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="fw-bold" onClick={()=>logout()}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2"/> Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
            </>
          }
          </>:
          <>
            <li className="semiBold font15 pointer flexCenter">
              <a href="/" className="radius8 lightBg" style={{ padding: "10px 15px" }}>
                Đặt lịch khám luôn
              </a>
            </li>
          </>
        }
         <>
            <li className="semiBold font15 pointer flexCenter">
              <a target="_blank" href="https://l.facebook.com/l.php?u=https%3A%2F%2Fforms.gle%2FAkUj3ffdsA4pMebV9%3Ffbclid%3DIwAR1Z2gDqVISgm-P21_AxSLfh41_6xI2RbTWS5tb_ak2pWnV_x2nAd-w9r_0&h=AT0SU52BiRCW_g6TpIiA84a0wsE18vLgFBUUegJCE9CC2_yB6hWXtBk-NZHIpmP0b4uf0BD6oMcEow5sdWSh9PCxawln6_uUi3HXpl2u-40seZHeHvb3LRaEr-akQT0IsSX7_QbjR6M7wnpa2I8z4A" className="radius8 lightBg" style={{ padding: "10px 15px" }}>
                Đánh giá
              </a>
            </li>
          </>
        
      </UlStyle>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  width: 400px;
  height: 100vh;
  position: fixed;
  top: 0;
  padding: 0 30px;
  right: ${(props) => (props.sidebarOpen ? "0px" : "-400px")};
  z-index: 9999;
  @media (max-width: 400px) {
    width: 100%;
  }
`;
const SidebarHeader = styled.div`
  padding: 20px 0;
`;
const CloseBtn = styled.button`
  border: 0px;
  outline: none;
  background-color: transparent;
  padding: 10px;
`;
const UlStyle = styled.ul`
  padding: 40px;
  li {
    margin: 20px 0;
  }
`;
