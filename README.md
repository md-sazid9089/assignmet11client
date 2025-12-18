# 🎫 TicketBari - Online Ticket Booking Platform

A full-stack MERN application for booking travel tickets (Bus, Train, Launch, Plane) with role-based access control for Users, Vendors, and Admins.

## 🌐 Live Links

- **Live Site**: https://ticketbari1.netlify.app/


---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Email/Password and Google Sign-in with Firebase
- JWT token-based API protection
- Role-based access control (User, Vendor, Admin)
- Protected routes with persistent authentication
- Password validation (uppercase, lowercase, 6+ characters)

### 👤 User Features
- **Browse & Search**: Search tickets by location with filters
- **Advanced Filtering**: Filter by transport type (Bus/Train/Launch/Plane)
- **Smart Sorting**: Sort tickets by price (Low to High / High to Low)
- **Pagination**: View 9 tickets per page for better performance
- **Ticket Details**: View full details with real-time countdown timer
- **Easy Booking**: Book tickets with quantity selection
- **Secure Payment**: Complete payment through Stripe integration
- **PDF Download**: Download ticket PDF after successful payment
- **Booking History**: Track all bookings with status updates
- **Transaction History**: View complete payment history
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

### 🏪 Vendor Features
- **Add Tickets**: Create new ticket listings with ImgBB image upload
- **Manage Tickets**: Update or delete tickets (restrictions apply)
- **Booking Requests**: View and respond to customer bookings
- **Accept/Reject**: Approve or decline booking requests
- **Revenue Analytics**: Track earnings with interactive Recharts visualizations
- **Sales Dashboard**: Monitor tickets sold and total listings
- **Verification Status**: Real-time ticket approval status from admin

### 👨‍💼 Admin Features
- **Ticket Management**: Approve or reject vendor-submitted tickets
- **User Management**: Promote users to Admin or Vendor roles
- **Fraud Detection**: Mark vendors as fraud (hides all their tickets)
- **Advertisement Control**: Feature up to 6 tickets on homepage
- **Platform Overview**: Complete control over all platform content
- **User Analytics**: View all users and their activities

---

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI library
- **React Router DOM** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Performant form validation
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library
- **Firebase** - Authentication service
- **Stripe** - Payment processing
- **Swiper.js** - Touch slider for hero section
- **Recharts** - Data visualization library
- **React Countdown** - Real-time countdown timers
- **React Hot Toast** - Elegant notifications
- **SweetAlert2** - Beautiful popup alerts
- **jsPDF** - PDF generation for tickets
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Helmet Async** - SEO management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - Secure token authentication
- **CORS** - Cross-origin resource sharing

---

## 📦 NPM Packages

### Frontend Dependencies
```json
{
  "@stripe/react-stripe-js": "^2.4.0",
  "@stripe/stripe-js": "^2.2.0",
  "@tanstack/react-query": "^5.17.9",
  "axios": "^1.6.2",
  "firebase": "^10.7.1",
  "jspdf": "^2.5.1",
  "react": "^18.2.0",
  "react-countdown": "^2.3.5",
  "react-dom": "^18.2.0",
  "react-helmet-async": "^2.0.4",
  "react-hook-form": "^7.49.2",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^4.12.0",
  "react-router-dom": "^6.20.1",
  "recharts": "^2.10.3",
  "sweetalert2": "^11.10.2",
  "swiper": "^11.0.5"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.3.0"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project
- ImgBB API key
- Stripe account

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/omarabir/TicketBari-server
cd ticketbari-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. **Run the server**
```bash
npm start
# or for development
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Clone the repository**
```bash
git clone https://github.com/omarabir/TicketBari-client
cd ticketbari-client
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env.local` file**
```env
VITE_API_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_IMGBB_API_KEY=your_imgbb_api_key

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

4. **Run the development server**
```bash
npm run dev
```

Application will run on `http://localhost:5173`

---

## 🎯 Challenge Requirements Completed

✅ **Search Functionality** - Search tickets by From/To location  
✅ **Filter by Transport Type** - Filter by Bus, Train, Launch, Plane  
✅ **Sort by Price** - Low to High and High to Low sorting  
✅ **JWT Token Protection** - All API routes are secured  
✅ **Pagination** - 9 tickets per page with navigation  
✅ **Dark/Light Mode** - Complete theme toggle functionality  

---

## 🌟 Optional Features Implemented

✅ **PDF Ticket Download** - Generate and download tickets after payment  
✅ **React Hook Form** - Used in all forms for better validation  
✅ **Swiper.js** - Beautiful hero slider on homepage  
✅ **TanStack Query** - Efficient data fetching and caching  
✅ **Recharts Integration** - Interactive revenue charts for vendors  

---

## 📱 Responsive Design

- ✅ Mobile (375px - 767px)
- ✅ Tablet (768px - 1023px)
- ✅ Desktop (1024px and above)

---

## 🔒 Security Features

- Environment variables for sensitive data
- JWT token authentication
- Firebase security rules
- Role-based access control
- Protected API routes
- Input validation and sanitization
- XSS protection

---

## 🎨 UI/UX Highlights

- **Modern Design**: Clean and professional interface
- **Consistent Theme**: Unified color scheme (Primary: #3B82F6, Secondary: #8B5CF6)
- **Smooth Animations**: Fade-in effects and transitions
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback for actions
- **Responsive Images**: Optimized for all screen sizes
- **Dark Mode**: Eye-friendly theme for night usage

---

## 📊 Database Collections

### Users Collection
```javascript
{
  name: String,
  email: String,
  photoURL: String,
  role: String, // 'user' | 'vendor' | 'admin'
  isFraud: Boolean, // for vendors
  createdAt: Date
}
```

### Tickets Collection
```javascript
{
  ticketTitle: String,
  fromLocation: String,
  toLocation: String,
  transportType: String, // 'Bus' | 'Train' | 'Launch' | 'Plane'
  price: Number,
  ticketQuantity: Number,
  departureDateTime: Date,
  perks: [String],
  image: String,
  vendorName: String,
  vendorEmail: String,
  verificationStatus: String, // 'pending' | 'approved' | 'rejected'
  isAdvertised: Boolean,
  isHidden: Boolean,
  createdAt: Date
}
```

### Bookings Collection
```javascript
{
  ticketId: ObjectId,
  ticketTitle: String,
  bookingQuantity: Number,
  totalPrice: Number,
  userId: String,
  userName: String,
  status: String, // 'pending' | 'accepted' | 'rejected' | 'paid'
  createdAt: Date
}
```

### Transactions Collection
```javascript
{
  userId: String,
  bookingId: ObjectId,
  ticketId: ObjectId,
  transactionId: String,
  amount: Number,
  ticketTitle: String,
  paymentDate: Date
}
```

## 🧪 Testing Credentials

### Test Stripe Card
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

---

## 🚀 Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Connect GitHub repository
3. Add environment variables
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add `_redirects` file for SPA:
```
/* /index.html 200
```

## 📝 API Endpoints

### Authentication
- `POST /jwt` - Generate JWT token
- `POST /users` - Create new user
- `GET /users/:email` - Get user by email

### Tickets
- `GET /tickets` - Get all approved tickets (with search, filter, sort, pagination)
- `GET /tickets/:id` - Get single ticket
- `GET /tickets/advertised/all` - Get advertised tickets
- `GET /tickets/latest/all` - Get latest tickets

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/user` - Get user bookings
- `POST /payments` - Process payment
- `GET /transactions` - Get user transactions

### Vendor Routes
- `POST /vendor/tickets` - Add ticket
- `GET /vendor/tickets` - Get vendor tickets
- `PUT /vendor/tickets/:id` - Update ticket
- `DELETE /vendor/tickets/:id` - Delete ticket
- `GET /vendor/bookings` - Get booking requests
- `PATCH /vendor/bookings/:id` - Accept/Reject booking
- `GET /vendor/revenue` - Get revenue stats

### Admin Routes
- `GET /admin/users` - Get all users
- `PATCH /admin/users/:id/role` - Update user role
- `PATCH /admin/vendors/:id/fraud` - Mark vendor as fraud
- `GET /admin/tickets` - Get all tickets
- `PATCH /admin/tickets/:id/verify` - Approve/Reject ticket
- `PATCH /admin/tickets/:id/advertise` - Toggle advertisement

---
