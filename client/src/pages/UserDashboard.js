import React,{useState} from "react";
import "../styles/userdash.css";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import CollegeList from "./CollegeList";
import UnverifiedUsers from "./UnverifiedUsers";
import RejectedUsers from "./RejectedUsers";
function UserDashboard() {
  const auth = useAuth();
  const [tab, settab] = useState(0)
  return (
    <div className="user-dash">
      <h1>OUTSTATION MANAGEMENT</h1>
      <p>
        welcome, <span>itsik159@gmail.com!</span> <button onClick={auth.logout}>Log Out <i class="fa fa-power-off" ></i></button>
      </p>
      <div className="tabs-section">
        {/* <div className="tab"><i class="fa fa-university"></i>Colleges</div> */}
        <div className={tab === 0 ? "tab" : "tab inactive"} onClick={() =>settab(0)}>Colleges</div>
        <div className={tab === 1 ? "tab" : "tab inactive"} onClick={() =>settab(1)}><i class="fa fa-info"></i>Unverified Users</div>
        <div className={tab === 2 ? "tab" : "tab inactive"} onClick={() =>settab(2)}><i class="fa fa-ban"></i>Rejected Users</div>
      </div>
      <div className="tab-content">
        {tab === 0 ? <CollegeList /> : (tab === 1 ? <UnverifiedUsers /> :  <RejectedUsers />)}
        
      </div>
    </div>
  );
}

export default UserDashboard;
