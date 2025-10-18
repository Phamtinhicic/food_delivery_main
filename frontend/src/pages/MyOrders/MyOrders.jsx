import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/confirm-delivery",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        alert("Xác nhận đã nhận hàng thành công!");
        fetchOrders(); // Reload orders
      } else {
        alert(response.data.message || "Không thể xác nhận");
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      alert("Lỗi khi xác nhận nhận hàng");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);
  return (
    <div className="my-orders">
      <h2>Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " X " + item.quantity;
                  } else {
                    return item.name + " X " + item.quantity + ",";
                  }
                })}
              </p>
              <p>${order.amount}.00</p>
              <p>items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span>
                <b> {order.status}</b>
              </p>
              {order.status === "Out for delivery" ? (
                <button onClick={() => confirmDelivery(order._id)}>
                  Xác nhận đã nhận hàng
                </button>
              ) : (
                <button onClick={fetchOrders}>Track Order</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
