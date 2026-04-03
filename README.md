# 🥗 NutriRoute – Personalized Nutrition & Diet Planning System

## 📌 Overview

NutriRoute is a full-stack web application designed to provide personalized diet plans and nutrition tracking. It helps users maintain a healthy lifestyle by offering customized meal plans, progress tracking, and admin-managed diet recommendations.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login (JWT Authentication)
* Personalized Diet Plans
* Daily Nutrition Tracking
* Profile Management
* View Recommended Meals

### 🛠️ Admin Features

* Admin Dashboard
* Create / Update / Delete Diet Plans
* Manage Users
* Monitor User Progress

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Axios
* Bootstrap / Tailwind CSS

### Backend

* Spring Boot
* Spring Security (JWT Authentication)
* Hibernate / JPA

### Database

* MySQL

---

## 📂 Project Structure

```
NutriRoute/
│
├── backend/                 # Spring Boot Application
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── model/
│
├── frontend/                # React Application
│   ├── components/
│   ├── pages/
│   └── services/
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/nutriroute.git
cd nutriroute
```

---

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd backend
```

* Configure `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nutriroute
spring.datasource.username=root
spring.datasource.password=yourpassword
```

* Run the backend:

```bash
mvn spring-boot:run
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Authentication

* JWT-based authentication system
* Secure login and API protection
* Role-based access (User / Admin)

---

## 📊 API Endpoints (Sample)

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | /api/auth/register | Register user         |
| POST   | /api/auth/login    | Login user            |
| GET    | /api/diets         | Get diet plans        |
| POST   | /api/admin/diets   | Add diet plan (Admin) |

---

## 🧪 Future Improvements

* AI-based diet recommendations
* Mobile app integration
* Real-time calorie tracking
* Payment integration for premium plans

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 👨‍💻 Author

**Vivek Sharma**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
