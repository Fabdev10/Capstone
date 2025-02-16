import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner.js';
import ListingItem from '../Components/ListingItem';

export default function Search() {
  const navigate = useNavigate();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Update here
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const funrnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: funrnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`http://localhost:3001/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [window.location.search]); 

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(window.location.search); 
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }

    setListings([...listings, ...data]);
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar Section */}
      <div className="border-end p-4 p-md-7 w-100">
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="searchTerm" className="font-weight-bold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="form-control"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex flex-column gap-2">
            <label className="font-weight-bold">Types:</label>
            <div className="d-flex gap-2">
              <input
                type="radio"
                id="all"
                className="form-check-input"
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <label htmlFor="all" className="form-check-label">Rent & Sale</label>
            </div>
            <div className="d-flex gap-2">
              <input
                type="radio"
                id="rent"
                className="form-check-input"
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <label htmlFor="rent" className="form-check-label">Rent</label>
            </div>
            <div className="d-flex gap-2">
              <input
                type="radio"
                id="sale"
                className="form-check-input"
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <label htmlFor="sale" className="form-check-label">Sale</label>
            </div>
            <div className="d-flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="form-check-input"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <label htmlFor="offer" className="form-check-label">Offer</label>
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <label className="font-weight-bold">Amenities:</label>
            <div className="d-flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="form-check-input"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <label htmlFor="parking" className="form-check-label">Parking</label>
            </div>
            <div className="d-flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="form-check-input"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <label htmlFor="furnished" className="form-check-label">Furnished</label>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="font-weight-bold">Sort:</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="form-control"
              value={`${sidebardata.sort}_${sidebardata.order}`}
            >
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="btn btn-dark mt-3">Search</button>
        </form>
      </div>

      {/* Results Section */}
      <div className="flex-1">
        <h1 className="p-3 mt-5 text-3xl font-semibold border-bottom text-dark">
          Listing Results:
        </h1>
        <div className="p-4 d-flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-dark">No Listing Found!</p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>

        {showMore && (
          <button
            onClick={onShowMoreClick}
            className="btn btn-link text-success my-4"
          >
            Show more
          </button>
        )}

        {loading && <Spinner />}
      </div>
    </div>
  );
}
