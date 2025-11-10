import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [restaurant, setRestaurant] = useState(false);
  const url = import.meta.env.MODE === 'production' 
    ? "https://backend-production-847c.up.railway.app" 
    : "http://localhost:4000";

  useEffect(() => {
    async function loadData() {
      const storedToken = localStorage.getItem("token");
      const isRestaurant = localStorage.getItem("restaurant");
      
      if (storedToken) {
        setToken(storedToken);
        if (isRestaurant === "true") {
          setRestaurant(true);
        }
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    token,
    setToken,
    restaurant,
    setRestaurant,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
