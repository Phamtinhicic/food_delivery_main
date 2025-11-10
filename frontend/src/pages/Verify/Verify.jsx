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
            try {
                // Always use session_id from Stripe (COD removed)
                if (!sessionId || !success) {
                    toast.error("Invalid payment session");
                    navigate("/");
                    return;
                }

                const response = await axios.post(url + "/api/order/verify", { 
                    session_id: sessionId, 
                    success 
                });
                
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success("Order Placed Successfully");
                } else {
                    toast.error("Payment verification failed");
                    navigate("/");
                }
            } catch (error) {
                console.error("Verify error:", error);
                toast.error("Error verifying payment");
                navigate("/");
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
