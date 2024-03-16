
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH,  faEye,  faLock,faPlusCircle,faMinusSquare,faEdit, faCircle, faMoneyCheckAlt, faMoneyCheck, faSpinner, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Card,  Table, Dropdown,Alert, Modal,Button, Form ,Row,Col} from '@themesberg/react-bootstrap';
import { Panigation } from "../../components/Panigation";
import Util from "../../utils"
import { useDispatch, useSelector } from "react-redux";
import avatarDefault from '../../assets/img/avatar_default.jpg'


export const CheckoutTable = (props) => {
    const { userLogin } = useSelector(state => {
        return {
            userLogin:  state.user.userLogin,
        }
    })
   
   const { data, pageSize } = props
    const TableRow = (props) => {
      const dispatch = useDispatch()
      const { index, id,parent_id,payment_amount, status,date,session_time,
        doctor_avatar,doctor_email,doctor_fullName,doctor_id,children_id,
        patient_avatar,patient_email,patient_fullName,patient_type,patient_phone,payment_date,
        payment_user_name,payment_user_email,payment_user_avatar
        } = props 
      const { handleVisible, setSaveSuccess, setMessageAlert} = props

      const [showCheckout, setShowCheckout] = useState(false);
      const handleCloseCheckout = () => setShowCheckout(false);
      
    const checkout = async (checkout_id)=>{
        let data ={
            id:checkout_id,
            payment_user_id:userLogin.id,
            status:4
        }
        let _response = await dispatch.checkout.edit(data)
        if(_response.result == "okie")
        {
            setSaveSuccess(true)
            setMessageAlert("Xác nhận thanh toán thành công!")
        }
        else
        {
            setMessageAlert("Xác nhận thanh toán lịch thất bại! Lý do: " + _response.message)
        }
        handleVisible()
    }
    
    return (
        <>
        <Modal centered show={showCheckout} className="modal-secondary" onHide={handleCloseCheckout}>
            <Modal.Header>
            <Button variant="close" aria-label="Close" onClick={handleCloseCheckout} />
            </Modal.Header>
            <Modal.Body>
            <div className="text-center">
                <Modal.Title className="h4 my-3">Xác nhận lịch đã được thanh toán ?</Modal.Title>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="white" size="sm" onClick={()=>checkout(id)}>Đồng ý</Button>
            <Button variant="white" size="sm" onClick={handleCloseCheckout}>Hủy</Button>
            </Modal.Footer>
        </Modal>
        <tr className="border-bottom">
              <td>
              <a className="d-flex align-items-center card-link">
                      <div className="d-block">
                          <span className="fw-bold">{index+1}</span>
                      </div>
                  </a>
              </td>
              <td>
                    <div className="d-block align-items-start">
                        <span className="row ">{session_time}</span>
                        <span className="row">{Util.formatDate(date)}</span>
                    </div>
              </td>
              <td>
                  <a className="d-flex align-items-center" onClick={()=>{}}>
                      <img src={Util.isEmpty(doctor_avatar)? avatarDefault :doctor_avatar} className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="row">{doctor_fullName}</span>
                          <span className="row">{doctor_email}</span>
                      </div>
                  </a>
              </td>
              <td>
                  <a className="d-flex align-items-center" onClick={()=>{}}>
                      <img src={Util.isEmpty(patient_avatar)? avatarDefault :patient_avatar } className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="row">{patient_fullName}</span>
                          {patient_type==1?
                          <span className="row">{patient_email}</span>:
                          <span className="row">{patient_phone}</span>}
                      </div>
                  </a>
              </td>
              <td><span className="fw-normal">{Util.formatNumber(payment_amount)} VNĐ</span></td>
              {userLogin.code=="STAFF"?<></>:
              <td>
                {status==3?<></>:
                    <a className="d-flex align-items-center" onClick={()=>{}}>
                      <img src={Util.isEmpty(payment_user_avatar)? avatarDefault :payment_user_avatar } className="user-avatar md-avatar rounded-circle me-3"/>
                      <div className="d-block">
                          <span className="row">{payment_user_name}</span>
                          <span className="row">{payment_user_email}</span>

                      </div>
                  </a>}
            </td>
              }

            <td>{status==3?"Chưa thanh toán":<span className="fw-normal">{Util.FormatDate(payment_date)}</span>}</td>
            {userLogin.code=="STAFF"?<>
            <td>
                {status==3 ?<>
                  <div className="d-flex btn-group ">
                    <FontAwesomeIcon icon={faMoneyCheck} onClick={() => setShowCheckout(true)} className="me-2 cursor-pointer"/>
                  </div>
                </>:<></>}
              </td>
            </>:<></>}
        </tr>
        </>

      );
    };

    const [dataShow, setdataShow]= useState([])

    // panigation
    const onChangePage = (pageOfItems) => {
        // update state with new page of items
        //console.log('pageOfItems',pageOfItems)
        setdataShow( pageOfItems )
    }

    const [visibleAlert, setVisibleAlert] = useState(false)
    const handleVisible = () => {  
        setVisibleAlert(true)
        setTimeout(() => {
            setVisibleAlert(false)
        }, 2000);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    } 
    const [ saveSuccess, setSaveSuccess] = useState(false)
    const [ messageAlert, setMessageAlert] = useState("")

    return (
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0 min-vh-100 ">
            <div className="d-flex mb-3">
                {visibleAlert?
                    <Alert variant={saveSuccess?"success":"danger"} className="ms-3 my-0">
                        {messageAlert}
                    </Alert>
                :<></>
                }
          </div>
          <Table responsive className="checkout-table align-items-center table table-hover  ">
            <thead className="thead-light">
                <tr>
                <th className="border-bottom">STT</th>
                    <th className="border-bottom">Thời gian khám</th>
                    <th className="border-bottom">Bác sĩ</th>
                    <th className="border-bottom">Bệnh nhân</th>
                    <th className="border-bottom">Tổng chi phí</th>
                    {userLogin.code=="STAFF"?<></>:
                    <th className="border-bottom">Xác nhận thanh toán</th>}
                    <th className="border-bottom">Thời gian thanh toán</th>
                    {userLogin.code=="STAFF"?<>
                    <th className="border-bottom">Thao tác</th>
                    </>:<></>}
                </tr>
            </thead>
            <tbody className="border-0  min-vh-50" >
              {dataShow.length>0 && dataShow.map((checkout,index) => 
              <TableRow key={`checkout-${checkout.id}`} {...checkout} index={index} handleVisible={handleVisible} setSaveSuccess={setSaveSuccess} setMessageAlert={setMessageAlert} />
              )}
            </tbody>
          </Table>
          <Panigation pageSize={pageSize} items={data} onChangePage={onChangePage}/>
        </Card.Body>
      </Card>
    );
  };