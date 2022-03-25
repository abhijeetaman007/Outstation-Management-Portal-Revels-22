import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Loader from "./Loader";

function RejectedUsers({ role }) {
  const [rejectedList, setrejectedList] = useState([]);
  const [loading, setloading] = useState(true)

  const getRejectedUsers = async () => {
    try {
      const res = await axios.get("/om/getrejectedusers", {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setrejectedList(res.data.data);
      setloading(false);
      //console.log(res.data);
    } catch (error) {
      localStorage.removeItem("tokenid=");
      window.location.reload();
      setloading(false);
      //console.log(error.response.data);
    }
  };
  useEffect(() => {
    //console.log(role);
    getRejectedUsers();
  }, []);
  return (
    <div>
      Total Count : {rejectedList.length}
      {loading == false ? (
        <>
          {rejectedList.map((user, ind) => {
            return <RejectedList user={user} key={ind} />;
          })}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

function RejectedList({ user }) {
  const [expanded, setexpanded] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");
  const [docName, setdoc] = useState("");

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
                    {user.accommodation.arrivalDateTime == null ? <>NA</>:
                    <>
                    {user.accommodation.arrivalDateTime
                      .toString()
                      .substr(0, 10)}
                    </>
                      }
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
                      }}
                    />

                    <Modal
                      isOpen={modalIsOpen}
                      onRequestClose={() => setIsOpen(!modalIsOpen)}
                      contentLabel="Docs"
                      style={{
                        overlay: {
                          position: "fixed",

                          backgroundColor: "rgba(0, 0, 0)",
                        },
                      }}
                      ariaHideApp={false}
                    >
                      <p>{docName}</p>
                      <img src={modalImg} />
                    </Modal>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default RejectedUsers;
