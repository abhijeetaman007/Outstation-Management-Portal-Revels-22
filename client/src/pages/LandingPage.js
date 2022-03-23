import React, { useState } from "react";
import "../styles/landing.css";
import logo from "../assets/revels-logo.png";
import mitlogo from "../assets/mit-logo.png";

import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function LandingPage() {
  const auth = useAuth();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");

    try {
      const res = await auth.login(email, password);
      console.log(res.msg);
      if (res.success) {
        toast.success(res.msg, {id: toastId });
        //console.log(res.data.category);
        //navigate(`/admin/sdd`);
      } else {
        toast.error(res.msg, {  id: toastId });
      }
    } catch (error) {
      toast.error(error.response.data.msg, {
        id: toastId,
      });
    }
  };

  return (
    <div className="landingpage">
      <div className="top-center">
        <h1>OUTSTATION MANAGEMENT</h1>
      </div>
      <div className="content">
        <div className="logo-box">
          <img src={logo} />
          <h1>REVELS '22</h1>
        </div>
        <div className="verticalLine"></div>
        <div className="auth-box">
          <form>
            <h2>Welcome Back!</h2>
            <div className="login-field">
              <i className="login-icon fa fa-user"></i>
              <input
                type="text"
                className="login-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <div className="login-field">
                <i className="login-icon fa fa-lock"></i>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" onClick={handleLogin}>Log In</button>
          </form>
        </div>
      </div>
      
      
      <div className="bottom-center">
        <img src={mitlogo} />
        <div className="icons">
          <a href="https://www.instagram.com/revelsmit">
            <i className="fa fa-instagram fa-2x"></i>
          </a>

          <a href="https://www.facebook.com/mitrevels">
            <i className="fa fa-facebook fa-2x"></i>
          </a>
          <i className="fa fa-google fa-2x"></i>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
