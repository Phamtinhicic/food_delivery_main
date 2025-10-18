import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All"); // Filter state

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      url + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
    }
  };
  
  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
  }, []);

  // Filter orders based on selected filter
  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true;
    if (filter === "Completed") return order.status === "Delivered";
    if (filter === "Cancelled") return order.status === "Cancelled";
    if (filter === "Active") return order.status !== "Delivered" && order.status !== "Cancelled";
    return order.status === filter;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Food Processing": return "#ff9800";
      case "Preparing": return "#2196f3";
      case "Out for delivery": return "#9c27b0";
      case "Delivered": return "#4caf50";
      case "Cancelled": return "#f44336";
      default: return "#757575";
    }
  };

  return (
    <div className="order add">
      <h3>Order Management</h3>
      
      {/* Filter buttons */}
      <div className="order-filters">
        <button 
          className={filter === "All" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("All")}
        >
          All ({orders.length})
        </button>
        <button 
          className={filter === "Active" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("Active")}
        >
          Active ({orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length})
        </button>
        <button 
          className={filter === "Completed" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("Completed")}
        >
          Completed ({orders.filter(o => o.status === "Delivered").length})
        </button>
        <button 
          className={filter === "Cancelled" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("Cancelled")}
        >
          Cancelled ({orders.filter(o => o.status === "Cancelled").length})
        </button>
      </div>

      <div className="order-list">
        {filteredOrders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
              
              {/* Show cancel reason if cancelled */}
              {order.status === "Cancelled" && order.cancelReason && (
                <p className="order-cancel-reason">
                  <strong>Cancel Reason:</strong> {order.cancelReason}
                </p>
              )}
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            
            {/* Status badge and selector */}
            <div className="order-status-container">
              <div 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </div>
              
              {/* Only show dropdown if not completed or cancelled */}
              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
