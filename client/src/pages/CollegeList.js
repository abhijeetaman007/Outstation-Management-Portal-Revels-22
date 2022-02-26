import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/userdash.css";
import toast from "react-hot-toast";

function CollegeList() {
  const [collges, setcollges] = useState([]);
  const [collegeName, setcollegeName] = useState("");
  const [searchCollege, setsearchCollege] = useState("");
  const [isMahe, setisMahe] = useState(false)
  const getCollegeList = async () => {
    try {
      const res = await axios.get(`/om/getcolleges`, {
        headers: {
          authorization: `${localStorage.getItem("tokenid=")}`,
        },
      });
      setcollges(res.data.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response);
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
   console.log(isMahe);
    try {
      const res = await axios.post(
        `/om/addcollege`,
        { name: collegeName , isMahe : isMahe},
        {
          headers: {
            authorization: `${localStorage.getItem("tokenid=")}`,
          },
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.msg, { id: toastId });
        //console.log(res.data.category);
        //navigate(`/admin/sdd`);
        setcollegeName("");
        setisMahe(false);
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
      console.log(res.data);
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
      <div className="add-college">
        <input
          type="text"
          class="login-input"
          placeholder="Enter College Name"
          value={collegeName}
          onChange={(e) => setcollegeName(e.target.value)}
        />
        <label>
          Under MAHE?
          <input type="checkbox" checked={isMahe} onChange={()=>setisMahe(!isMahe)} />
        </label>
        <button onClick={addCollege}>Add College</button>
      </div>
      <div style={{ width: "40%", margin: "20px auto" }}>
        <input
          type="text"
          class="login-input"
          placeholder="Search"
          value={searchCollege}
          onChange={(e) => setsearchCollege(e.target.value)}
        />
        <i class="fa fa-search "></i>
      </div>
      {collges.filter((clg) => {
          const searchTerm = clg.name;
          return searchTerm.toLowerCase().includes(searchCollege.toLowerCase());
      }).map((clg, ind) => {
        return (
          <div className="college">
            <h2 className={clg.isMahe ? "isMahe": ""}>{clg.name}</h2>
            <i className="fa" onClick={(e) => blockCollege(e, `${clg.name}`)}>
              block
            </i>
          </div>
        );
      })}
    </div>
  );
}

export default CollegeList;
