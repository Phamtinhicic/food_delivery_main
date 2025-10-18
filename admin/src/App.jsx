import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
// Import Restaurant Interface Components
import {
  Dashboard,
  OrderManagement,
  MenuManagement,
  StoreManagement
} from "./restaurant-interface";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";

const App = () => {
  // use Vite env variable if provided (VITE_API_URL), otherwise default to local backend
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard url={url}/>} />
          <Route path="/login" element={<Login url={url}/>} />
          <Route path="/dashboard" element={<Dashboard url={url}/>} />
          <Route path="/order-management" element={<OrderManagement url={url}/>} />
          <Route path="/menu-management" element={<MenuManagement url={url}/>} />
          <Route path="/store-management" element={<StoreManagement url={url}/>} />
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
