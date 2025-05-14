import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/UseAuthContext";
import './AdoptForm.css';

const AdoptForm = ({ pet: incomingPet, closeForm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [pet, setPet] = useState(incomingPet || location.state?.pet || null);
  const [loading, setLoading] = useState(!incomingPet && !location.state?.pet);

  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [reasonForAdoption, setReasonForAdoption] = useState("");
  const [formError, setFormError] = useState("");
  const [SuccPopup, setSuccPopup] = useState(false);
  const [ErrPopup, setErrPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!pet) {
      const searchParams = new URLSearchParams(location.search);
      const petId = searchParams.get("petId");

      if (petId) {
        fetch(`http://localhost:5000/pet/${petId}`)
          .then((res) => res.json())
          .then((data) => setPet(data))
          .catch(() => setPet(null))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [location.search, pet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition ||
      !reasonForAdoption
    ) {
      return setFormError("Please fill all fields");
    }

    if (!/^[1-9]\d{9}$/.test(phoneNo)) {
      return setFormError("Phone number must be 10 digits and should not start with 0");
    }


    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:5000/api/form/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          email: user.email,
          phoneNo,
          livingSituation,
          previousExperience,
          familyComposition,
          reasonForAdoption,
          petId: pet._id,
        }),
      });

      if (!res.ok) return setErrPopup(true);

      setSuccPopup(true);
      setPhoneNo("");
      setLivingSituation("");
      setPreviousExperience("");
      setFamilyComposition("");
      setReasonForAdoption("");
    } catch {
      setErrPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading pet details...</p>;

  if (!pet) {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>❌ Pet Not Found!</h2>
          <button className="close-btn" onClick={() => navigate("/pets")}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-modern">
        <button className="popup-close" onClick={closeForm}>✖</button>

        <h2 className="popup-title">🐾 Apply for {pet.name}</h2>

        <div className="popup-content-wrapper">
          <div className="popup-pet-info">
            <img src={`http://localhost:5000/images/${pet.filename}`} alt={pet.name} />
            <div>
              <p><strong>Name:</strong> {pet.name}</p>
              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Location:</strong> {pet.area}</p>
              <p><strong>Owner Email:</strong> {pet.email}</p>
              <p><strong>Owner Phone:</strong> {pet.phone}</p>
              <p><strong>Justification:</strong> {pet.justification}</p>
            </div>
          </div>

          <form className="popup-form" onSubmit={handleSubmit}>
            <input type="email" value={user.email} disabled />

            <input
              type="text"
              placeholder="📞 Your 10-digit Phone Number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />

            <input
              type="text"
              placeholder="🐶 Do you currently own any pets?"
              value={livingSituation}
              onChange={(e) => setLivingSituation(e.target.value)}
            />

            <input
              type="text"
              placeholder="📚 Any past experience with pets or adoption?"
              value={previousExperience}
              onChange={(e) => setPreviousExperience(e.target.value)}
            />

            <input
              type="text"
              placeholder="👨‍👩‍👧‍👦 Describe your family & home environment"
              value={familyComposition}
              onChange={(e) => setFamilyComposition(e.target.value)}
            />

            <textarea
              placeholder="📝 Why do you want to adopt this pet?"
              value={reasonForAdoption}
              onChange={(e) => setReasonForAdoption(e.target.value)}
              rows={3}
              style={{ resize: "none" }}
            />

            {formError && <p className="error-message">{formError}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {SuccPopup && (
          <div className="popup-message">
            <h4>✅ Adoption Request Submitted!</h4>
            <button onClick={() => closeForm()}>Close</button>
          </div>
        )}

        {ErrPopup && (
          <div className="popup-message">
            <h4>❌ Error submitting form</h4>
            <button onClick={() => setErrPopup(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptForm;
