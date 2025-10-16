import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from "react-toastify";

const Verify = () => {
    const [searchParams,setSearchParams]=useSearchParams();
    const success=searchParams.get("success");
    const orderId=searchParams.get("orderId");
    // Stripe returns a `session_id` query param after checkout
    const sessionId = searchParams.get("session_id");
    const {url} =useContext(StoreContext);
    const navigate= useNavigate();

    const verifyPayment=async()=>{
            if (sessionId) {
                // capture Stripe session server-side
                const response = await axios.post(url + "/api/order/capture", { orderId, sessionId });
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success("Order Placed Successfully");
                } else {
                    toast.error("Payment verification failed");
                    navigate("/");
                }
            } else {
                // fallback to previous verify flow
                const response = await axios.post(url+"/api/order/verify",{success,orderId});
                if(response.data.success){
                    navigate("/myorders");
                    toast.success("Order Placed Successfully");
                }else{
                    toast.error("Something went wrong");
                    navigate("/");
                }
            }
    }
    useEffect(()=>{
        verifyPayment();
    },[])
  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify
