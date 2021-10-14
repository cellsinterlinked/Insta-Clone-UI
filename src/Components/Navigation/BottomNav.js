import React from 'react'
import './BottomNav.css';
import {BsHouseDoor} from 'react-icons/bs';
import { BsSearch } from 'react-icons/bs';
import { BsPlusSquare } from 'react-icons/bs';
import { BsHeart } from 'react-icons/bs'
import { IoPersonCircle } from 'react-icons/io5'
import { NavLink } from 'react-router-dom';

const  BottomNav = ({notificationNumber}) => {
  return(
  <div className="bottomNavWrapper">
        <NavLink style={{textDecoration: "none"}} className="bottom-nav-icon-wrapper" to='/home'><BsHouseDoor  style={{textDecoration: "none"}}className="bottom-nav-icon"/></NavLink>
        <NavLink style={{textDecoration: "none"}} className="bottom-nav-icon-wrapper" to='/search'><BsSearch  style={{textDecoration: "none"}}className="bottom-nav-icon"/></NavLink>
        <NavLink style={{textDecoration: "none"}} className="bottom-nav-icon-wrapper" to='/create'><BsPlusSquare  style={{textDecoration: "none"}}className="bottom-nav-icon"/></NavLink>

        <NavLink style={{textDecoration: "none", position: "relative"}} className="bottom-nav-icon-wrapper" to='/activity'>
          {(notificationNumber && notificationNumber > 0) ? <div className="notification-bubble">{notificationNumber}</div> : <div></div>}
          <BsHeart  style={{textDecoration: "none"}}className="bottom-nav-icon"/></NavLink>

        <NavLink style={{textDecoration: "none"}} className="bottom-nav-icon-wrapper" to='/account'><IoPersonCircle  style={{textDecoration: "none"}}className="bottom-nav-icon"/></NavLink>
  </div>

  )
}

export default BottomNav