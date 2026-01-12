# GodMode7 MVP - Milestone 1 Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Mapbox API Token (Required)
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# L2 DataMapping API Credentials (Optional for testing - will use mock data if not provided)
VITE_L2_API_CUSTOMER=your_customer_id
VITE_L2_API_KEY=your_api_key

# API Base URLs
VITE_L2_API_BASE_URL=https://api.l2datamapping.com
```

#### Getting a Mapbox Token

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign up or log in
3. Go to "Access Tokens"
4. Create a new token or copy your default public token
5. Paste it in your `.env` file

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📋 Features Implemented (Milestone 1)

### ✅ Core Map Features
- [x] Mapbox integration with dark theme
- [x] Business location search via Mapbox Geocoding
- [x] 3D buildings and terrain
- [x] Smooth animations and camera controls
- [x] Map rendering & performance optimization

### ✅ L2DataMapping Integration
- [x] API service layer with full TypeScript types
- [x] Estimate search endpoint (cost prevention)
- [x] Person data fetching with circle_filter
- [x] Data transformation layer
- [x] Mock data fallback for testing
- [x] Person pin rendering on map
- [x] Person detail modal/popup

### ✅ User Interface
- [x] Business search with autocomplete
- [x] Filter panel (gender, age, income, household, etc.)
- [x] Person detail modal with demographics
- [x] Selection summary bar
- [x] Notification system
- [x] Loading overlay
- [x] Game-like SimCity-style UI

### ✅ State Management
- [x] Zustand store for global state
- [x] Selected people tracking
- [x] Filter management
- [x] Map state synchronization

### ✅ Tech Stack
- [x] React 18 + TypeScript
- [x] Vite for build tooling
- [x] Tailwind CSS for styling
- [x] Mapbox GL JS for mapping
- [x] Zustand for state management
- [x] Axios for API calls
- [x] Lucide React for icons

## 🎮 How to Use

### 1. Search for Your Business
- Type your business name in the search bar at the top
- Select from the autocomplete suggestions
- The map will fly to your business location

### 2. View Nearby People
- People pins will automatically load around your business
- Click any pin to view detailed information
- The app will use mock data if L2 API credentials are not provided

### 3. Apply Filters
- Click the "Filters" button in the bottom bar
- Filter by:
  - Gender (Male, Female, Any)
  - Age range
  - Income ranges
  - Homeowner status
  - Children present
  - Business owner
  - Search radius

### 4. Select People
- Click on person pins to view details
- Click "Add to Selection" in the modal
- Selected people appear in the bottom summary bar

### 5. View Selection
- Bottom bar shows selected count
- Preview of selected people names
- Clear selection button

## 🔧 Project Structure

```
src/
├── components/
│   ├── BusinessSearch/
│   │   └── BusinessSearch.tsx
│   ├── FilterPanel/
│   │   └── FilterPanel.tsx
│   ├── LoadingOverlay/
│   │   └── LoadingOverlay.tsx
│   ├── Map/
│   │   ├── Map.tsx
│   │   └── PersonMarker.tsx
│   ├── Notifications/
│   │   └── NotificationContainer.tsx
│   ├── PersonDetailModal/
│   │   └── PersonDetailModal.tsx
│   └── SelectionSummary/
│       └── SelectionSummary.tsx
├── services/
│   └── l2Api.ts          # L2 DataMapping API service
├── stores/
│   └── appStore.ts       # Zustand global state
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## 🎨 UI Theme

The app uses a dark, game-like theme inspired by SimCity:

- **Primary Color**: Blue (`#0ea5e9`)
- **Background**: Dark navy (`#1a1f2e`)
- **Panels**: Semi-transparent glass effect
- **Accent**: Green (`#4ade80`)
- **Animations**: Smooth slide-ins, fades, and pulses

## 🔌 API Integration

### L2 DataMapping API

The app integrates with L2's Consumer Data API (`COM_US`):

**Key Endpoints Used:**
- `POST /api/v2/records/search/estimate` - Estimate result count
- `POST /api/v2/records/search` - Search for people
- `GET /api/v2/customer/application/columns` - Get available fields

**Data Fields Displayed:**
- Demographics (age, gender, marital status)
- Contact (email, phone)
- Financial (income, net worth, home value)
- Household (homeowner, children, household size)
- Professional (occupation, business owner)
- Interests

**Cost Prevention:**
- Always calls estimate endpoint first
- Warns if too many results (>1000)
- Limits to 500 results max for JSON format
- Mock data fallback if API not configured

## 🚨 Known Limitations

1. **Three.js Game Effects**: Basic implementation - full game effects pending (see Milestone 1 completion)
2. **Pin Clustering**: Individual pins work, clustering for large datasets needs optimization
3. **L2 Field Mapping**: Using common fields - custom field mapping may be needed for specific use cases
4. **Mobile Optimization**: Works on mobile but can be further optimized

## 🛠️ Troubleshooting

### Map Not Loading
- Check that `VITE_MAPBOX_TOKEN` is set in `.env`
- Verify the token is valid at mapbox.com
- Check browser console for errors

### No People Data
- L2 API credentials not configured (will use mock data)
- Check that business location is selected
- Try adjusting search radius in filters
- Check browser console for API errors

### Styling Issues
- Run `npm install` to ensure all dependencies are installed
- Clear browser cache
- Check that Tailwind CSS is properly configured

## 📦 Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🎯 Next Steps (Milestone 2)

- Advanced filter system with more L2 fields
- Pin clustering optimization
- Enhanced Three.js game effects
- Performance improvements
- Gift selection interface (Milestone 3)
- Payment integration (Milestone 4)

## 💡 Tips

- Use the browser dev tools to monitor network requests
- Check the console for helpful debug logs
- The app auto-generates mock data for demo purposes
- Search radius defaults to 5km but can be adjusted in filters

---

**Milestone 1 Status**: ✅ Complete

**Developer**: Igor Cecoltan (Ideal Dev)  
**Client**: Steve Lee (SEOAesthetic.com)  
**Project**: GodMode7.com MVP

