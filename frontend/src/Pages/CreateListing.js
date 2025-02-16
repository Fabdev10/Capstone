import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]); 
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to upload images to Cloudinary
  const storeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'testing'); 
      formData.append('cloud_name', 'dshrp3np3'); 

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dshrp3np3/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Upload failed');

        resolve(data.secure_url); 
      } catch (error) {
        reject(error);
      }
    });
  };


  const handleImageSubmit = async () => {

    const currentFiles = Array.isArray(files) ? files : Array.from(files); 
  
    if (currentFiles.length > 0 && currentFiles.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
  
      const promises = currentFiles.map((file) => storeImage(file));
  
      try {
        const urls = await Promise.all(promises);
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));
        setFiles([]); 
        setPreviews([]); 
        setUploading(false);
      } catch (error) {
        setImageUploadError('Image Upload Failed. Max size: 2MB per image.');
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload up to 6 images per listing.');
      setUploading(false);
    }
  };
  
  

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); 
  
    if (selectedFiles.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can upload up to 6 images only.');
      return;
    }
  
    setFiles(selectedFiles); 
    const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };
  

  const handleRemovePreview = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };


  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    } else if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image!');
      setLoading(true);
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be less than regular price!');

      setError(false);
      const res = await fetch('http://localhost:3001/api/listing/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
     <main className="container my-5">
    <h1 className="text-center mb-4 fw-bold">Create a Listing</h1>
    <form onSubmit={handleSubmit} className="row g-4 bg-light p-4 rounded shadow">
      {/* Left Section */}
      <div className="col-md-6">
        <input
          type="text"
          placeholder="Name"
          className="form-control"
          id="name"
          maxLength="62"
          minLength="10"
          required
          onChange={handleChange}
          value={formData.name}
        />
        <textarea
          placeholder="Description"
          className="form-control mt-3"
          id="description"
          required
          onChange={handleChange}
          value={formData.description}
        />
        <input
          type="text"
          placeholder="Address"
          className="form-control mt-3"
          id="address"
          required
          onChange={handleChange}
          value={formData.address}
        />

        {/* Checkboxes */}
        <div className="mt-3">
          {[
            { id: "sale", label: "Sell", checked: formData.type === "sale" },
            { id: "rent", label: "Rent", checked: formData.type === "rent" },
            { id: "parking", label: "Parking Spot", checked: formData.parking },
            { id: "furnished", label: "Furnished", checked: formData.furnished },
            { id: "offer", label: "Offer", checked: formData.offer },
          ].map(({ id, label, checked }) => (
            <div className="form-check form-check-inline" key={id}>
              <input
                type="checkbox"
                className="form-check-input"
                id={id}
                onChange={handleChange}
                checked={checked}
              />
              <label className="form-check-label" htmlFor={id}>
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Numeric Inputs */}
        <div className="row mt-3">
          <div className="col-md-4">
            <label className="form-label">Beds</label>
            <input
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              className="form-control"
              onChange={handleChange}
              value={formData.bedrooms}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Baths</label>
            <input
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              className="form-control"
              onChange={handleChange}
              value={formData.bathrooms}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Regular Price ($/month)</label>
            <input
              type="number"
              id="regularPrice"
              min="50"
              max="1000000"
              required
              className="form-control"
              onChange={handleChange}
              value={formData.regularPrice}
            />
          </div>
        </div>

        {formData.offer && (
          <div className="mt-3">
            <label className="form-label">Discounted Price ($/month)</label>
            <input
              type="number"
              id="discountPrice"
              min="0"
              max="1000000"
              required
              className="form-control"
              onChange={handleChange}
              value={formData.discountPrice}
            />
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="col-md-6">
        <p className="fw-semibold">
          Images:
          <span className="text-muted ms-2">The first image will be the cover (max: 6)</span>
        </p>

        {/* File Upload */}
        <div className="input-group">
          <input
            onChange={(e) => setFiles(e.target.files)}
            className="form-control"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          <button
            type="button"
            disabled={uploading}
            onClick={handleImageSubmit}
            className="btn btn-success"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {imageUploadError && <p className="text-danger mt-2">{imageUploadError}</p>}

        {/* Image Preview */}
        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, index) => (
            <div key={url} className="d-flex align-items-center justify-content-between border p-2 mt-2">
              <img src={url} alt="listing" className="img-thumbnail" style={{ width: "80px", height: "80px" }} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          ))}

        {/* Submit Button */}
        <button
          disabled={loading || uploading}
          className="btn btn-dark mt-4 w-100"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </form>
  </main>
  );
}
