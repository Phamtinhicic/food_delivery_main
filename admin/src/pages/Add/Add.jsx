import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useEffect } from "react";
import {useNavigate, useSearchParams } from "react-router-dom";

const Add = ({url}) => {
  const navigate=useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEditMode = !!editId;
  
  const {token,admin} = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    
    if (isEditMode) {
      // Update mode
      formData.append("id", editId);
      if (image) {
        formData.append("image", image);
      }
      
      const response = await axios.put(`${url}/api/food/update`, formData, {headers:{token}});
      if (response.data.success) {
        toast.success("Food item updated successfully!");
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } else {
      // Add mode
      formData.append("image", image);
      const response = await axios.post(`${url}/api/food/add`, formData,{headers:{token}});
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  // Load food data for edit mode
  const loadFoodData = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        const food = response.data.data.find(item => item._id === editId);
        if (food) {
          setData({
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category,
          });
          setExistingImage(food.image);
        }
      }
    } catch (error) {
      console.error("Error loading food data:", error);
      toast.error("Failed to load food data");
    }
  };

  useEffect(()=>{
    if(!admin && !token){
      toast.error("Please Login First");
       navigate("/");
    }
    if (isEditMode) {
      loadFoodData();
    }
  },[editId])
  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image {isEditMode && "(Leave empty to keep current image)"}</p>
          <label htmlFor="image">
            <img
              src={
                image 
                  ? URL.createObjectURL(image) 
                  : existingImage 
                    ? `${url}/images/${existingImage}` 
                    : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required={!isEditMode}
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="$20"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          {isEditMode ? "UPDATE" : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default Add;
