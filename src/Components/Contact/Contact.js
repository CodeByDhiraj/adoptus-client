import React, { useState } from 'react';
import './Contact.css';
import { useAuthContext } from '../../hooks/UseAuthContext';
import { useEffect } from 'react';


const Contact = () => {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("👤 User data from context:", user);
    if (user) {
      setName(user.userName || user.name || ''); 
      setEmail(user.email || '');
    }
  }, [user]);
  
  

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const tempEmailDomains = [
    'tempmail.com', '10minutemail.com', 'mailinator.com',
    'dispostable.com', 'yopmail.com', 'guerrillamail.com',
    'getnada.com', 'trashmail.com', '@agiuse.com', '@asaption.com'
  ];

  const isTemporaryEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return tempEmailDomains.includes(domain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setEmailError('');

    if (!name || !email || !message) {
      setError('Please fill all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('❌ Invalid email format.');
      return;
    }

    if (isTemporaryEmail(email)) {
      setEmailError('❌ Temporary or fake emails are not allowed.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = user?.token;

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) // ✅ Add token
        },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');

      setSuccess(data.message || 'Message sent successfully!');
      setName(user?.userName || '');
      setEmail(user?.email || '');
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <h2 className="contact-heading">Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
         <label className="contact-label">Username</label>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="contact-input"
        />
         <label className="contact-label">Email</label>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          className="contact-input"
        />
        {emailError && <p className="email-error">{emailError}</p>}

        <textarea
          placeholder="Your Message & Suggestions "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="contact-textarea"
        ></textarea>

        <button type="submit" className="contact-button" disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner"></span> : 'Send Message'}
        </button>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Contact;
