import React,{useContext} from 'react';
import {UserContext} from "../../context/userContext";
import Navbar from "./Navbar.jsx"

const DashboardLayout = ({children}) => {
    const {user} = useContext(UserContext);
  return (
    <div>
      <Navbar/>
      {user && <div className="px-8 pt-2">{children}</div>}
      
    </div>
  )
}

export default DashboardLayout
