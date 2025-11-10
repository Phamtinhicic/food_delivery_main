import React, { useContext, useEffect } from "react";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { restaurant, setRestaurant, token, setToken } = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const response = await axios.post(url + "/api/user/login", data);
    if (response.data.success) {
      if (response.data.role === "restaurant") {
        setToken(response.data.token);
        setRestaurant(true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("restaurant", true);
        toast.success("(^.^) Đăng nhập thành công!");
        navigate("/dashboard");
      } else {
        toast.error("Bạn không có quyền truy cập giao diện nhà hàng");
      }
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    if (restaurant && token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Restaurant Login</h2>
          <p>Login to manage your restaurant</p>
        </div>
        <div className="login-popup-inputs">
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Mật khẩu"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
