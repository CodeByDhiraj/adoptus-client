// PostPetSection.js
import React, { useState, useEffect } from "react";
import postPet from "./images/postPet.png";
import { useAuthContext } from "../../hooks/UseAuthContext";
import { toast } from 'react-hot-toast';

const PostPetSection = () => {
  const { user } = useAuthContext();

  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [justification, setJustification] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("None");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user) {
      setOwnerName(user.userName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const togglePopup = () => setShowPopup(!showPopup);

  const blockIfNotLoggedIn = () => {
    if (!user) {
      toast.error("Please login/signup to use this service.");
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1100);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required to submit form.");

    if (!/^[1-9]\d{9}$/.test(phone)) {
      setFormError(true);
      toast.error("Phone number must be 10 digits and should not start with 0");
      return;
    }

    if (!name || !age || !area || !justification || !email || !phone || type === "None" || !picture || !ownerName) {
      setFormError(true);
      return;
    }

    setIsSubmitting(true);
    setFormError(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("area", area);
    formData.append("justification", justification);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type);
    formData.append("ownerName", ownerName);
    formData.append("picture", picture);

    try {
      const response = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Form submission failed");

      setName("");
      setOwnerName(user.userName || "");
      setAge("");
      setArea("");
      setJustification("");
      setPhone("");
      setPicture(null);
      setFileName("");
      togglePopup();
    } catch (error) {
      console.error("Error submitting pet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="post-pet-section">
      <h2>Post for Adoption</h2>
      <img src={postPet} alt="Post Pet" className="post-pet-image" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="input-box">
          <label>Pet Name:</label>
          <input type="text" value={name} onClick={blockIfNotLoggedIn} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-box">
          <label>Owner Name:</label>
          <input type="text" value={ownerName} onClick={blockIfNotLoggedIn} onChange={(e) => setOwnerName(e.target.value)} />
        </div>

        <div className="input-box">
          <label>Pet Age:</label>
          <input type="number" value={age} onClick={blockIfNotLoggedIn} onChange={(e) => setAge(e.target.value)} />
        </div>

        <div className="input-box">
          <label>Picture:</label>
          <label className="file-input-label">
            <span className="file-input-text">{fileName || "Choose Picture"}</span>
            <input className="file-input" type="file" accept="image/*" onClick={blockIfNotLoggedIn} onChange={handleFileChange} disabled={!user} />
          </label>
        </div>

        <div className="input-box">
          <label>Location:</label>
          <input type="text" value={area} onClick={blockIfNotLoggedIn} onChange={(e) => setArea(e.target.value)} />
        </div>

        <div className="filter-selection-service">
          <label>Type:</label>
          <select value={type} onClick={blockIfNotLoggedIn} onChange={(e) => setType(e.target.value)} disabled={!user}>
            <option value="None">None</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Fish">Fish</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-box">
          <h3>Description</h3>
          <textarea rows="4" value={justification} onClick={blockIfNotLoggedIn} onChange={(e) => setJustification(e.target.value)}></textarea>
        </div>

        <div className="input-box">
          <label>Email:</label>
          <input type="text" value={email} readOnly />
        </div>

        <div className="input-box">
          <label>Phone No:</label>
          <input type="tel" value={phone} onClick={blockIfNotLoggedIn} onChange={(e) => setPhone(e.target.value)} />
        </div>

        {formError && <p className="error-message">Please fill all fields correctly.</p>}

        <button type="submit" className="cta-button" disabled={isSubmitting || !user}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Pet posted successfully!</h4>
            </div>
            <button onClick={togglePopup} className="close-btn">
              Close
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default PostPetSection;
