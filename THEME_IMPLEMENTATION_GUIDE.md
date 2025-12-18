# Slate & Clay Design System - Implementation Guide

## 🎨 Color Philosophy

Your MERN project now uses a comprehensive **Slate & Clay** design system with context-specific implementations:

### Core Colors

| Color | Hex Code | Usage | Context |
|-------|----------|-------|---------|
| **Deep Slate** | `#0f172a` | Dark backgrounds, admin sidebar | Admin Panel |
| **Muted Slate** | `#334155` | Body text, borders | All contexts |
| **Slate Tint** | `#f8fafc` | Light backgrounds | Homepage, Vendor |
| **Primary Clay** | `#b35a44` | Primary actions, CTAs | All contexts |
| **Light Clay** | `#d97757` | Hover states, accents | All contexts |

---

## 📁 File Structure

```
assignmet11client/
├── src/
│   ├── styles/
│   │   ├── theme.css          ← Global CSS variables (NEW)
│   │   └── variables.css       ← Additional utilities
│   ├── components/
│   │   ├── Button.jsx          ← Shared button with Clay primary
│   │   └── Navbar.jsx          ← Light Slate + Clay accents
│   ├── layouts/
│   │   └── DashboardLayout.jsx ← Deep Slate admin sidebar
│   └── main.jsx                ← Imports theme.css
├── tailwind.config.js          ← Extended Slate & Clay colors
```

---

## 🎯 Theme Mapping Strategy

### 1. **Homepage** (Welcoming & Friendly)
- **Background**: Light Slate (`#f8fafc`) for airy, open feel
- **Surface**: White cards with subtle slate borders
- **Text**: Muted Slate (`#334155`) for readability
- **Accents**: Primary Clay (`#b35a44`) for CTAs and highlights

```jsx
// Homepage component example
<div className="bg-slate-50 dark:bg-slate-900">
  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
    <h1 className="text-[#0f172a] dark:text-slate-50">Welcome</h1>
    <Button variant="clay">Book Now</Button>
  </div>
</div>
```

### 2. **Vendor Dashboard** (Professional & Clean)
- **Background**: White/Slate 50 for clean workspace
- **Sidebar**: Light Slate (`#f8fafc`) background
- **Text**: Muted Slate (`#334155`)
- **Accents**: Primary Clay (`#b35a44`) buttons, slight hover effects

```jsx
// Vendor dashboard example
<div className="bg-white dark:bg-slate-800">
  <aside className="bg-slate-50 dark:bg-slate-800 border-r border-slate-200">
    <Button variant="clay">Add Ticket</Button>
  </aside>
</div>
```

### 3. **Admin Panel** (Authoritative & Focused)
- **Background**: Deep Slate (`#0f172a`) for sidebar - high contrast
- **Surface**: Slightly lighter slate (`#1e293b`)
- **Text**: Light text on dark backgrounds
- **Accents**: Light Clay (`#d97757`) for active states, Primary Clay for actions

```jsx
// Admin panel example
<aside className="bg-[#0f172a] border-r border-[#334155]">
  <div className="bg-[#1e293b]">
    <h2 className="text-white">Admin Dashboard</h2>
  </div>
  <nav>
    {/* Active link */}
    <NavLink className="bg-[#b35a44] text-white">Users</NavLink>
    {/* Inactive link */}
    <NavLink className="text-slate-300 hover:bg-[#1e293b] hover:text-[#d97757]">
      Tickets
    </NavLink>
  </nav>
</aside>
```

---

## 🧩 Shared Button Component

The `Button.jsx` component is your **single source of truth** for all button styling. It automatically uses Primary Clay (`#b35a44`) for primary actions.

### Button Variants

```jsx
import Button from './components/Button';
import { FaTicketAlt, FaPlus } from 'react-icons/fa';

// Primary action (Clay #b35a44)
<Button variant="clay" size="lg">
  Book Ticket
</Button>

// Secondary action (Muted Slate #334155)
<Button variant="slate" size="md">
  Cancel
</Button>

// Outlined primary
<Button variant="outline-clay" icon={<FaTicketAlt />}>
  View Details
</Button>

// Admin panel button (Deep Slate #0f172a)
<Button variant="admin" size="md" icon={<FaPlus />}>
  Add User
</Button>

// Minimal ghost button
<Button variant="ghost">
  Skip
</Button>

// With loading state
<Button variant="clay" loading={true}>
  Processing...
</Button>

// Full width
<Button variant="clay" fullWidth={true}>
  Submit
</Button>
```

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'clay' \| 'slate' \| 'outline-clay' \| 'outline-slate' \| 'ghost' \| 'admin'` | `'clay'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Stretch to container width |
| `icon` | `ReactNode` | `null` | Icon element (e.g., `<FaIcon />`) |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon placement |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable interaction |

---

## 🎨 Using CSS Variables

The `theme.css` file provides CSS custom properties for non-Tailwind usage:

```css
/* Homepage styles */
.homepage-hero {
  background: var(--homepage-bg); /* #f8fafc */
  color: var(--homepage-text);     /* #0f172a */
}

.homepage-cta {
  background: var(--homepage-accent); /* #b35a44 */
  color: var(--text-on-clay);         /* white */
}

/* Vendor dashboard */
.vendor-card {
  background: var(--vendor-surface);
  border: 1px solid var(--vendor-border);
}

/* Admin panel */
.admin-sidebar {
  background: var(--admin-bg);        /* #0f172a */
  color: var(--admin-text);           /* light slate */
}

.admin-surface {
  background: var(--admin-surface);   /* #1e293b */
  border: 1px solid var(--admin-border); /* #334155 */
}
```

### Pre-built Utility Classes

```html
<!-- Button styles -->
<button class="btn-clay-primary">Primary Action</button>
<button class="btn-slate">Secondary Action</button>

<!-- Card styles -->
<div class="card-homepage">Homepage Card</div>
<div class="card-vendor">Vendor Dashboard Card</div>
<div class="card-admin">Admin Panel Card</div>

<!-- Layout backgrounds -->
<div class="homepage-layout">...</div>
<div class="vendor-layout">...</div>
<div class="admin-layout">...</div>

<!-- Text utilities -->
<span class="text-clay-accent">Clay accent text</span>
<span class="text-slate-muted">Muted text</span>

<!-- Background utilities -->
<div class="bg-clay-gradient">Clay gradient background</div>
<div class="bg-slate-gradient">Slate gradient background</div>
```

---

## 🔧 Tailwind Color Classes

Use these Tailwind classes throughout your components:

### Backgrounds
```jsx
// Light backgrounds (Homepage, Vendor)
className="bg-slate-50 dark:bg-slate-900"
className="bg-white dark:bg-slate-800"

// Admin backgrounds
className="bg-[#0f172a]"        // Deep Slate sidebar
className="bg-[#1e293b]"        // Slightly lighter surfaces
```

### Text Colors
```jsx
// Homepage/Vendor text
className="text-[#0f172a] dark:text-slate-50"  // Primary text
className="text-[#334155] dark:text-slate-300" // Secondary text

// Admin text
className="text-white"
className="text-slate-300"     // Muted admin text
```

### Borders
```jsx
// Light contexts
className="border-slate-200 dark:border-slate-700"

// Admin context
className="border-[#334155]"
```

### Interactive States
```jsx
// Clay hover (Primary actions)
className="hover:bg-[#b35a44] hover:text-white"
className="hover:text-[#b35a44]"

// Slate hover (Secondary actions)
className="hover:bg-[#1e293b] hover:text-[#d97757]"  // Admin
className="hover:bg-slate-100 dark:hover:bg-slate-700" // Light contexts
```

---

## 📋 Quick Reference: Color Usage

| Element | Homepage | Vendor Dashboard | Admin Panel |
|---------|----------|------------------|-------------|
| **Page Background** | `#f8fafc` (Slate Tint) | `white` / `#f8fafc` | `#f8fafc` (content area) |
| **Sidebar Background** | N/A | `#f8fafc` | `#0f172a` (Deep Slate) |
| **Card Background** | `white` | `white` | `#1e293b` |
| **Primary Text** | `#0f172a` | `#0f172a` | `white` / `#e2e8f0` |
| **Secondary Text** | `#334155` | `#334155` | `#cbd5e1` |
| **Primary Button** | `#b35a44` | `#b35a44` | `#b35a44` |
| **Active Nav Item** | `#b35a44` | `#b35a44` | `#b35a44` |
| **Hover State** | `#b35a44` | `#b35a44` | `#d97757` |
| **Borders** | `#e2e8f0` | `#e2e8f0` | `#334155` |

---

## 🚀 Implementation Checklist

### ✅ Already Completed
- [x] Tailwind config extended with Slate & Clay colors
- [x] Global `theme.css` created with CSS variables
- [x] `theme.css` imported in `main.jsx`
- [x] Navbar updated with Light Slate + Clay accents
- [x] DashboardLayout sidebar uses Deep Slate for admin
- [x] Shared Button component uses Primary Clay

### 🔄 Apply to Other Components

#### Homepage Components
```jsx
// Banner.jsx - Light Slate background, Clay CTAs
<section className="bg-slate-50 dark:bg-slate-900">
  <h1 className="text-[#0f172a] dark:text-white">Find Your Ticket</h1>
  <Button variant="clay" size="xl">Search Now</Button>
</section>

// TicketCard.jsx - White cards with Clay hover
<div className="bg-white dark:bg-slate-800 border border-slate-200 hover:border-[#b35a44] transition-colors">
  <h3 className="text-[#0f172a] dark:text-white">Destination</h3>
  <p className="text-[#334155] dark:text-slate-300">Details...</p>
  <Button variant="outline-clay">View Details</Button>
</div>
```

#### Vendor Dashboard
```jsx
// AddTicket.jsx - Clean white forms
<form className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200">
  <input 
    className="border-slate-300 focus:border-[#b35a44] focus:ring-[#b35a44]"
    type="text"
  />
  <Button variant="clay" fullWidth>Add Ticket</Button>
</form>
```

#### Admin Dashboard
```jsx
// ManageUsers.jsx - Dark admin cards
<div className="bg-[#1e293b] border border-[#334155] rounded-xl">
  <h2 className="text-white">User Statistics</h2>
  <p className="text-slate-300">1,234 total users</p>
  <Button variant="admin">View Details</Button>
</div>
```

---

## 🌓 Dark Mode Support

All colors have been carefully selected to work in both light and dark modes:

```jsx
// Light mode: Light Slate background
// Dark mode: Deep Slate background
<div className="bg-slate-50 dark:bg-slate-900">

// Light mode: Dark text on light background
// Dark mode: Light text on dark background
<p className="text-[#0f172a] dark:text-white">Text</p>

// Light mode: Slate borders
// Dark mode: Darker slate borders
<div className="border-slate-200 dark:border-slate-700">
```

---

## 🎯 Context-Specific Best Practices

### Homepage
- **Goal**: Welcoming, approachable, friendly
- **Background**: Always use Light Slate (`#f8fafc`) in light mode
- **Cards**: White with subtle shadows
- **CTAs**: Bold Primary Clay buttons
- **Text**: High contrast for readability

### Vendor Dashboard
- **Goal**: Professional, efficient, clean
- **Background**: Predominantly white/slate-50
- **Forms**: White cards with slate borders
- **Actions**: Primary Clay for add/create, Slate for cancel/secondary
- **Tables**: Light slate headers, white rows

### Admin Panel
- **Goal**: Authoritative, focused, utilitarian
- **Sidebar**: Deep Slate (`#0f172a`) for maximum contrast
- **Content Area**: Light backgrounds (Slate 50) for readability
- **Navigation**: Light Clay (`#d97757`) for active states
- **Cards**: Darker surfaces (`#1e293b`) when displaying data
- **Text**: High contrast light text on dark backgrounds

---

## 🔍 Finding & Replacing Old Colors

Use these find/replace patterns in VS Code to update existing components:

| Old Pattern | New Pattern | Context |
|-------------|-------------|---------|
| `bg-blue-500` | `bg-[#b35a44]` | Primary buttons |
| `text-blue-600` | `text-[#b35a44]` | Primary text/links |
| `bg-gray-900` | `bg-[#0f172a]` | Dark backgrounds (admin) |
| `text-gray-700` | `text-[#334155]` | Body text |
| `bg-gray-50` | `bg-slate-50` | Light backgrounds |
| `hover:bg-blue-600` | `hover:bg-[#8e4636]` | Button hovers |
| `border-gray-300` | `border-slate-300` | Borders |

---

## 📦 Example: Complete Homepage Hero

```jsx
import Button from '../components/Button';
import { FaSearch, FaTicketAlt } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-[#0f172a] dark:text-white mb-6">
            Find Your Perfect
            <span className="text-[#b35a44]"> Ticket</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-[#334155] dark:text-slate-300 mb-10">
            Book bus tickets across Bangladesh with ease and confidence
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="clay" 
              size="xl" 
              icon={<FaSearch />}
            >
              Search Tickets
            </Button>
            
            <Button 
              variant="outline-clay" 
              size="xl"
              icon={<FaTicketAlt />}
            >
              View All Routes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

---

## 🎨 Example: Admin Dashboard Stats Card

```jsx
const StatsCard = ({ title, value, icon, change }) => {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 hover:border-[#b35a44] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-[#b35a44]/20 rounded-lg border border-[#b35a44]/30">
          <span className="text-2xl text-[#d97757]">{icon}</span>
        </div>
        <span className="text-green-400 text-sm font-semibold">
          +{change}%
        </span>
      </div>
      
      {/* Content */}
      <h3 className="text-slate-300 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

// Usage
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatsCard 
    title="Total Users" 
    value="1,234" 
    icon={<FaUsers />} 
    change={12} 
  />
  <StatsCard 
    title="Active Tickets" 
    value="456" 
    icon={<FaTicketAlt />} 
    change={8} 
  />
  <StatsCard 
    title="Revenue" 
    value="৳45,678" 
    icon={<FaChartLine />} 
    change={15} 
  />
</div>
```

---

## 💡 Pro Tips

1. **Consistency**: Always use the `Button` component instead of creating custom button styles
2. **Context Awareness**: Match background darkness to user context (admin = darker)
3. **Accessibility**: Maintain WCAG AA contrast ratios (all provided colors meet this)
4. **Hover States**: Clay colors (#b35a44, #d97757) should be used for interactive elements
5. **Dark Mode**: Test all components in both modes during development
6. **Semantic Naming**: Use CSS variables (e.g., `--admin-bg`) over hardcoded values when possible

---

## 🔗 Quick Links

- **Tailwind Config**: `tailwind.config.js` (lines 6-80)
- **Theme Variables**: `src/styles/theme.css` (complete CSS custom properties)
- **Button Component**: `src/components/Button.jsx` (shared across all contexts)
- **Navbar**: `src/components/Navbar.jsx` (homepage-optimized)
- **Dashboard Layout**: `src/layouts/DashboardLayout.jsx` (context-aware sidebar)

---

## 📞 Color Reference Table

### Hex to Tailwind Mapping

| Hex Code | Tailwind Class | CSS Variable | Description |
|----------|---------------|--------------|-------------|
| `#0f172a` | `bg-[#0f172a]` / `slate-900` | `--slate-deep` | Deep Slate - Admin sidebar |
| `#1e293b` | `bg-[#1e293b]` / `slate-800` | `--slate-800` | Slate 800 - Admin surfaces |
| `#334155` | `bg-[#334155]` / `slate-700` | `--slate-muted` | Muted Slate - Borders, secondary text |
| `#f8fafc` | `bg-slate-50` | `--slate-tint` | Slate Tint - Light backgrounds |
| `#b35a44` | `bg-[#b35a44]` | `--clay-primary` | Primary Clay - Main CTAs |
| `#d97757` | `bg-[#d97757]` | `--clay-light` | Light Clay - Hover, accents |
| `#8e4636` | `bg-[#8e4636]` | `--clay-700` | Dark Clay - Active states |

---

## ✅ Implementation Complete!

Your Slate & Clay design system is now ready to use across your entire MERN application. All core components have been updated, and you have:

1. ✅ Global theme file with CSS variables
2. ✅ Tailwind config with exact hex codes
3. ✅ Shared Button component with Primary Clay
4. ✅ Context-aware Navbar (Homepage optimized)
5. ✅ Deep Slate admin sidebar
6. ✅ Comprehensive implementation guide

**Next Steps**: Apply these patterns to your remaining pages (About, Contact, ticket listings, forms) using the examples above as templates.
