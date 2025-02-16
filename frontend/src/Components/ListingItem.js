import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className="card shadow-sm hover-shadow-lg overflow-hidden rounded w-100" style={{ width: '330px' }}>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="card-img-top img-fluid"
          style={{ height: '220px', objectFit: 'cover' }}
        />
        <div className="card-body p-3 d-flex flex-column gap-2">
          <h3 className="card-title text-dark truncate" style={{ fontSize: '1.125rem' }}>
            {listing.name}
          </h3>
          <div className="d-flex align-items-center gap-1">
            <MdLocationOn className="text-success" style={{ width: '16px', height: '16px' }} />
            <p className="text-muted text-truncate" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {listing.address}
            </p>
          </div>
          <p className="text-muted" style={{ WebkitLineClamp: '2', overflow: 'hidden' }}>
            {listing.description}
          </p>
          <p className="text-secondary mt-2 font-weight-bold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className="text-dark d-flex gap-4">
            <h4 className="font-weight-bold text-muted" style={{ fontSize: '0.75rem' }}>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </h4>
            <h4 className="font-weight-bold text-muted" style={{ fontSize: '0.75rem' }}>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </h4>
          </div>
        </div>
      </Link>
    </div>
  );
}