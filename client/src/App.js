import "./App.css";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import axios from 'axios';
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
        </Routes>
      </AuthProvider>
      <Toaster position="bottom-center"/>
    </BrowserRouter>
  );
}

export default App;
