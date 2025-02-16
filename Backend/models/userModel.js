import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, 
    },
    username: {
      type: String,
      unique: true,
      sparse: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, 
    },
    avatar: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
