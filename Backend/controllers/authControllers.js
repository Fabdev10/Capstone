import bcryptjs from 'bcryptjs';
import User from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User Created Successfully!');
  } catch (error) {
    next(error);
  }
};


export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found!'));
    }
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Invalid Credentials'));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',  
    });
    const validUserObject = validUser.toObject();
    console.log(validUserObject);  
    if (validUserObject.password) {
      const { password, ...userData } = validUserObject;  
      console.log(userData);  


      res.cookie('access_token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',  
        sameSite: 'Lax',  
      })
        .status(200)
        .json({ ...userData, token });  
    } else {
    
      return next(errorHandler(500, 'Password not found on user object.'));
    }
  } catch (error) {
    console.error(error);  
    next(error); 
  }
};

export const google = async (req, res, next) => {
  try { const { token } = req.body; 
  if (!token) return res.status(400).json({ message: "Token is required" });
  const decoded = jwtDecode(token);
  const { email, name, picture } = decoded; 
  if (!email) return res.status(400).json({ message: "Invalid token, email missing" });
  let user = await User.findOne({ email });
  if (user) {
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { password: pass, ...rest } = user._doc;
    return res
      .cookie('access_token', authToken, { httpOnly: true })
      .status(200)
      .json({ ...rest, token: authToken });
  } 
  user = new User({
    username: name,
    email, 
    avatar: picture,
  });
  await user.save();
  const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const { password: pass, ...rest } = user._doc; 
  return res
    .cookie('access_token', authToken, { httpOnly: true })
    .status(200)
    .json({ ...rest, token: authToken });
} catch (error) {
  next(error);
}
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User Logged Out Successfully!');
  } catch (error) {
    next(error);
  }
};