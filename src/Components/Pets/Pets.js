// 📁 Path: src/Components/Pets/Pets.js
import React, { useEffect, useState } from "react";
import PetsViewer from "./PetsViewer";
import { useAuthContext } from "../../hooks/UseAuthContext";
import './Pets.css';

const Pets = ({ openAdoptForm }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noMatch, setNoMatch] = useState(false);
  const { user } = useAuthContext();

  const petTypes = ["Dog", "Cat", "Rabbit", "Bird", "Fish", "Other"];

  useEffect(() => {
    const fetchRequests = async () => {

      // ❌ [ COMMENTED for Public Access ] --> Yaha se hata diya taki bina login bhi pets dikhe
      // if (!user || !user.token) {
      //   setLoading(false);
      //   return;
      // }

      try {
        const response = await fetch("http://localhost:5000/api/services/approvedPets", {
          // ✅ [ Optional ] → Agar user hoga toh token jayega, nahi toh bina token ke chalega
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
        });
        const data = await response.json();
        setPetsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const filteredPetTypes = petTypes.filter((type) =>
    type.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const filteredPets = petsData.filter((pet) => {
    const matchesType = filter === "all" || pet.type === filter;
    const matchesNameOrLocation =
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesNameOrLocation;
  });

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (filteredPets.length === 0 && searchTerm.trim() !== "") {
      setNoMatch(true);

      // ✅ Auto save search request
      try {
        const finalSearch = `${searchTerm} ${filter !== 'all' ? filter : ''}`.trim().toLowerCase();;
        await fetch("http://localhost:5000/api/notifications/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ search: finalSearch }),
        });
      } catch (error) {
        console.error("Failed to save notification request:", error);
      }
    } else {
      setNoMatch(false);
    }
  };

  return (
    <div className="pets-page">
      <form className="pets-page-controls" onSubmit={handleSearchSubmit}>
        {/* 🔎 Search Bar */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search Pets by City or Area.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          list="pet-types"
        />

      
        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Pets</option>
          {petTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}s
            </option>
          ))}
        </select>

        <button type="submit" className="search-btn">Search</button>
      </form>

      <div className="pet-container">
        {loading ? (
          <div className="loader">Loading pets...</div>
        ) : noMatch ? (
          <div className="no-pets-found">
            <img
              src="images/no-pets.png"
              alt="No Pets Found"
              style={{ width: "300px", marginBottom: "10px" }}
            />
            <p>😔 Sorry, no exact match found!</p>
            <h4 style={{ marginTop: "1rem" }}>Recommended Pets for You 👇</h4>

            {/* ✅ Recommended Other Pets */}
            {petsData.length > 0 ? (
              petsData.slice(0, 4).map((petDetail, index) => (
                <PetsViewer pet={petDetail} key={index} openAdoptForm={openAdoptForm}  />
              ))
            ) : (
              <p className="text-gray-400">No recommendations available yet.</p>
            )}
          </div>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((petDetail, index) => (
            <PetsViewer pet={petDetail} key={index} openAdoptForm={openAdoptForm} />
          ))
        ) : (
          <div className="no-pets-found">
            <img
              src="images/no-pets.png"
              alt="No Pets Found"
              style={{ width: "300px", marginBottom: "10px" }}
            />
            <p>😔 Sorry, no matching pets found. Try different keywords!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;
