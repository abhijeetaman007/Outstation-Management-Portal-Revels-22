import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function UnverifiedUsers() {
  const [unverifiedList, setunverifiedList] = useState([]);
  const [expanded, setexpanded] = useState(false);
  const [searchUser, setsearchUser] = useState("");

  const getUnverifiedUsers = async () => {
    try {
      const res = await axios.get(`/om/getunverifiedusers`, {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setunverifiedList(res.data.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  const changeStatus = async (e, userID , action) => {
    e.preventDefault();
    let str;
    if(action == "Verify"){
      str = '/om/verify'
    }
    if(action == "Reject"){
      str = '/om/reject'
    }
    const toastId = toast.loading("Loading...");
    try {
      const res = await axios.post(
        `${str}`,
        { userID },
        {
          headers: {
            authorization: `${localStorage.getItem("tokenid=")}`,
          },
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.msg, { id: toastId });
        getUnverifiedUsers();
        //console.log(res.data.category);
        //navigate(`/admin/sdd`);
      } else {
        toast.error(res.data.msg, { id: toastId });
      }
    } catch (error) {
      toast.error(error.response.data.msg, {
        id: toastId,
      });
    }
  };
  useEffect(() => {
    getUnverifiedUsers();
  }, []);
  return (
    <div>
      Total Count : {unverifiedList.length}
      <div style={{ width: "40%", margin: "20px auto" }}>
        <input
          type="text"
          class="login-input start-label"
          placeholder="Search User"
          value={searchUser}
          onChange={(e) => setsearchUser(e.target.value)}
        />
        <i class="fa fa-search "></i>
      </div>
      {unverifiedList.filter((user) => {
          const searchTerm = user.name + user.userID;
          return searchTerm.toLowerCase().includes(searchUser.toLowerCase());
        }).map((user, ind) => {
        return (
          <>
            <div className="unverified">
              <div className="unverified-header">
                <h2>
                  {user.name}
                  <br />
                  <p>{user.userID}</p>
                </h2>
                <p>{user.college}</p>
                <i
                  className={expanded ? "fa fa-angle-up" : "fa fa-angle-down"}
                  onClick={() => setexpanded(!expanded)}
                ></i>
              </div>
              <div className={expanded ? "extended" : "not-extended"}>
                <div className="user-dets">
                <div className="user-left">
                <p><i className="fa fa-phone"></i>{user.mobileNumber}</p>
                  <p>
                   
                    {user.branch}
                  </p>
                  <p>{user.registrationNumber}</p>
                  
                </div>
                <div className="user-right">
                  
                  {user.accommodation.required === true ? (
                    <>
                    
                    <p>Arrival :</p>
                      <p><i className="fa fa-calendar"></i> {user.accommodation.arrivalDate}</p>
                      <p><i className="fa fa-clock-o"></i> {user.accommodation.arrivalTime}</p>
                    </>
                  ) : (
                    <>
                    <p>Accommodation :</p>
                    <p>Not Required</p>
                    </>
                  )}
                </div>
                </div>
                <div className="doc-img">
                  <img src ="https://m.media-amazon.com/images/I/81jh9fuDcmS._SX522_.jpg" />
                  <img src ="https://m.media-amazon.com/images/I/81W5nfYYxoL._SL1500_.jpg" />
                </div>
                <div className="btns">
                <button className="verify" onClick={(e) => changeStatus(e, `${user.userID}` ,  'Verify')}>Verify</button>
                <button className="verify reject" onClick={(e) => changeStatus(e, `${user.userID}`  ,'Reject')}>Reject</button>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default UnverifiedUsers;
