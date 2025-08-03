<!-- Cover Banner -->
<p align="center">
  <img src="images/banner.png" alt="AdoptUs Banner" width="100%" />
</p>

<h1 align="center">🐾 AdoptUs - Pet Adoption & Pet Service Platform</h1>

<p align="center">
  A modern MERN-based platform to adopt pets, explore vet/grooming services, and manage users/admins with OTP authentication and Google Maps.  
  <br />
  <a href="https://adoptus.fallmodz.in" target="_blank"><strong>🌐 View Live Demo →</strong></a>
</p>

---

<p align="center">
  <!-- Badges -->
  <img alt="MIT License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img alt="Status" src="https://img.shields.io/badge/Status-Production%20Ready-blueviolet?style=flat-square" />
  <img alt="Tech" src="https://img.shields.io/badge/Stack-MERN-orange?style=flat-square" />
  <img alt="Hosted" src="https://img.shields.io/badge/Hosted%20On-Render%20%7C%20Hostinger-purple?style=flat-square" />
</p>

---

## 📽️ Demo Preview

> You can replace below with your actual recording later

| Home Page | Pet Listing | Admin Panel |
|-----------|-------------|-------------|
| ![](images/home.gif) | ![](images/pets.gif) | ![](images/admin.gif) |

🎬 Record your screen with [Screenity](https://chrome.google.com/webstore/detail/screenity-screen-recorder/)

---

## 📋 Table of Contents

- [🐶 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🧰 Tech Stack](#-tech-stack)
- [🔧 Installation](#-installation)
- [🚀 Deployment](#-deployment)
- [👨‍💻 Developer](#-developer)
- [📄 License](#-license)

---

## 🐶 About the Project

AdoptUs is a feature-rich pet adoption web application where:
- 🐾 Users can adopt pets and explore services like vet, grooming, etc.
- 👨‍💻 Admins can approve pets, manage adoption forms, reviews, shops, and facts.
- 💌 Email OTPs are used for secure logins and password recovery.
- 🗺️ Google Maps is used for locating pet shops/services.

---

## ✨ Features

### 👥 User Side

- 🔐 Signup/Login with OTP (Email Verification)
- 👤 Full Profile System (with photo, phone, address)
- 🐾 Pet Listings with search + filters
- 📝 Submit Adoption Form (email triggered)
- 🛒 Services Section (Vet, Grooming, Supplies)
- 📍 Filter by Area & Category (Map powered)
- ⭐ Dynamic Testimonials & Reviews
- 📢 Daily Facts Carousel (Admin Controlled)
- 📈 Animated Stats (Pets, Users, Adoptions)
- 🎨 Dark/Light Mode Switch
- 🛰️ Scroll-to-top Rocket
- 📱 Fully Responsive

### 🛠️ Admin Side

- 🧾 Approve/Reject Adoption Forms
- 🐶 Pet Approvals
- 🏪 Shop Listings (Add/Edit/Delete)
- 💬 Reviews Moderation
- 🧠 Manage Facts (Add/Delete/Edit)
- 📩 Match-based Email Notification on Approval
- 🔐 Role-based protected routes

---

## 📸 Screenshots

| Homepage | Adoption | Services |
|----------|----------|----------|
| ![](images/1.png) | ![](images/2.png) | ![](images/3.png) |
| ![](images/4.png) | ![](images/5.png) | ![](images/6.png) |

---

## 🧰 Tech Stack

| Layer        | Tools Used |
|--------------|------------|
| Frontend     | React.js, Tailwind CSS, Framer Motion, Swiper |
| State & API  | Axios, React Router, Toastify |
| Backend      | Node.js, Express.js, MongoDB |
| Auth         | JWT, Bcrypt, OTP via Nodemailer |
| File Upload  | Multer + Cloudinary |
| Location     | Google Maps JavaScript API |
| Hosting      | Hostinger (frontend), Render (backend) |

---

## 🔧 Installation

### Clone Repository

```bash
git clone https://github.com/fallmodz/adoptus.git
cd adoptus

Frontend Setup
cd client
npm install
npm run dev

Backend Setup
cd server
npm install
node index.js

Environment File
MONGO_URI=your_mongodb_uri
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SECRET=jwt_secret
```
## 🚀 Deployment
| Part     | Platform           |
| -------- | ------------------ |
| Frontend | Hostinger          |
| Backend  | Render             |
| DB       | MongoDB Atlas      |
| Images   | Multer             |

## 👨‍💻 Developer
Made with ❤️ by Dhiraj Kumar (@CodeByDhiraj)

## 📄 License
This project is licensed under the MIT License.

## 💬 Feedback
If you found this project helpful:
⭐ Star this repo
🐕 Share it with friends
🤝 Contribute if you want

