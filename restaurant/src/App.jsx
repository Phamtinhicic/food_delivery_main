import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Restaurant Pages
import {
  OrderManagement,
  MenuManagement
} from "./pages";

// Import Components
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  // Backend URL - can be configured via environment variable
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  
  return (
    <div className="app">
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Login url={url}/>} />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrderManagement url={url}/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/menu" 
            element={
              <ProtectedRoute>
                <MenuManagement url={url}/>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
