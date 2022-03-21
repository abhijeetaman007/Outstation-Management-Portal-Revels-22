import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
function UnverifiedUsers() {
  const [unverifiedList, setunverifiedList] = useState([]);
  const [searchUser, setsearchUser] = useState("");

  const getUnverifiedUsers = async () => {
    try {
      const res = await axios.get(`/om/getunverifiedusers`, {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setunverifiedList(res.data.data);
      //console.log(res.data);
    } catch (error) {
      //console.log(error.response);
    }
  };

  useEffect(() => {
    getUnverifiedUsers();
  }, []);
  return (
    <div>
      Total Count : {unverifiedList.length}
      <div className="search-box">
        <input
          type="text"
          class="login-input start-label"
          placeholder="Search User"
          value={searchUser}
          onChange={(e) => setsearchUser(e.target.value)}
        />
        <i class="fa fa-search "></i>
      </div>
      {unverifiedList
        .filter((user) => {
          const searchTerm = user.name + user.userID;

          return (
            searchTerm.toLowerCase().includes(searchUser.toLowerCase()) &&
            user.documents != undefined
          );
        })
        .map((user, ind) => {
          return <UnverifiedList user={user} />;
        })}
    </div>
  );
}

function UnverifiedList({ user }) {
  const [expanded, setexpanded] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");
  const [docName, setdoc] = useState("");
  // useEffect(() => {
  //   Object.keys(user.documents).map(key => {
  //     console.log(key) // returns the keys in an object
  //     console.log(user.documents[key].url)  // returns the appropriate value
  //  })
  // }, []);

  const changeStatusButton = (e, userID, action) => {
    confirmAlert({
      title: `${action}`,
      message: `User ID : ${userID}`,
      buttons: [
        {
          label: "Yes",
          onClick: () => changeStatus(e, `${userID}`, `${action}`),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const changeStatus = async (e, userID, action) => {
    e.preventDefault();
    let str;
    if (action == "Verify") {
      str = "/om/verify";
    }
    if (action == "Reject") {
      str = "/om/reject";
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
      //console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.msg, { id: toastId });
        window.location.reload();
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

  const changeFileStatus = async (e, status, userID, fileType) => {
    const toastId = toast.loading("Loading...");
    try {
      const res = await axios.post(
        "/om/changefilestatus",
        { userID, status, fileType },
        {
          headers: {
            authorization: `${localStorage.getItem("tokenid=")}`,
          },
        }
      );
      //console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.msg, { id: toastId });
        //window.location.reload();
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

  return (
    <>
      {" "}
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
              <p>
                <i className="fa fa-phone"></i>
                {user.mobileNumber}
              </p>
              <p>{user.branch}</p>
              <p>{user.registrationNumber}</p>
            </div>
            <div className="user-right">
              {user.accommodation.required === true ? (
                <>
                  <p>Arrival :</p>
                  <p>
                    <i className="fa fa-calendar"></i>{" "}
                    {user.accommodation.arrivalDateTime
                      .toString()
                      .substr(0, 10)}
                  </p>
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
            {Object.keys(user.documents).map((doc, ind) => {
              
              return (
                <>
                  <div>
                    <p>{doc}</p>
                    <img
                      src={user.documents[doc].url}
                      onClick={() => {
                        setIsOpen(!modalIsOpen);
                        setModalImg(user.documents[doc].url);
                        setdoc(doc);
                      }}
                    />
                    <div>
                      {user.documents[doc].status === 0 && (
                        <>
                          <i
                            className="fa fa-check fa-2x"
                            onClick={(e) =>
                              changeFileStatus(e, 1, `${user.userID}`, `${doc}`)
                            }
                          ></i>
                          <i
                            className="fa fa-times fa-2x"
                            onClick={(e) =>
                              changeFileStatus(e, 2, `${user.userID}`, `${doc}`)
                            }
                          ></i>{" "}
                        </>
                      )}
                      {user.documents[doc].status === 1 && <p style={{color: "green"}}>Accepted</p>}
                      {user.documents[doc].status === 2 && <p style={{color: "red"}}>Rejected</p>}
                    </div>

                    <Modal
                      isOpen={modalIsOpen}
                      onRequestClose={() => setIsOpen(!modalIsOpen)}
                      contentLabel="Docs"
                      style={{
                        overlay: {
                          position: 'fixed',
                          
                          backgroundColor: 'rgba(0, 0, 0)'
                        },
                        
                      }}
                    >
                      <p>{docName}</p>
                      <img src={modalImg} />
                    </Modal>
                  </div>
                </>
              );
            })}
          </div>
          <div className="btns">
            <button
              className="verify"
              onClick={(e) => changeStatusButton(e, `${user.userID}`, "Verify")}
            >
              Verify
            </button>
            <button
              className="verify reject"
              onClick={(e) => changeStatusButton(e, `${user.userID}`, "Reject")}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnverifiedUsers;
