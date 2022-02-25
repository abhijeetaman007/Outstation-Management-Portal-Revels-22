import React, { useState, useEffect } from "react";
import axios from "axios";
function RejectedUsers() {
  const [rejectedList, setrejectedList] = useState([]);
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
      console.log(error.response);
    }
  };
  useEffect(() => {
    getRejectedUsers();
  }, []);
  return (
    <div>
      RejectedUsers
      {rejectedList.map((clg, ind) => {
        return (
          <>
            <h1>Yet to be Implemented</h1>
          </>
        );
      })}
    </div>
  );
}

export default RejectedUsers;
