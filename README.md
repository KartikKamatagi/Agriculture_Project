# 🌾 Agriculture Marketplace

An agriculture marketplace web application that connects farmers and customers through an online platform. Farmers can manage agricultural products, while customers can browse available products and interact with the marketplace through a modern web interface.

The project is built using a **Django backend** and a **React + Vite frontend**.

## 🚀 Features


* 👨‍🌾 Farmer and customer-oriented marketplace
* 🛒 Browse agricultural products
* 📦 Product management
* 🖼️ Product image support
* 👤 User management and authentication
* 🔄 Frontend and backend integration
* 📱 Responsive and user-friendly interface
* 🗄️ Database-backed product and user information

## 🏗️ Project Structure

```text

Agriculture_Project/
│
├── agriculture-frontend/       # React + Vite frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── agriculture_project/        # Django backend
    ├── agriculture_project/
    ├── marketplace/
    ├── users/
    ├── media/
    │   └── products/
    ├── db.sqlite3
    ├── manage.py
    └── seed_data.py
```

## 💻 Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Python
* Django
* Django REST Framework

### Database

* SQLite

### Development Tools

* Git
* GitHub
* VS Code

## 🔄 Application Workflow

```text
User
  │
  ▼
React Frontend
  │
  │ API Requests
  ▼
Django Backend
  │
  ├── User Management
  ├── Marketplace
  └── Product Management
  │
  ▼
SQLite Database
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KartikKamatagi/Agriculture_Project.git
cd Agriculture_Project
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd agriculture_project
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

#### Windows

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install django djangorestframework
```

Run migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000/
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd agriculture-frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173/
```

## 📊 Main Modules

### 👤 User Module

Handles user-related functionality such as registration, login, and user information.

### 🌱 Marketplace Module

Provides the core agriculture marketplace functionality for displaying and managing agricultural products.

### 📦 Product Module

Handles product information including product details and product images.

### 🖥️ Frontend Module

Provides the user interface using React and communicates with the Django backend through APIs.

## 🎯 Project Objective

The main objective of this project is to create a digital marketplace for the agricultural sector where agricultural products can be managed and made available through an online platform.

It aims to provide a simple and convenient interface for users while demonstrating the integration of a modern React frontend with a Django backend.

## 🔮 Future Enhancements

* Online payment integration
* Order tracking
* Farmer verification
* Product reviews and ratings
* Search and advanced filtering
* Location-based product discovery
* Real-time notifications
* Admin dashboard
* Deployment using cloud services
* Improved authentication and authorization

## 👨‍💻 Author

**Kartik Kamatagi**

GitHub:
https://github.com/KartikKamatagi

## 📄 License

This project is developed for educational and project-development purposes.
