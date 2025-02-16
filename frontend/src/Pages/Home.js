import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/bundle';
import ListingItem from '../Components/ListingItem.js';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);


  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* Top Section */}
      <div className="container text-center py-5">
        <h1 className="display-4 fw-bold text-dark">
          Find your next <span className="text-secondary">perfect</span> <br />
          place with ease
        </h1>
        <p className="text-muted">
          EPICODE Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </p>
        <Link to="/search" className="fw-bold text-primary text-decoration-underline">
          Let's get started...
        </Link>
      </div>

      {/* Swiper (Carousel) Section */}
      <div className="container mb-5">
        <Swiper navigation modules={[Navigation]} className="rounded">
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  className="w-100 rounded"
                  style={{
                    height: "500px",
                    background: `url(${listing.imageUrls[0]}) center/cover no-repeat`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Listings Section */}
      <div className="container my-5">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 fw-semibold text-dark">Recent Offers</h2>
              <Link className="text-primary text-decoration-underline" to="/search?offer=true">
                Show more offers
              </Link>
            </div>
            <div className="row">
              {offerListings.map((listing) => (
                <div className="col-md-4 mb-3" key={listing._id}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 fw-semibold text-dark">Recent Places for Rent</h2>
              <Link className="text-primary text-decoration-underline" to="/search?type=rent">
                Show more places for rent
              </Link>
            </div>
            <div className="row">
              {rentListings.map((listing) => (
                <div className="col-md-4 mb-3" key={listing._id}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 fw-semibold text-dark">Recent Places for Sale</h2>
              <Link className="text-primary text-decoration-underline" to="/search?type=sale">
                Show more places for sale
              </Link>
            </div>
            <div className="row">
              {saleListings.map((listing) => (
                <div className="col-md-4 mb-3" key={listing._id}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
