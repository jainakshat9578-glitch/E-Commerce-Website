# ✦ SNITCH — Modern E-Commerce Platform

### *Discover. Shop. Experience.*

A full-stack e-commerce web application built to deliver a smooth, modern online shopping experience — from discovering products and managing a cart to completing payments and revisiting past orders.

<p align="center">
  <strong>🛍️ Customer Shopping</strong> &nbsp; • &nbsp;
  <strong>🏪 Seller Dashboard</strong> &nbsp; • &nbsp;
  <strong>💳 Razorpay Payments</strong> &nbsp; • &nbsp;
  <strong>📦 Order Management</strong>
</p>

---

## ✨ About the Project

**Snitch** is a full-stack shopping platform designed with a clean, minimal interface and a complete customer-to-checkout flow.

The idea is simple: shopping should feel effortless, the interface should feel premium, and the backend should handle important operations such as authentication, cart management, payment verification, and order retrieval.

The platform separates customer shopping experiences from seller functionality, providing dedicated navigation and protected access to relevant features.

## 🚀 Features

### 🛍️ Shopping Experience
- Browse products and explore product details.
- Add products to the shopping cart.
- Manage cart items and quantities.
- View a live cart item count in the navigation bar.
- Enjoy a clean, fashion-inspired interface.

### 🔐 Authentication & Authorization
- User registration and login.
- Protected routes for authenticated users.
- Role-based access for customers and sellers.
- Separate seller dashboard access.

### 💳 Payment Integration
- Razorpay checkout integration.
- Backend order creation before payment.
- Payment signature verification on the server.
- Payment status tracking.
- Order confirmation after successful payment.

### 📦 Order Management
- Dedicated **My Orders** page.
- Retrieve orders associated with the authenticated user.
- View previous successful purchases.
- Access order details, purchased items, and payment information.

### 🏪 Seller Dashboard & Product Management

Snitch includes a dedicated seller experience that allows users with seller privileges to access product management functionality separately from the customer shopping experience.

- **Dedicated Seller Dashboard:** Access a separate dashboard for seller-related operations.
- **Create Products:** Add new products to the platform through the product creation interface.
- **Product Management:** Access seller-specific product details and manage product listings.
- **Role-Based Access:** Restrict seller dashboard and product management routes to authorized seller accounts.
- **Separate Navigation:** Provide seller-specific navigation so sellers can access their dashboard without mixing it with customer shopping links.

### 👥 Customer vs. Seller Experience

| Customer | Seller |
|---|---|
| Browse available products | Create product listings |
| Add products to cart | Access seller dashboard |
| Complete checkout and payment | Access seller-specific product details |
| View previous successful orders | Use protected seller functionality |



## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| React Router | Client-side navigation and routing |
| Redux | Application and cart state management |
| Tailwind CSS | Styling and responsive layouts |
| Axios | HTTP requests to the backend |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Database schemas and models |
| Razorpay | Online payment integration |

## 🔄 How It Works

```text
                 ┌──────────────────┐
                 │   User Login     │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │ Browse Products  │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │  Manage Cart     │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │ Create Payment   │
                 │ Order (Backend)  │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │ Razorpay Checkout│
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │ Verify Payment   │
                 │ on the Backend   │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │ Save Paid Order  │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │     My Orders    │
                 └──────────────────┘
```

## 🏗️ Architecture Overview

The application follows a frontend-backend architecture.

**Frontend**
- Renders product pages, cart, authentication screens, and order history.
- Uses Redux for shared application state.
- Communicates with backend APIs through Axios.

**Backend**
- Exposes REST APIs through Express.
- Uses authentication middleware to protect private operations.
- Stores users, products, and payment/order information in MongoDB.
- Creates payment orders and verifies Razorpay signatures server-side.

**Database**
- Uses Mongoose schemas to organize application data.
- Stores order item snapshots and payment details so past purchases can be retrieved.

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- MongoDB or a MongoDB connection URI
- Razorpay test credentials for payment testing

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace the placeholders with your actual repository URL and project folder name.

### 2. Install Dependencies

Navigate to the relevant frontend and backend directories and install their dependencies.

For example, if your project contains separate `frontend` and `backend` folders:

```bash
cd backend
npm install
```

Then:

```bash
cd ../frontend
npm install
```

> If your folder structure or package scripts differ, use the actual directory names in your project.

### 3. Configure Environment Variables

Create the required `.env` file or files locally. The following is an example of common backend configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Use the exact variable names expected by your application. Configure any additional frontend or backend environment variables your project requires.

**Security note:** Never commit real API keys, database credentials, JWT secrets, or payment secrets to GitHub.

### 4. Start the Application

Run the scripts defined in the `package.json` files for your frontend and backend.

For projects using a `dev` script, the command may look like:

```bash
npm run dev
```

Run it from the appropriate directory. Start the frontend and backend separately if the project uses separate development servers.

### 5. Test the Payment Flow

Use Razorpay's test environment and test credentials to validate the checkout flow before accepting real payments.

Confirm that the backend verifies payment details and that successful orders appear in **My Orders**.

## 🔒 Security Considerations

- Keep private environment variables outside version control.
- Protect customer-specific APIs with authentication.
- Enforce seller permissions on the backend, not just in the UI.
- Verify payment signatures on the server.
- Do not expose payment secrets or signatures unnecessarily in API responses.
- Validate incoming API data and handle failed payments appropriately.

## 🧠 Key Learning Outcomes

Building Snitch provides practical experience with:

- Full-stack application development.
- REST API design and frontend-backend integration.
- Authentication and role-based authorization.
- Redux state management.
- MongoDB data modeling with Mongoose.
- Third-party payment integration.
- Server-side payment verification.
- Persisting and retrieving user-specific order history.

## 🔮 Future Enhancements

Potential improvements for future versions include:

- 🔎 Product search, filters, sorting, and pagination.
- ❤️ Wishlist and saved products.
- ⭐ Product reviews and ratings.
- 🚚 Order fulfillment and shipment tracking.
- 📊 Advanced seller analytics and inventory management.
- 🧪 Automated tests for APIs and checkout flows.
- ⚡ Caching, performance optimization, and load testing.
- 🚀 CI/CD and production monitoring.

## 👨‍💻 Project

**Snitch — Full-Stack E-Commerce Platform**

Built with React, Node.js, Express, MongoDB, and Razorpay.

---

<p align="center">
  <strong>Built with curiosity, code, and a passion for building real-world products. ✦</strong>
</p>
