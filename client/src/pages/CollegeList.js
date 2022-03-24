import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/userdash.css";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import Loader from "./Loader";

function CollegeList() {
  const [collges, setcollges] = useState([]);
  const [collegeName, setcollegeName] = useState("");
  const [searchCollege, setsearchCollege] = useState("");
  const [collegeState, setcollegeState] = useState("");
  const [expanded, setexpanded] = useState(false);
  const [isMahe, setisMahe] = useState(false);
  const [itemperpage, setitemperpage] = useState(10);
  const getCollegeList = async () => {
    try {
      const res = await axios.get(`/om/getcolleges`, {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setcollges(res.data.data);
      //console.log(res.data);
    } catch (error) {
      localStorage.removeItem("tokenid=");
      window.location.reload();
      //console.log(error.response);
    }
  };

  const addCollege = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    if (collegeName === "") {
      toast.error("Please enter college name", {
        id: toastId,
      });
      return;
    }
    if (collegeState === "") {
      toast.error("Please enter college state", {
        id: toastId,
      });
      return;
    }
    try {
      const res = await axios.post(
        `/om/addcollege`,
        { name: collegeName, isMahe: isMahe },
        {
          headers: {
            authorization: `${localStorage.getItem("tokenid=")}`,
          },
        }
      );
      //console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.msg, { id: toastId });
        //console.log(res.data.category);
        //navigate(`/admin/sdd`);
        setcollegeName("");
        setisMahe(false);
        setexpanded(false);
        getCollegeList();
      } else {
        toast.error(res.data.msg, { id: toastId });
      }
    } catch (error) {
      toast.error(error.response.data.msg, {
        id: toastId,
      });
    }
  };

  const blockCollegeConfirm = (e, name) => {
    confirmAlert({
      title: `Block`,
      message: `${name}`,
      buttons: [
        {
          label: "Yes",
          onClick: () => blockCollege(e, `${name}`),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  const blockCollege = async (e, name) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    try {
      const res = await axios.post(
        `/om/blockcollege`,
        { name },
        {
          headers: {
            authorization: `${localStorage.getItem("tokenid=")}`,
          },
        }
      );
      //console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.msg, { id: toastId });
        getCollegeList();
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
    getCollegeList();
  }, []);
  return (
    <div>
      
      <div className="add-college-btn">
        <div className="unverified-header">
          <p>Add College</p>
          <i
            className={expanded ? "fa fa-minus" : "fa fa-plus"}
            onClick={() => setexpanded(!expanded)}
          ></i>
        </div>
        <div className={expanded ? "extended" : "not-extended"}>
          <div className="add-college">
            <input
              type="text"
              className="login-input start-label"
              placeholder="Enter College Name"
              value={collegeName}
              onChange={(e) => setcollegeName(e.target.value)}
            />
            <input
              type="text"
              className="login-input start-label"
              placeholder="State"
              value={collegeState}
              onChange={(e) => setcollegeState(e.target.value)}
            />
            <label>
              Under MAHE?
              <input
                type="checkbox"
                checked={isMahe}
                onChange={() => setisMahe(!isMahe)}
              />
            </label>
            <button onClick={addCollege}>Add </button>
          </div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          className="login-input start-label"
          placeholder="Search"
          value={searchCollege}
          onChange={(e) => setsearchCollege(e.target.value)}
        />
        <i className="fa fa-search "></i>
      </div>
      
      
      
      {collges.length !=0 ? (
        <>
          {collges
            .slice(0, parseInt(itemperpage))
            .filter((clg) => {
              const searchTerm = clg.name;
              return searchTerm
                .toLowerCase()
                .includes(searchCollege.toLowerCase());
            })
            .map((clg, ind) => {
              return (
                <div className="college" key={ind}>
                  <h2 className={clg.isMahe ? "isMahe" : ""}>{clg.name}</h2>
                  <i
                    className="fa"
                    onClick={(e) => blockCollegeConfirm(e, `${clg.name}`)}
                  >
                    block
                  </i>
                </div>
              );
            })}
          <button
            style={{
              backgroundColor: "black",
              padding: "10px",
              color: "white",
            }}
            onClick={(e) => setitemperpage(parseInt(itemperpage) + 10)}
          >
            Show More
          </button>{" "}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default CollegeList;
