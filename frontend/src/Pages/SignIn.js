import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../Redux/User/userSlice.js';
import usePasswordToggle from '../Hooks/PasswordToggle';
import { GoogleLogin } from '@react-oauth/google';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:3001/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }
      localStorage.setItem('user', JSON.stringify(data));

      dispatch(signInSuccess(data));
      toast.success('User Logged In Successfully!');
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error('Login failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    try {
      const res = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
        credentials: 'include', 
      });
  
      const data = await res.json();
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        dispatch(signInSuccess(data));
        toast.success('User Logged In Successfully with Google!');
        navigate('/');
      } else {
        toast.error(data.message || 'Google Sign-In failed. Please try again.');
      }
    } catch (error) {
      toast.error('Google login error.');
      console.error('Google login error: ', error);
    }
  };

  // Google Login Failure handler
  const handleGoogleFailure = (error) => {
    toast.error('Google login failed. Please try again.');
    console.log('Google Login Error: ', error);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="text-center mb-4">Sign In</h1>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded border bg-light">
            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                required
                onChange={handleChange}
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="mb-3">
  <label htmlFor="password" className="form-label">Password</label>

  <div className="input-group input-group-sm">
    <input
      type={PasswordInputType}
      className="form-control"
      id="password"
      placeholder="Enter your password"
      value={formData.password}
      required
      onChange={handleChange}
    />
    
    {/* Toggle Icon Inside Input Group */}
    <span className="input-group-text bg-white border-0" style={{ cursor: 'pointer' }}>
      {ToggleIcon}
    </span>
  </div>
</div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Google OAuth Button */}
            <div className="mt-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
              />
            </div>
          </form>

          {/* Sign-Up Link */}
          <div className="text-center mt-3">
            <p>Don't have an account? </p>
            <Link to="/sign-up" className="text-primary">
              Sign Up
            </Link>
          </div>

          {/* Error Handling */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
}
