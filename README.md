# 🎫 Uraan - Modern Ticket Booking Platform (Client)

A premium, feature-rich ticket booking web application built with React, featuring smooth animations, real-time booking, and secure payment processing. Uraan provides a seamless experience for booking bus, train, launch, and plane tickets.

## 🌐 Live Demo

**Live Site**: [https://urann.netlify.app/](https://urann.netlify.app/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features Breakdown](#key-features-breakdown)
- [Animation System](#animation-system)
- [Payment Integration](#payment-integration)
- [Authentication Flow](#authentication-flow)
- [Deployment](#deployment)
- [Browser Support](#browser-support)

## ✨ Features

### 🎨 Premium User Experience
- **Buttery-Smooth Scrolling**: Lenis-powered smooth scroll with GSAP integration
- **Modern Animations**: ScrollTrigger reveals, parallax effects, and micro-interactions
- **Headroom Navbar**: Auto-hide/show navigation with blur and fade effects
- **Dark Theme**: Slate & Clay color palette with glassmorphism
- **Responsive Design**: Mobile-first approach, works on all devices

### 🎫 Booking System
- **Multi-Transport Support**: Bus, Train, Launch, and Plane tickets
- **Real-time Availability**: Live seat availability checking
- **Date Selection**: Calendar-based travel date picker
- **Seat Selection**: Interactive seat selection interface
- **Booking History**: Track all bookings in user dashboard

### 💳 Payment Integration
- **Stripe Payments**: Secure payment processing
- **Multiple Payment Methods**: Card, Google Pay, Apple Pay support
- **Payment Confirmation**: Real-time payment status updates
- **PDF Tickets**: Automatic ticket generation and download
- **Transaction History**: Complete payment records

### 🔐 Authentication & Security
- **Firebase Authentication**: Email/Password and Google Sign-In
- **JWT Tokens**: Secure API communication
- **Role-Based Access**: User, Vendor, and Admin roles
- **Protected Routes**: Route guards for authenticated pages
- **Persistent Sessions**: Auto-login with token refresh

### 📊 Dashboard Features
- **User Dashboard**: View bookings, transactions, and profile
- **Vendor Dashboard**: Manage tickets, view sales analytics
- **Admin Dashboard**: User management, booking oversight
- **Analytics Charts**: Recharts-powered data visualization
- **Profile Management**: Update user information and settings

### 🎯 Advanced Features
- **Search & Filter**: Find tickets by route, date, and transport type
- **Advertised Tickets**: Featured deals on homepage
- **Real-time Updates**: TanStack Query for data synchronization
- **Toast Notifications**: User-friendly feedback system
- **Error Handling**: Comprehensive error pages and messages

## 🛠️ Tech Stack

### Core
- **React 18** - UI library with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **React Router v7** - Client-side routing and navigation

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Framer Motion** - Animation library for React
- **Lucide Icons** - Modern icon library

### Animation & Scroll
- **GSAP 3.14** - Professional-grade animation library
- **Lenis** - Smooth scrolling by Studio Freight
- **ScrollTrigger** - Scroll-based animations

### State & Data
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form validation and management

### Authentication & Payments
- **Firebase** - Authentication and user management
- **Stripe** - Payment processing
- **JWT** - Token-based authentication

### Utilities
- **React Hot Toast** - Toast notifications
- **SweetAlert2** - Beautiful alert modals
- **React PDF Renderer** - PDF generation for tickets
- **Swiper** - Touch slider component
- **Recharts** - Chart library for analytics

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Firebase Project** with authentication enabled
- **Stripe Account** for payment processing
- **Backend API** running (see server README)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignmet11client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual credentials (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
```

### How to Get Credentials:

**Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/Select project → Project Settings → General
3. Scroll to "Your apps" → Web app → Config
4. Copy all the configuration values

**Stripe:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Developers → API Keys
3. Copy the "Publishable key"

**Backend API:**
- Ensure your backend server is running (default: http://localhost:5000)
- Update `VITE_API_URL` if using a different port or deployed URL

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist` folder

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally

### Linting
```bash
npm run lint
```
Run ESLint to check code quality

## 📁 Project Structure

```
assignmet11client/
├── public/
│   └── _redirects              # Netlify redirects for SPA
├── src/
│   ├── assets/                 # Images, logos, static files
│   ├── components/             # Reusable components
│   │   ├── Banner.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── TicketCard.jsx
│   │   ├── StripePaymentForm.jsx
│   │   ├── TicketPDF.jsx
│   │   ├── SmoothScroll.jsx    # Lenis smooth scroll wrapper
│   │   ├── ParallaxBackground.jsx
│   │   └── ...
│   ├── config/
│   │   └── api.js              # Axios configuration
│   ├── firebase/
│   │   └── firebaseConfig.js   # Firebase initialization
│   ├── hooks/
│   │   └── useAuth.js          # Authentication hook
│   ├── layouts/
│   │   ├── MainLayout.jsx      # Main app layout
│   │   └── DashboardLayout.jsx # Dashboard layout
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Auth/               # Login, Register, ForgotPassword
│   │   ├── Dashboard/          # User, Vendor, Admin dashboards
│   │   └── Tickets/            # Ticket listing and details
│   ├── providers/
│   │   └── AuthProvider.jsx    # Auth context provider
│   ├── routes/
│   │   └── router.jsx          # React Router configuration
│   ├── styles/
│   │   └── index.css           # Global styles
│   ├── main.jsx                # App entry point
│   └── index.css               # Tailwind imports
├── .env.example                # Environment variables template
├── .gitignore
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
├── THEME_IMPLEMENTATION_GUIDE.md
└── README.md
```

## 🎯 Key Features Breakdown

### 1. Smooth Scrolling System
The app uses Lenis for buttery-smooth scrolling integrated with GSAP:

```jsx
// Automatically applied via MainLayout
<SmoothScroll>
  <App />
</SmoothScroll>
```

**Configuration:**
- Duration: 0.6s
- Wheel Multiplier: 1.4x
- Custom easing function
- Mobile-optimized

### 2. Scroll Animations
TicketCards and other elements use GSAP ScrollTrigger:

```jsx
// Automatic reveal on scroll
<TicketCard ticket={ticket} index={0} />
```

**Animation Specs:**
- Initial: `opacity: 0, y: 50`
- Target: `opacity: 1, y: 0`
- Duration: 0.8s
- Stagger: 0.1s per card

### 3. Headroom Navbar
Navbar automatically hides when scrolling down and appears when scrolling up:

**Features:**
- Blur effect on hide
- Opacity transitions
- 200px scroll threshold
- GPU-accelerated animations

### 4. Payment Flow
Complete Stripe integration with PDF generation:

1. User selects tickets and date
2. Proceeds to payment
3. Stripe payment form with high-visibility inputs
4. Payment processing with loading states
5. Success confirmation
6. Automatic PDF ticket generation
7. Download button for PDF ticket

## 🎨 Animation System

### GSAP Implementation
```javascript
// Parallax Background
- 3 layers with different speeds
- Blur overlays for depth
- Scrub-based scroll animations

// Card Reveals
- ScrollTrigger on viewport entry
- Staggered animations
- Once property for performance

// Navbar
- Hide/show based on scroll direction
- Blur and opacity transitions
- Request Animation Frame optimization
```

### Framer Motion
Used for micro-interactions:
- Hover effects on cards
- Button press animations
- Modal transitions
- Loading spinners

## 💳 Payment Integration

### Stripe Payment Form
High-visibility card input with modern styling:

**Features:**
- Pure white text (`#ffffff`)
- Bold font weight (700)
- Increased letter spacing
- Dark container background
- Clear focus states
- Card brand icons
- Error handling
- Success confirmation

### PDF Ticket Generation
Automatic ticket generation after successful payment:

**Includes:**
- Booking ID and QR code
- Route information
- Seat numbers
- Price details
- Passenger information
- Travel date and time

## 🔐 Authentication Flow

### Sign Up
1. User enters details (name, email, password)
2. Firebase creates authentication account
3. Profile updated with display name and photo
4. Backend user record created with role
5. JWT token generated and stored
6. **Redirect to Home page** (not dashboard)

### Sign In
1. Firebase authentication
2. Backend token generation
3. Role-based redirect:
   - Admin → Admin Dashboard
   - Vendor → Vendor Dashboard  
   - User → User Dashboard

### Google Sign-In
One-click authentication with automatic backend synchronization.

## 🚀 Deployment

### Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod
   ```

3. **Configure Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all variables from `.env` file

4. **Set up redirects**
   The `public/_redirects` file is already configured for SPA routing:
   ```
   /*    /index.html   200
   ```

### Other Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Firebase Hosting:**
```bash
npm run build
firebase deploy
```

**GitHub Pages:**
Use `gh-pages` package with proper base URL configuration.

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

```css
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

## 🔧 Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure backend server is running
- Check `VITE_API_URL` in `.env`
- Verify backend CORS configuration

**2. Firebase Authentication**
- Verify Firebase credentials in `.env`
- Enable Email/Password and Google in Firebase Console
- Check authorized domains

**3. Stripe Payment**
- Use test mode keys during development
- Test cards: `4242 4242 4242 4242`
- Ensure backend Stripe secret key is set

**4. Animations Not Working**
- Check GSAP and Lenis installation
- Verify ScrollTrigger registration
- Check browser console for errors

**5. Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Update dependencies: `npm update`

## 🎨 Theme Customization

The app uses a custom Slate & Clay theme. See [THEME_IMPLEMENTATION_GUIDE.md](./THEME_IMPLEMENTATION_GUIDE.md) for details.

**Primary Colors:**
- Clay: `#b35a44`
- Slate: `#0f172a` to `#f8fafc`
- Accent: Cyan and teal shades

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🐛 Known Issues

- [ ] PDF download may be slow on low-end devices
- [ ] Smooth scroll disabled on mobile for better performance
- [ ] Some animations may lag on older browsers

## 🔮 Future Enhancements

- [ ] Progressive Web App (PWA) support
- [ ] Push notifications for booking updates
- [ ] Multi-language support
- [ ] Advanced ticket filtering
- [ ] Social sharing features
- [ ] Seat map visualization
- [ ] Real-time chat support

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: support@uraan.com
- Documentation: [See Wiki](link-to-wiki)

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **GSAP** - Amazing animation library
- **Lenis** - Smooth scroll by Studio Freight
- **Stripe** - Payment processing
- **Firebase** - Authentication services
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ using React + Vite**

**Version**: 1.0.0  
**Last Updated**: December 20, 2025
