import mongoose from 'mongoose';
import orderModel from './models/orderModel.js';

const checkOrders = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/FoodDelivery');
        console.log('DB Connected');
        
        const totalOrders = await orderModel.countDocuments();
        console.log('\n=== TOTAL ORDERS:', totalOrders, '===\n');
        
        const orders = await orderModel.find().sort({ date: -1 }).limit(10);
        
        orders.forEach((order, index) => {
            console.log(`\n--- Order ${index + 1} ---`);
            console.log('ID:', order._id);
            console.log('Status:', order.status);
            console.log('Amount:', order.amount);
            console.log('Payment:', order.payment ? 'Yes' : 'No');
            console.log('Date:', order.date);
            console.log('Items:', order.items.length);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkOrders();
