# 🚀 GodMode7 - Quick Start

## ✅ Server is Running!

The development server is now live at:
- **Local:** http://localhost:5174/
- **Network:** http://192.168.124.120:5174/

## 🎮 Try It Now

1. Open your browser to: **http://localhost:5174**
2. The app will load with mock data (no API keys needed!)
3. You can immediately:
   - See the 3D map
   - Click around the map
   - View the UI design

## 🔑 To Use Real Data

### Add Mapbox Token (5 minutes)

1. Get a free token: https://account.mapbox.com/access-tokens/
2. Create `.env` file in project root:

```env
VITE_MAPBOX_TOKEN=your_token_here
```

3. Restart the server (Ctrl+C in terminal, then `npm run dev`)
4. Now you can search for real businesses!

### Add L2 API (Optional)

Add to `.env`:
```env
VITE_L2_API_CUSTOMER=your_customer_id
VITE_L2_API_KEY=your_api_key
```

Without these, the app uses mock data automatically.

## 🎨 What You'll See

### Without API Keys
- ✅ Beautiful 3D map interface
- ✅ 20 mock people around default location
- ✅ All UI features working
- ✅ Filters, modals, selections
- ✅ Game-like animations

### With Mapbox Token Only
- ✅ Everything above PLUS:
- ✅ Real business search
- ✅ Actual map tiles
- ✅ 3D buildings for real locations
- ✅ Still uses mock people data

### With All API Keys
- ✅ Everything above PLUS:
- ✅ Real consumer data from L2
- ✅ Actual demographics
- ✅ Production-ready functionality

## 🐛 Fix Applied

**Issue:** Module resolution errors with `@/` path aliases  
**Solution:** Updated `vite.config.ts` to properly resolve `__dirname` in ESM mode

The path alias issue has been fixed! The `@/` imports now work correctly.

## 📱 Test Features

Try these now:

1. **Map Navigation**
   - Zoom in/out with mouse wheel
   - Drag to pan
   - Tilt the map (right-click + drag)

2. **Person Pins**
   - Click any green pin
   - View person details
   - Click "Select for Gift"

3. **Filter Panel**
   - Click "Filters" button (top right)
   - Try different filter options
   - Click "Apply Filters"

4. **Selection**
   - Select multiple people
   - See selection summary at bottom
   - Try "Clear" button

## ⚡ Hot Reload Enabled

Any code changes will automatically refresh the browser!

## 🔄 To Restart Server

```bash
# Stop with Ctrl+C in terminal
# Then run:
npm run dev
```

## 📞 Need Help?

If you see any errors:
1. Check browser console (F12)
2. Check terminal output
3. Contact: pleon.swe@gmail.com

---

**Status:** ✅ Running on http://localhost:5174  
**Ready for testing!** 🎉

