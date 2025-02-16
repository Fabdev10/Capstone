import { FaSearch} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); 
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]); 

  return (
    <header className="shadow-sm bg-light">
    <div className="container py-3 d-flex justify-content-between align-items-center">
      {/* Logo */}
      <Link to="/" className="text-decoration-none">
        <h1 className="h5 fw-bold m-0">
          <span className="text-muted">EPICODE</span>
          <span className="text-dark">ESTATE</span>
        </h1>
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="d-flex bg-white rounded shadow-sm px-3 py-2"
      >
        <input
          type="text"
          className="form-control border-0 me-2"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-outline-secondary">
          <FaSearch />
        </button>
      </form>

      {/* Navigation Links */}
      <ul className="nav">
        <li className="nav-item">
          <Link to="/" className="nav-link text-dark d-none d-sm-block">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link text-dark d-none d-sm-block">
            About
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="rounded-circle shadow-sm"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
            ) : (
              <span className="text-dark">Sign In</span>
            )}
          </Link>
        </li>
      </ul>
    </div>
  </header>
  );
}
