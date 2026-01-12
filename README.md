# 🎮 GodMode7 - Gamified Marketing Platform MVP

> Transform marketing into a game. Find, filter, and engage with customers through an interactive map-based interface.

![GodMode7](https://img.shields.io/badge/Status-Milestone%202%20Complete-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 🌟 Overview

GodMode7 is a gamified marketing platform that allows business owners to visually target and engage with potential customers in their area. Built with a SimCity-esque interface, it makes marketing as simple as playing a game.

### Target Users
- Business owners who want effective marketing without agency fees
- Non-technical users (e.g., doctors, dentists) who prefer visual, intuitive interfaces
- Anyone who wants to send personalized gifts to local prospects

---

## ✨ Features

### Milestone 1: Map Foundation ✅
- ✅ **3D Interactive Map** - Mapbox-powered map with 3D buildings and terrain
- ✅ **Business Search** - Find your business instantly using Mapbox Geocoder
- ✅ **Consumer Data Integration** - Load people from L2 DataMapping API based on location
- ✅ **Person Detail View** - Rich modal showing complete consumer information
- ✅ **Multi-Selection** - Select multiple people for batch gift sending
- ✅ **Game-like UI** - Smooth animations, neon effects, and polished interactions
- ✅ **Mock Data Mode** - Works without L2 API for demonstration purposes

### Milestone 2: Enhanced Filter System ✅
- ✅ **50+ Filter Options** - Demographics, financial, household, professional, lifestyle, behavioral, vehicles, education
- ✅ **Quick Filter Suggestions** - 6 pre-built filter combinations for common scenarios
- ✅ **Real-Time Result Preview** - See match count as you adjust filters
- ✅ **Filter Presets** - Save and load custom filter combinations
- ✅ **Collapsible Sections** - Organized filter categories for easy navigation
- ✅ **Mobile-Responsive** - Full-screen filter panel on mobile, sidebar on desktop
- ✅ **L2 API Integration** - All filters map to L2 DataMapping API fields
- ✅ **Auto Map Updates** - Map refreshes automatically when filters applied

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Mapbox API Token ([Get one free](https://account.mapbox.com/))
- L2 DataMapping API Credentials (optional for demo)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Add your Mapbox token to .env
VITE_MAPBOX_TOKEN=your_token_here

# 4. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

📖 **Detailed setup instructions:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🎮 How to Use

1. **Search for Your Business** - Type your business name in the search bar
2. **Explore the Map** - See people around your business as pins
3. **Click on Pins** - View detailed information about each person
4. **Open Filters** - Click the filter button to open the advanced filter panel
5. **Apply Quick Filter** - Choose from 6 pre-built suggestions or create custom filters
6. **See Results** - Watch the real-time match count update as you adjust filters
7. **Save Preset** - Save your filter combination for future use
8. **Select People** - Choose individuals to send gifts to (Milestone 3 feature)

---

## 🏗️ Project Structure

```
godmode7/
├── documents/              # 📚 Project documentation
│   ├── PROJECT_OVERVIEW.md         # Complete project requirements
│   ├── MILESTONE_1_SUMMARY.md      # Milestone 1 delivery summary
│   ├── MILESTONE_2_SUMMARY.md      # Milestone 2 delivery summary
│   ├── chat_history.md             # Client communication history
│   ├── L2_Consumer_Data_Dictionary.md  # Available data fields
│   └── L2_API_Documentation.md     # L2 API reference
├── src/
│   ├── components/         # ⚛️ React components
│   │   ├── BusinessSearch/         # Business search bar
│   │   ├── FilterPanel/            # Filter UI
│   │   ├── LoadingOverlay/         # Loading spinner
│   │   ├── Map/                    # Mapbox map component
│   │   ├── Notifications/          # Toast notifications
│   │   ├── PersonDetailModal/      # Person details popup
│   │   └── SelectionSummary/       # Selected people summary
│   ├── services/           # 🔌 API integrations
│   │   └── l2Api.ts                # L2 DataMapping service
│   ├── stores/             # 📦 State management
│   │   └── appStore.ts             # Zustand global store
│   ├── types/              # 📝 TypeScript definitions
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
├── SETUP_GUIDE.md          # 📖 Detailed setup instructions
└── README.md               # This file
```

---

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling

### Key Libraries
- **Mapbox GL JS** - Interactive 3D maps
- **@mapbox/mapbox-gl-geocoder** - Business search
- **Three.js** - 3D graphics (future enhancement)
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

### APIs
- **Mapbox API** - Maps and geocoding
- **L2 DataMapping API** - Consumer demographics data
- *Sendoso API* (Milestone 3) - Gift sending
- *Stripe API* (Milestone 4) - Payment processing
- *Twilio API* (Milestone 4) - SMS notifications

---

## 📅 Development Roadmap

### ✅ Milestone 1: Map Foundation + L2DataMapping Integration (Complete)
- [x] Mapbox integration with 3D buildings
- [x] Business search functionality
- [x] L2 API integration
- [x] Person pins on map
- [x] Basic filter system
- [x] Person detail modal
- [x] Selection system
- [x] Game-like UI/UX

### ✅ Milestone 2: Enhanced Filter System (Complete)
- [x] 50+ advanced filter options across 10 categories
- [x] Save & load filter presets
- [x] Real-time result count preview
- [x] 6 quick filter suggestions
- [x] Mobile-responsive design
- [x] L2 API integration for all filters
- [x] Auto map updates on filter apply
- [x] Collapsible filter sections

### 📦 Milestone 3: Selection & Gift Flow ($1,400)
- [ ] Gift catalog interface
- [ ] Sendoso API integration
- [ ] Message composition
- [ ] Multi-person gift sending
- [ ] Order confirmation

### 💳 Milestone 4: Payment & Notifications ($1,800)
- [ ] Stripe checkout integration
- [ ] Twilio SMS notifications
- [ ] Email notifications
- [ ] Order tracking
- [ ] Payment history

---

## 🎨 Design Philosophy

GodMode7 is designed to feel like a **game**, not a business tool:

- **4-Click Maximum** - From start to gift sent in just 4 clicks
- **Visual First** - See your customers, don't read spreadsheets
- **Mobile-First** - Optimized for phone and tablet use
- **Instant Feedback** - Smooth animations and immediate responses
- **No Learning Curve** - Intuitive enough for non-technical users

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🌍 Environment Variables

Create a `.env` file with these variables:

```env
# Required for Milestone 1
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_L2_API_CUSTOMER=your_l2_customer_id
VITE_L2_API_KEY=your_l2_api_key

# Required for Milestone 3
VITE_SENDOSO_API_KEY=your_sendoso_key

# Required for Milestone 4
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token
```

⚠️ **Never commit `.env` to version control!**

---

## 📊 Data Sources

### L2 DataMapping Consumer Data

The platform integrates with L2 DataMapping to access comprehensive consumer data:

- **500+ Data Fields** per person
- Demographics (age, gender, income, education)
- Property information
- Household composition
- Financial data
- Interests and buying habits
- Vehicle ownership
- And much more...

See [L2_Consumer_Data_Dictionary.md](./documents/L2_Consumer_Data_Dictionary.md) for complete field list.

---

## 🐛 Troubleshooting

### Map not loading?
- Check your `VITE_MAPBOX_TOKEN` in `.env`
- Restart the dev server after adding the token

### No people data?
- App will use mock data if L2 API is not configured
- Check `VITE_L2_API_CUSTOMER` and `VITE_L2_API_KEY` in `.env`
- Verify credentials with L2 DataMapping

### Styles broken?
- Clear browser cache
- Restart dev server
- Try incognito/private mode

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting tips.

---

## 📝 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete installation and usage guide
- **[documents/MILESTONE_1_SUMMARY.md](./documents/MILESTONE_1_SUMMARY.md)** - Milestone 1 delivery summary
- **[documents/MILESTONE_2_SUMMARY.md](./documents/MILESTONE_2_SUMMARY.md)** - Milestone 2 delivery summary
- **[documents/PROJECT_OVERVIEW.md](./documents/PROJECT_OVERVIEW.md)** - Project requirements and specifications
- **[documents/chat_history.md](./documents/chat_history.md)** - Client communication history
- **[documents/L2_API_Documentation.md](./documents/L2_API_Documentation.md)** - L2 API technical reference
- **[documents/L2_Consumer_Data_Dictionary.md](./documents/L2_Consumer_Data_Dictionary.md)** - Available data fields

---

## 👥 Team

**Client:** Steve Lee (steve@seoaesthetic.com)  
**Developer:** Igor Cecoltan (pleon.swe@gmail.com)  
**Project Manager:** Eric Sim (eric@seoaesthetic.com)

---

## 📄 License

Proprietary - © 2026 SEOAesthetic. All rights reserved.

---

## 🎯 Project Goals

> "Make marketing as easy as playing SimCity. Find customers, send gifts, grow business."

**Success Metrics:**
- ✅ User can find their business in < 10 seconds
- ✅ Complete customer targeting in 4 clicks
- ✅ Mobile experience feels like a game
- ✅ No technical knowledge required

---

*Built with ❤️ for business owners who deserve better marketing tools*
