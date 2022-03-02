import React, { useState, useEffect } from "react";
import axios from "axios";
function RejectedUsers() {
  const [rejectedList, setrejectedList] = useState([]);
  const [expanded, setexpanded] = useState(false);

  const getRejectedUsers = async () => {
    try {
      const res = await axios.get(`/om/getrejectedusers`, {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setrejectedList(res.data.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    getRejectedUsers();
  }, []);
  return (
    <div>
      Total Count : {rejectedList.length}
      {rejectedList.map((user, ind) => {
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
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default RejectedUsers;
