import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

function VerifiedUsers({ role }) {
  const [verifiedList, setVerifiedList] = useState([]);

  const getVerifiedUsers = async () => {
    try {
      const res = await axios.get("/om/getverifiedusers", {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setVerifiedList(res.data.data);
      //console.log(res.data);
    } catch (error) {
      //console.log(error);
    }
  };
  useEffect(() => {
    //console.log(role);
    getVerifiedUsers();
  }, []);
  return (
    <div>
      Total Count : {verifiedList.length}
      {verifiedList.map((user, ind) => {
        return <VerifiedList user={user} key={ind} />;
      })}
    </div>
  );
}

function VerifiedList({ user }) {
  const [expanded, setexpanded] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");

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
                      }}
                    />

                    <Modal
                      isOpen={modalIsOpen}
                      onRequestClose={() => setIsOpen(!modalIsOpen)}
                      contentLabel="Docs"
                    >
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

export default VerifiedUsers;
