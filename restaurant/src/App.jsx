import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Restaurant Pages
import {
  Dashboard,
  OrderManagement,
  MenuManagement,
  StoreManagement
} from "./pages";

// Import Components
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

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
          <Route path="/" element={<Dashboard url={url}/>} />
          <Route path="/dashboard" element={<Dashboard url={url}/>} />
          <Route path="/orders" element={<OrderManagement url={url}/>} />
          <Route path="/menu" element={<MenuManagement url={url}/>} />
          <Route path="/store" element={<StoreManagement url={url}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
