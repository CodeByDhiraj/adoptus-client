import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Select from 'react-select';
import Rating from 'react-rating-stars-component';
import Slider from 'react-slick';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Shoplisting.css';

const ShopListing = () => {
  const [shops, setShops] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [areaFilter, setAreaFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });

  useEffect(() => {
    setShops([]);
    setPage(1);
    fetchMoreData(true);
  }, [areaFilter, categoryFilter]);

  const fetchMoreData = async (reset = false) => {
    try {
      const res = await axios.get(`/api/shops?page=${reset ? 1 : page}`, {
        params: {
          area: areaFilter?.value,
          category: categoryFilter?.value,
        },
      });

      const newShops = res.data.shops || [];
      if (reset) {
        setShops(newShops);
        if (newShops[0]?.location) setMapCenter(newShops[0].location); // Center to first result
      } else {
        setShops(prev => [...prev, ...newShops]);
      }

      setHasMore(newShops.length > 0);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching shops:', err);
    }
  };

  const areaOptions = [
    { value: 'faridabad', label: 'Faridabad' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'noida', label: 'Noida' },
  ];

  const categoryOptions = [
    { value: 'vet', label: 'Veterinary' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'supplies', label: 'Supplies' },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="shop-listing-container">
      <div className="filters">
        <Select
          options={areaOptions}
          placeholder="Filter by Area"
          onChange={setAreaFilter}
        />
        <Select
          options={categoryOptions}
          placeholder="Filter by Category"
          onChange={setCategoryFilter}
        />
      </div>

      {/* ✅ Google Maps Display */}
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '300px' }}
          center={mapCenter}
          zoom={11}
        >
          {shops.map(shop =>
            shop.location?.lat && shop.location?.lng && (
              <Marker
                key={shop._id}
                position={{
                  lat: shop.location.lat,
                  lng: shop.location.lng,
                }}
                title={shop.name}
              />
            )
          )}
        </GoogleMap>
      </LoadScript>

      {/* ✅ Shop Cards with Lazy Loading */}
      <InfiniteScroll
        dataLength={shops.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading more shops...</h4>}
      >
        {shops.map(shop => (
          <div className="shop-card" key={shop._id}>
            <div className="shop-images">
              {shop.images?.map((img, idx) => (
              <img
              key={idx}
              src={img}
              alt={`Shop ${idx}`}
              className="shop-img"
              />
              ))}
          </div>
            <div className="shop-details">
              <h3>{shop.name}</h3>
              <p>{shop.description}</p>
              <Rating
                value={shop.averageRating || 0}
                edit={false}
                size={24}
              />
              <div className="shop-actions">
                <a href={`tel:${shop.contactPhone}`}>📞 Call</a>
                <a href={`mailto:${shop.contactEmail}`}>📧 Email</a>
                <button className="bookmark-btn">🔖 Bookmark</button>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ShopListing;
