import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoSignOut } from 'react-icons/go';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  signOutUserStart, 
  signOutUserSuccess, 
  signOutUserFailure 
} from '../Redux/User/userSlice.js';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('No user is logged in!');
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:3001/api/user/update/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success('User Updated Successfully!');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) {
      toast.error('No user is logged in!');
      return;
    }
    console.log("Current User Object:", currentUser);
    console.log("User Token:", currentUser.token);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:3001/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error response:', errorData); 
        dispatch(deleteUserFailure(errorData.message || 'Failed to delete user'));
        toast.error(errorData.message || 'Failed to delete user');
        return;
      }
  
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }
  
      dispatch(deleteUserSuccess(data));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error in DELETE request:', error); 
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('http://localhost:3001/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      toast.success(data);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleShowListings = async () => {
    if (!currentUser) {
      toast.error('No user is logged in!');
      return;
    }
    try {
      setShowListingsError(false);
      const res = await fetch(`http://localhost:3001/api/user/listings/${currentUser._id}`,{
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      toast.success(data);
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="container my-5">
        <h1 className="text-center my-4">Profile</h1>
        <p className="text-danger text-center">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center my-5">
    <div className="col-md-6 col-lg-5 p-4 rounded shadow bg-light">
      <h1 className="text-center mb-4">Profile</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-3">
          <input
            type="text"
            placeholder="Username"
            value={formData.username || ""}
            id="username"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="email"
            placeholder="Email"
            value={formData.email || ""}
            id="email"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <button disabled={loading} className="btn btn-primary w-100">
          {loading ? "Updating Info..." : "Update"}
        </button>
        <Link className="btn btn-success w-100 mt-3" to={"/create-listing"}>
          Create Listing
        </Link>
      </form>

      {/* Sign Out & Delete */}
      <div className="d-flex justify-content-between mb-3">
        <span
          onClick={handleDeleteUser}
          className="text-danger pointer text-decoration-underline"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-danger pointer text-decoration-underline"
        >
          Sign Out <GoSignOut />
        </span>
      </div>

      {/* Error Messages */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Show Listings Button */}
      <button
        onClick={handleShowListings}
        className="btn btn-outline-success w-100 mt-3"
      >
        Show Listings
      </button>

      {showListingsError && (
        <p className="text-danger text-center mt-2">Error Showing Listings</p>
      )}

      {/* Listings Section */}
      {userListings.length > 0 && (
        <div className="list-group mt-4">
          <h2 className="text-center">Your Listings</h2>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Link
                to={`/listing/${listing._id}`}
                className="d-flex align-items-center text-decoration-none"
              >
                <img
                  src={listing.imageUrls[0]}
                  alt="listing"
                  className="rounded"
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <span className="text-dark">{listing.name}</span>
              </Link>
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
}
