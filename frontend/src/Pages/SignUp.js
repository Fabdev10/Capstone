import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import usePasswordToggle from '../Hooks/PasswordToggle.js';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.username) {
      toast.error('All fields are required!');
      return;
    }
    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(formData.email)) {
      toast.error('Please enter a valid email address!');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      toast.success('User Created Successfully!');
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError('An error occurred while creating the user.');
      toast.error(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="text-center my-4">Sign Up</h1>
          <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-white">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                required
                placeholder="Enter your username"
                value={formData.username} 
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
  <label htmlFor="password" className="form-label">Password</label>
  
  <div className="input-group">
    <input
      type={PasswordInputType}
      className="form-control"
      id="password"
      required
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
    />
  
    <span className="input-group-text bg-white border-0" style={{ cursor: 'pointer' }}>
      {ToggleIcon}
    </span>
  </div>
</div>
      

            <div className="mb-3">
  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
  
  <div className="input-group">
    <input
      type={PasswordInputType}
      className="form-control"
      id="confirmPassword"
      required
      placeholder="Confirm your password"
      value={formData.confirmPassword}
      onChange={handleChange}
    />
    
    {/* Toggle Icon Inside Input Group */}
    <span className="input-group-text bg-white border-0" style={{ cursor: 'pointer' }}>
      {ToggleIcon}
    </span>
  </div>
</div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creating User..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-3">
            <p>Already have an account?</p>
            <Link to="/sign-in">
              <span className="text-primary">Sign In</span>
            </Link>
          </div>

          {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
}
