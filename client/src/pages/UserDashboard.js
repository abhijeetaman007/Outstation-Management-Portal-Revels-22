import React, { useState, useEffect } from "react";
import "../styles/userdash.css";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import CollegeList from "./CollegeList";
import UnverifiedUsers from "./UnverifiedUsers";
import RejectedUsers from "./RejectedUsers";
import logo from "../assets/revels-logo.png";
import axios from "axios";
import VerifiedUsers from "./VerifiedUsers";
function UserDashboard() {
  const auth = useAuth();
  const [tab, settab] = useState(0);
  const [user, setuser] = useState(null);
  const getOMUser = async () => {
    try {
      const res = await axios.get(`/om/getomuser`, {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setuser(res.data.data);
      //console.log(res.data);
    } catch (error) {
      localStorage.removeItem("tokenid=");
      window.location.reload();
      //console.log(error.response);
    }
  };

  useEffect(() => {
    getOMUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="user-dash">
      <div className="top">
        <img src={logo} />
        <h1>OUTSTATION MANAGEMENT</h1>
      </div>

      <p>
        welcome, <span>{user.name}</span>{" "}
        <button onClick={auth.logout}>
          Log Out <i className="fa fa-power-off"></i>
        </button>
      </p>
      <div className="tabs-section">
        {/* <div className="tab"><i class="fa fa-university"></i>Colleges</div> */}
        <div
          className={tab === 0 ? "tab" : "tab inactive"}
          onClick={() => settab(0)}
        >
          Colleges
        </div>
        <div
          className={tab === 1 ? "tab" : "tab inactive"}
          onClick={() => settab(1)}
        >
          <i className="fa fa-info"></i>Unverified Users
        </div>
        <div
          className={tab === 2 ? "tab" : "tab inactive"}
          onClick={() => settab(2)}
        >
          <i className="fa fa-ban"></i>Rejected Users
        </div>
        <div
          className={tab === 3 ? "tab" : "tab inactive"}
          onClick={() => settab(3)}
        >
          Verified
        </div>
      </div>
      <div className="tab-content">
        {tab === 0 ? (
          <CollegeList />
        ) : tab === 1 ? (
          <UnverifiedUsers />
        ) : tab === 2 ? (
          <RejectedUsers role={tab}/>
        ) : (
          <VerifiedUsers role={tab}/>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
