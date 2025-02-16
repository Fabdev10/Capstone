import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import Spinner from '../Components/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/api/listing/get/${params.listingId}`);
        const data = await res.json();
  
        if (!data || data.error) { 
          setError(true);
          setLoading(false);
          return;
        }
  
        setListing(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error.message);
        setError(true);
        setLoading(false);
      }
    };
  
    fetchListing();
  }, [params.listingId]);
  
  

  return (
    <main className="container mt-4">
      {loading && <Spinner />}
      {error && <p className="text-danger text-center h4">Something went wrong</p>}

      {listing && !loading && !error && (
        <div>
          {/* Bootstrap Carousel */}
          <div id="listingCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {listing.imageUrls.map((url, index) => (
                <div key={url} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <img src={url} className="d-block w-100" alt="Listing Image" style={{ maxHeight: '500px', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#listingCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#listingCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>

          {/* Copy Link Button */}
          <div className="position-fixed top-0 end-0 m-3">
            <button className="btn btn-light shadow" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}>
              <FaShare />
            </button>
            {copied && <div className="alert alert-success mt-2">Link copied!</div>}
          </div>

          {/* Listing Details */}
          <div className="card mt-4 p-4">
            <h2 className="card-title">{listing.name} - ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()} {listing.type === 'rent' && '/ month'}</h2>
            <p className="text-muted"><FaMapMarkerAlt className="text-success" /> {listing.address}</p>
            
            <div className="d-flex gap-3">
              <span className={`badge bg-${listing.type === 'rent' ? 'danger' : 'primary'}`}>{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</span>
              {listing.offer && <span className="badge bg-success">${listing.regularPrice - listing.discountPrice} OFF</span>}
            </div>

            <p className="mt-3"><strong>Description: </strong>{listing.description}</p>
            
            <ul className="list-inline mt-3">
              <li className="list-inline-item"><FaBed /> {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</li>
              <li className="list-inline-item ms-3"><FaBath /> {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</li>
              <li className="list-inline-item ms-3"><FaParking /> {listing.parking ? 'Parking Spot' : 'No Parking'}</li>
              <li className="list-inline-item ms-3"><FaChair /> {listing.furnished ? 'Furnished' : 'Unfurnished'}</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
