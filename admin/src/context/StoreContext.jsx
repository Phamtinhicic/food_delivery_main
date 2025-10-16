import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // --- Phần quản lý đăng nhập (Phần bạn đã có) ---
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);

  // --- Các hàm tương tác với API (Phần thiếu) ---
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };
  
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };
  
  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };
  
  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
  }

  // --- useEffect để tải tất cả dữ liệu cần thiết ---
  useEffect(() => {
    async function loadData() {
      await fetchFoodList(); // Tải danh sách món ăn
      if (localStorage.getItem("token")) {
        const userToken = localStorage.getItem("token");
        setToken(userToken);
        await loadCartData(userToken); // Tải giỏ hàng nếu có token
      }
      if (localStorage.getItem("admin")) {
        setAdmin(localStorage.getItem("admin"));
      }
    }
    loadData();
  }, []);

  // --- Tất cả các giá trị được cung cấp cho toàn bộ ứng dụng ---
  const contextValue = {
    url,
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    admin,
    setAdmin,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;