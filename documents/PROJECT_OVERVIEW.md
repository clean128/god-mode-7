# GodMode7.com - Project Overview & Quick Reference

## 📋 Project Summary

**GodMode7.com** is a gamified marketing platform that allows business owners to visually target and engage with potential customers through an interactive map-based interface.

**Target Audience:** Older business owners (e.g., doctors) who want marketing capabilities without hiring an agency

**Design Philosophy:** Simple, friendly, game-like (SimCity-esque), mobile-first with 4-click user journey

---

## 🎯 Core Value Proposition

**Problem:** Customers spend too much money with marketing agencies  
**Solution:** A "video game" that does marketing for them - they just "play" it

---

## 🔑 Key Features

### 1. **Business Search & Map Interface**
- Search for business via Mapbox API
- Load surrounding area with interactive map
- Game-like visual interface using Three.js

### 2. **People Data Integration**
- Display people as pins on map (L2DataMapping API)
- Click on pins to view detailed person information
- Hundreds of data fields available (demographics, income, interests, etc.)

### 3. **Advanced Filtering**
- Zillow-style filter UI
- Filter by demographics, location, preferences, interests
- Real-time map updates

### 4. **Gift & Message System**
- Select one or multiple people from map
- Choose gifts from catalog (Sendoso API)
- Compose personalized messages

### 5. **Payment Processing**
- Stripe integration for secure payments
- Transparent pricing

### 6. **Multi-Channel Notifications**
- In-app confirmation dialogs
- Email notifications
- SMS notifications (Twilio API)
- Delivery tracking

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js with TypeScript
- **3D/Graphics:** Three.js (for game-like experience)
- **Mapping:** Mapbox GL JS
- **Styling:** Tailwind CSS
- **State Management:** Zustand or Redux

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB or PostgreSQL

### Hosting
- **Platform:** Vercel

### Third-Party APIs
| API | Purpose |
|-----|---------|
| **Mapbox** | Map rendering and business location search |
| **L2DataMapping** | Consumer/demographic data (PRIVATE API) |
| **Sendoso** | Gift sending service |
| **Stripe** | Payment processing |
| **Twilio** | SMS notifications |

---

## 📊 Development Milestones

| # | Milestone | Duration | Cost | Status |
|---|-----------|----------|------|--------|
| 1 | Map Foundation + L2DataMapping Integration | 5 days | $1,400 | ⏳ In Progress |
| 2 | Filter System | 5 days | $1,400 | 📋 Pending |
| 3 | Selection & Gift Flow | 5 days | $1,400 | 📋 Pending |
| 4 | Payment & Notifications | 7 days | $1,800 | 📋 Pending |
| **TOTAL** | **MVP Completion** | **22 days** | **$6,000** | |

---

## 📱 User Journey (4-Click Maximum)

```
1. Search Business
   ↓
2. View Map with People Pins → Apply Filters
   ↓
3. Select People → Choose Gift + Message
   ↓
4. Pay → Receive Confirmation
```

---

## 🎮 Milestone 1: Map Foundation + L2DataMapping Integration

### Core Map Features
- [x] Mapbox integration & custom styling
- [x] Business location search
- [x] Load surrounding area of business
- [x] Map rendering & performance optimization
- [x] Pin clustering for performance
- [x] Three.js integration for game-like feel

### L2DataMapping Integration
- [x] API connection and authentication
- [x] Data fetching & caching layer
- [x] Person pin rendering on map
- [x] Pin detail modal/popup
- [x] Data transformation layer
- [x] Handle geographic circle_filter queries

### Deliverable
Interactive prototype with Three.js that feels like an early-stage game, not a static demo

---

## 🔍 L2 Consumer Data - Key Fields for GodMode7

### Essential Display Fields
- **Contact:** Name, Address, Phone, Email
- **Demographics:** Age, Gender, Income, Education
- **Location:** Lat/Long, Zip Code, County
- **Household:** Household Size, Homeowner Status

### Useful Filtering Fields
- **Income & Finance:** Estimated Income, Net Worth, Credit Rating
- **Interests:** 100+ interest categories (health, automotive, pets, sports, etc.)
- **Professional:** Occupation, Business Owner indicator
- **Lifestyle:** Lifestyle segments (upscale, value hunter, etc.)

### Advanced Targeting
- **Contribution Patterns:** Charitable giving, political affiliation
- **Buying Habits:** Online buyer, mail responder
- **Home Details:** Home value, purchase date, square footage
- **Vehicle Ownership:** Make, model, year

---

## 🔌 L2 API - Critical Endpoints for GodMode7

### Authentication
```
Base URL: https://api.l2datamapping.com
Auth: ?id=<api_customer>&apikey=<api_key>
Application: COM_US (Consumer data, United States)
```

### Key Endpoints

#### 1. Search People (Primary Endpoint)
```
POST /api/v2/records/search/<customer>/<app>
```
**Body:**
```json
{
  "filters": {
    "Residence_Addresses_Zip": "90210",
    "Voters_Gender": "F",
    "Estimated_Income": ["$75K-$100K", "$100K+"]
  },
  "circle_filter": {
    "lat": 34.0522,
    "long": -118.2437,
    "radius": 5000
  },
  "format": "json",
  "limit": 500
}
```

#### 2. Estimate Search Results (Cost Prevention)
```
POST /api/v2/records/search/estimate/<customer>/<app>
```
Use before every search to prevent unexpected API charges

#### 3. Get Available Columns
```
GET /api/v2/customer/application/columns/<customer>/<app>
```
Returns all available data fields

#### 4. Get Column Values (for Filters)
```
GET /api/v2/customer/application/values/<customer>/<app>/<column>
```

#### 5. Get Statistics (for UI Insights)
```
GET /api/v2/customer/application/stats/<customer>/<app>?view.<column>=1&filter.<column>=<value>
```

### Important Filters
- `Residence_Addresses_Zip` - Zip code
- `Voters_Gender` - Gender (M/F)
- `Estimated_Income` - Income ranges
- `Voters_Age` - Age
- `circle_filter` - Geographic radius (lat, long, radius in meters)
- `__UNIVERSES` - Saved audience segments

### Search Limits
- **JSON format:** Max 500 records per request
- **CSV format:** Unlimited (returns file)
- **Filter limit:** Max 12 filters per search

---

## 🎨 UI/UX Requirements

### Design Inspiration
- **Reference:** https://ui.caasie.co/map?demoOnly=true
- **Style:** SimCity-esque mobile game
- **Complexity:** Maximum 4 clicks from start to finish

### Key UI Elements
1. **Search Bar** - Prominent, top of screen
2. **Interactive Map** - Full screen, smooth animations
3. **Person Pins** - Clickable, clustered when zoomed out
4. **Info Panels** - SimCity-style bottom/side panels
5. **Filter Drawer** - Slide-in panel with friendly icons
6. **Selection Counter** - "3 people selected" indicator
7. **Gift Catalog** - Visual, easy browsing
8. **Progress Indicators** - Game-like "sending" animations

### Mobile-First Considerations
- Touch-friendly tap targets
- Swipe gestures for panels
- One-handed operation where possible
- Fast loading times
- Minimal text input

---

## 🚀 Post-MVP Features (Future)

### Integrations
- Postcard sending (Postalytics.com)
- Additional gift providers
- CRM integrations

### Platform Features
- Credit/Wallet system
- Gamification (points, achievements)
- Marketing landing pages
- User account management
- Team collaboration
- Billing management
- Analytics dashboard

### Compliance & Validation
- KYB (Know Your Business) validation
- Compliance dialogs
- Data privacy controls

---

## 📞 Stakeholders

### Client
**Steve Lee**  
Founder & CEO, SEOAesthetic.com  
📧 steve@seoaesthetic.com  
📱 +1 (347) 292-9294

### Project Manager
**Eric Sim**  
📧 eric@seoaesthetic.com

### Developer
**Igor Cecoltan** (Ideal Dev)  
📧 pleon.swe@gmail.com

### Communication
**Platform:** Slack (external guest access)

---

## 📚 Reference Documents

1. **[chat_history.md](./chat_history.md)** - Complete email conversation and project evolution
2. **[L2_Consumer_Data_Dictionary.md](./L2_Consumer_Data_Dictionary.md)** - All available consumer data fields
3. **[L2_API_Documentation.md](./L2_API_Documentation.md)** - Complete API reference

---

## ⚠️ Critical Notes

### API Usage
- **Always use estimate endpoint first** to avoid unexpected charges
- Usage is billed per record returned
- More fields = higher cost per record

### Data Privacy
- L2 data is for marketing purposes only
- Must comply with data usage policies
- Implement do-not-call flag respect

### Performance
- Implement pin clustering for large result sets
- Cache L2 API responses
- Use circle_filter to limit query scope
- Optimize map rendering

### User Experience
- Keep it SIMPLE - target is older, non-technical users
- Every feature should feel like "playing a game"
- Test on actual mobile devices
- Ensure 4-click maximum user journey

---

## 🎯 Success Criteria

- [ ] User can find their business in under 10 seconds
- [ ] User can identify target customers visually on map
- [ ] Filtering is intuitive (no instructions needed)
- [ ] Complete gift sending in 4 clicks or less
- [ ] Mobile experience feels smooth and game-like
- [ ] Load times under 3 seconds
- [ ] No unexpected API cost overruns

---

*Last Updated: January 12, 2026*  
*Project Status: Milestone 1 - In Progress*

