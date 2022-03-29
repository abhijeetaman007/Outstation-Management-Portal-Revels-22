import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Loader from "./Loader";
import UserDashboard from "./UserDashboard";

function VerifiedUsers({ role }) {
  const [verifiedList, setVerifiedList] = useState([]);
  const [loading, setloading] = useState(true)

  const getVerifiedUsers = async () => {
    try {
      console.log("get vedgh")
      const res = await axios.get("/om/getverifiedusers", {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setloading(false);
      setVerifiedList(res.data.data);
      //console.log(res.data);
    } catch (error) {
      setloading(false)
      localStorage.removeItem("tokenid=");
      window.location.reload();
      console.log(error);
    }
  };
  useEffect(() => {
    //console.log(role);
    getVerifiedUsers();
  }, []);
  return (
    <UserDashboard activeTab={3}>
      <div>
      Total Count : {verifiedList.length}
      {loading == false ? (<>
        {verifiedList.map((user, ind) => {
        return <VerifiedList user={user} key={ind} />;
      })}
      </>) : (<Loader />)}
    </div>
    </UserDashboard>
  );
}

function VerifiedList({ user }) {
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
                    {user.accommodation.arrivalDateTime == null ? <span> NA </span> :
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
            {user.documents != undefined && <>
            
              {Object.keys(user.documents).map((doc, ind) => {
              return (
                <>
                  <div>
                    <p>{doc}</p>
                    {(user.documents[doc].type === "image/jpeg" ||
                      user.documents[doc].type === "image/png") && (
                      <img
                        src={user.documents[doc].url}
                        onClick={() => {
                          setIsOpen(!modalIsOpen);
                          setModalImg(user.documents[doc].url);
                          setdoc(doc);
                        }}
                      />
                    )}

                    {user.documents[doc].type === "application/pdf" && (

                      <>
                      <a  href={user.documents[doc].url} className="downloadbtn">
                      <i
                            className="fa fa-download "
                            
                          ></i>PDF
                      </a>
                        
                      </>
                    )}
                    

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
            </>}
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifiedUsers;
