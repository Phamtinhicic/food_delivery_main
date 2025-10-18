// Quick script to check users in MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  cartData: { type: Object, default: {} },
}, { minimize: false });

const User = mongoose.model('user', userSchema);

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery');
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`\n📊 Total users: ${users.length}\n`);
    
    users.forEach(user => {
      console.log(`👤 ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    if (users.length === 0) {
      console.log('\n⚠️  No users found in database!');
      console.log('💡 You need to create an admin account first.');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers();
