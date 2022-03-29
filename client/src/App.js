import "./App.css";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import axios from 'axios';
import UnverifiedUsers from "./pages/UnverifiedUsers";
import CollegeList from "./pages/CollegeList";
import RejectedUsers from "./pages/RejectedUsers";
import VerifiedUsers from "./pages/VerifiedUsers";
function App() {
  axios.defaults.baseURL = process.env.REACT_APP_baseUrl;
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route exact path="/dashboard" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }/>
            <Route exact path="/dashboard/colleges" element={
              <PrivateRoute>
                <CollegeList />
              </PrivateRoute>
            }/>
            <Route exact path="/dashboard/unverified" element={
              <PrivateRoute>
                <UnverifiedUsers />
              </PrivateRoute>
            }/>
            <Route exact path="/dashboard/rejected" element={
              <PrivateRoute>
                <RejectedUsers />
              </PrivateRoute>
            }/>
            <Route exact path="/dashboard/verified" element={
              <PrivateRoute>
                <VerifiedUsers />
              </PrivateRoute>
            }/>
        </Routes>
      </AuthProvider>
      <Toaster position="bottom-center"/>
    </BrowserRouter>
  );
}

export default App;
