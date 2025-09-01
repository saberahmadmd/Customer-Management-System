# 🧑‍💼 Customer Management System

A modern full-stack web application to **manage customers and their addresses** with a clean, responsive interface.  
Built with **React, Node.js/Express, and SQLite**, it makes handling customer records smooth and efficient.

## ✨ Features

- **Customer Management** – Create, Read, Update, and Delete customer records.  
- **Address Management** – Assign multiple addresses to each customer.  
- **Search & Filter** – Find customers by name, phone, city, state, or PIN code.  
- **Sorting & Pagination** – Organize and navigate large datasets with ease.  
- **Responsive Design** – Works beautifully on desktop, tablet, and mobile.  
- **Form Validation** – Robust client + server-side checks.  
- **Real-time Feedback** – Instant validation and notifications.  

## 🏗️ Architecture

This project follows a **modern full-stack structure**:

### 🔹 Frontend (React)
- React 18 with Hooks  
- React Router for navigation  
- Axios for API communication  
- CSS Modules + responsive design  

### 🔹 Backend (Express)
- Node.js with Express.js  
- SQLite for data persistence  
- RESTful API design with proper HTTP codes  
- CORS enabled for cross-origin requests  

### 🔹 Database Schema
- **Customers Table** – Stores personal information  
- **Addresses Table** – Stores addresses linked by foreign key  


### 🚀 Usage
👥 Customers
View All – See paginated customer list.

Add – Create new customer records.

Edit / Delete – Manage records with confirmation prompts.

View Details – Dive into customer info + addresses.

### 📍 Addresses
Add, edit, and delete addresses per customer.

🔎 Search & Filter
Search by name/phone.

Filter by city, state, or PIN.

Sort ascending/descending.

Navigate with pagination.

### 🔌 API Endpoints
### Customers
GET /api/customers → Retrieve all (supports pagination + filtering)

POST /api/customers → Create new

GET /api/customers/:id → Get by ID

PUT /api/customers/:id → Update

DELETE /api/customers/:id → Remove

### Addresses
GET /api/customers/:id/addresses → List all for a customer

POST /api/customers/:id/addresses → Add new

PUT /api/addresses/:addressId → Update

DELETE /api/addresses/:addressId → Delete

### 📱 Responsive Design
Desktop – Full-featured layout with side-by-side views.

Tablet – Adaptive layouts with touch optimizations.

Mobile – Stacked layout with smooth navigation.
