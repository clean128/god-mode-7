# GodMode7 MVP - Setup & Installation Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

## 🔑 Required API Keys

You'll need to obtain the following API keys:

### 1. Mapbox API Token (Required for Milestone 1)
- Visit: https://account.mapbox.com/access-tokens/
- Sign up for a free account
- Create a new access token with default permissions
- Copy the token for later use

### 2. L2 DataMapping API Credentials (Required for Milestone 1)
- Contact L2 DataMapping to get your API credentials
- You'll need:
  - `API Customer ID` (e.g., "3V0L")
  - `API Key`
- Documentation: https://api.l2datamapping.com

### 3. Sendoso API (Required for Milestone 3 - Not yet needed)
- Will be needed for gift sending feature

### 4. Stripe API (Required for Milestone 4 - Not yet needed)
- Will be needed for payment processing

### 5. Twilio API (Required for Milestone 4 - Not yet needed)
- Will be needed for SMS notifications

---

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment Variables File

Create a file named `.env` in the root of the project (same level as `package.json`):

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

If `.env.example` doesn't exist, create `.env` manually with this content:

```env
# Mapbox API Token
VITE_MAPBOX_TOKEN=your_actual_mapbox_token_here

# L2 DataMapping API Credentials
VITE_L2_API_BASE_URL=https://api.l2datamapping.com
VITE_L2_API_CUSTOMER=your_customer_id_here
VITE_L2_API_KEY=your_api_key_here
```

### Step 3: Add Your API Keys

Open the `.env` file and replace the placeholder values with your actual API keys:

```env
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImFiY2RlZjEyMzQ1Njc4OTAifQ.abcdefghijklmnopqrstuvwxyz
VITE_L2_API_CUSTOMER=3V0L
VITE_L2_API_KEY=a1b2c3d4e5f6g7h8i9j0
```

⚠️ **Important:** Never commit your `.env` file to version control. It should already be in `.gitignore`.

---

## 🎮 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will open at: **http://localhost:5173**

### Build for Production

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

---

## 📱 Using the Application

### Milestone 1 Features

1. **Search for Your Business**
   - Type your business name in the search bar at the top
   - Select from the dropdown suggestions
   - The map will fly to your business location

2. **View People Around Your Business**
   - After selecting a business, the map will automatically load nearby people
   - People appear as pins on the map
   - Different pin colors indicate:
     - 🟣 Purple: Business owners
     - 🔵 Blue: Homeowners
     - 🟢 Green: General population

3. **Click on Person Pins**
   - Click any person pin to view their detailed information
   - Modal shows demographics, income, household info, interests
   - You can select people for gift sending (Milestone 3)

4. **Filter People**
   - Click the "Filters" button in the top-right corner
   - Apply filters for:
     - Gender
     - Age range
     - Income level
     - Homeowners only
     - Business owners only
     - Households with children
     - Search radius
   - Click "Apply Filters" to see results

5. **Select Multiple People**
   - Click on person pins or use the "Select for Gift" button in detail modal
   - Selected people appear in the selection summary at the bottom
   - You can send gifts to multiple people at once (feature coming in Milestone 3)

---

## 🐛 Troubleshooting

### Issue: Map doesn't load / Shows "Mapbox Token Required"

**Solution:** Make sure you've added your Mapbox token to the `.env` file:

```env
VITE_MAPBOX_TOKEN=your_actual_token_here
```

Then restart the dev server:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Issue: No people data loading / Using mock data

**Solution:** This happens when L2 API credentials are not configured or invalid.

1. Check your `.env` file has L2 credentials
2. Verify the credentials with L2 DataMapping
3. Restart the dev server

For demonstration purposes, the app will use mock data if L2 API is not configured.

### Issue: Port 5173 already in use

**Solution:** Either:
- Stop the other application using port 5173
- Or run with a different port:

```bash
npm run dev -- --port 3000
```

### Issue: Styles not loading correctly

**Solution:**
1. Clear your browser cache
2. Restart the dev server
3. Try incognito/private browsing mode

---

## 🗂️ Project Structure

```
godmode7/
├── documents/              # Project documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── chat_history.md
│   ├── L2_Consumer_Data_Dictionary.md
│   └── L2_API_Documentation.md
├── src/
│   ├── components/         # React components
│   │   ├── BusinessSearch/
│   │   ├── FilterPanel/
│   │   ├── LoadingOverlay/
│   │   ├── Map/
│   │   ├── Notifications/
│   │   ├── PersonDetailModal/
│   │   └── SelectionSummary/
│   ├── services/           # API services
│   │   └── l2Api.ts       # L2 DataMapping API integration
│   ├── stores/            # State management (Zustand)
│   │   └── appStore.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (create this)
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite bundler configuration
```

---

## 🎨 Customization

### Changing the Default Map Location

Edit `src/stores/appStore.ts`:

```typescript
mapState: {
  center: [-74.006, 40.7128], // [longitude, latitude]
  zoom: 15,
  pitch: 60,
  bearing: 0,
},
```

### Changing Colors

Edit `tailwind.config.js` to customize the game theme colors:

```javascript
colors: {
  game: {
    bg: '#1a1f2e',        // Background color
    panel: '#252b3d',     // Panel color
    border: '#3d4558',    // Border color
    accent: '#4ade80',    // Accent color (green)
  }
}
```

---

## 📦 Key Dependencies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Mapbox GL JS** - Interactive maps
- **Three.js** - 3D effects (will be enhanced in future milestones)
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

---

## 🔒 Security Notes

- Never commit `.env` file to Git
- Keep API keys secure and private
- Don't share your L2 API credentials
- For production deployment, use environment variables provided by your hosting platform

---

## 📞 Support

If you encounter any issues:

1. Check this guide first
2. Review the error messages in the browser console (F12)
3. Contact Igor Cecoltan: pleon.swe@gmail.com
4. Or contact Steve Lee: steve@seoaesthetic.com

---

## ✅ Milestone 1 Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Mapbox token added to `.env`
- [ ] L2 API credentials added to `.env` (optional for demo)
- [ ] Dev server running (`npm run dev`)
- [ ] Application opens in browser
- [ ] Can search for businesses
- [ ] Map loads with 3D buildings
- [ ] People pins appear on map
- [ ] Can click on pins to see details
- [ ] Filter panel opens and closes
- [ ] Can select multiple people
- [ ] Notifications appear

---

*Last Updated: January 12, 2026*  
*GodMode7 MVP - Milestone 1*

