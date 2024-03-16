import React from "react"
import {
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { Routes} from '../../routes'
const AuthStatus = () => {

  const dispatch = useDispatch()
  let navigate = useNavigate()
  const dictionary = useSelector(state => state.language.dictionary)

  const user = useSelector(state => state.user.userLogin)

  return (
    <></>
    // <AuthStatusView user={user} signout={dispatch.user.logout} navigate={navigate} dictionary={dictionary} />
  )
}

const RequireAuth = ({ children}) => {

  let location = useLocation()
  const user = useSelector(state => state.user.userLogin)
  console.log(user.code !="PATIENT")
  if ( user.id == 0 || user.code =="PATIENT") {
    return <Navigate to={Routes.Signin.path} state={{ from: location }} replace />
  }

  return children
}


export {RequireAuth,AuthStatus}