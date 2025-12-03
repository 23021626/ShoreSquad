# ShoreSquad 🌊

**Rally your crew, track weather, and hit the next beach cleanup with our dope map app!**

ShoreSquad is a mobile-first web application that mobilizes young people to clean beaches by combining interactive maps, real-time weather forecasts, and social engagement.

---

## 🎯 Features

✨ **Interactive Map** – Discover nearby beach cleanups with Leaflet.js  
🌡️ **Real-Time Weather** – 4-day forecast powered by Singapore's NEA API  
🔍 **Search & Filter** – Find cleanups by date, location, and crew  
📊 **Impact Dashboard** – Track environmental contribution (kg collected, cleanups joined)  
📱 **Mobile-First Design** – Fully responsive with accessibility (WCAG 2.1 AA)  
👥 **Social Features** – Share cleanups, invite friends, build crews  
⚡ **Robust** – Error handling, loading spinners, graceful fallbacks  
🎨 **Modern UI** – Brand colors, animations, gradient effects  

---

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup, accessibility |
| **CSS3** | Responsive design, animations, gradients |
| **JavaScript (Vanilla)** | No frameworks, lightweight & fast |
| **Leaflet.js** | Interactive maps |
| **NEA API** | Real-time weather data (Singapore) |

---

## 🚀 Getting Started

### Prerequisites

- Modern browser (Chrome, Firefox, Safari, Edge)
- No build process or dependencies required
- Internet connection (for weather API & map tiles)

### Option A: Live Server (VS Code) – Recommended ⭐

1. **Install Live Server extension**:
   - Open VS Code
   - Extensions (Ctrl+Shift+X)
   - Search "Live Server" by Ritwick Dey
   - Click Install

2. **Launch the app**:
   - Right-click `index.html` in file explorer
   - Select **"Open with Live Server"**
   - Browser opens automatically at `http://127.0.0.1:5500`

3. **Auto-refresh on save**:
   - Edit CSS, HTML, or JS
   - Changes appear instantly (no manual refresh)

### Option B: Python (Terminal)

```bash
cd ShoreSquad
python -m http.server 8000
# Navigate to http://localhost:8000
```

### Option C: Node.js

```bash
cd ShoreSquad
npx http-server
# Navigate to http://localhost:8080
```

---

## 📁 File Structure

```
ShoreSquad/
├── index.html              # HTML5 semantic markup + ARIA labels
├── css/
│   └── styles.css          # Responsive design, brand colors, animations
├── js/
│   └── app.js              # Core app logic with error handling
├── .gitignore              # Git exclusions
├── README.md               # This file
└── .git/                   # Git repository
```

---

## 🌤️ Weather API Integration

ShoreSquad uses **Singapore's National Environment Agency (NEA)** weather API via **data.gov.sg**.

### Endpoints

- **2-Hour Forecast**: `https://api.data.gov.sg/v1/environment/2-hour-weather-forecast`
- **4-Day Forecast**: `https://api.data.gov.sg/v1/environment/4-day-weather-forecast`

### Data Specifications

| Spec | Details |
|------|---------|
| 🌡️ Temperature | Celsius (°C) |
| 💨 Wind Speed | km/h (kilometers per hour) |
| 💧 Humidity | % (percentage) |
| 🔄 Update Frequency | Every 30 minutes |
| 📍 Coverage | Singapore regions |

### Example API Response

```json
{
  "items": [
    {
      "valid_period": {
        "start": "2025-03-15T09:00:00Z",
        "end": "2025-03-15T11:00:00Z"
      },
      "general": {
        "forecast": "Partly Cloudy"
      }
    }
  ]
}
```

### API Rate Limits

As of **December 2025**, data.gov.sg enforces rate limits:

1. Sign up at https://data.gov.sg/signin
2. Request API key for higher limits
3. Add to requests: `?api_key=YOUR_KEY`

### Testing

```bash
# Test in terminal
curl "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast" | jq

# Or visit in browser
https://api.data.gov.sg/v1/environment/2-hour-weather-forecast
```

---

## 🛡️ Robustness & Error Handling

ShoreSquad includes comprehensive error recovery:

### What's Implemented

✅ **Try/Catch Blocks** – All API calls and event handlers wrapped  
✅ **Loading Spinners** – Visual feedback during data fetch  
✅ **Error Messages** – User-friendly alerts when failures occur  
✅ **Graceful Fallbacks** – App works even if API is unavailable  
✅ **Console Logging** – Detailed logs for debugging  

### Error Recovery Examples

| Scenario | Fallback |
|----------|----------|
| Weather API fails | Shows error message, placeholder data |
| Share fails | Offers clipboard copy as alternative |
| Filter error | Notifies user, logs to console |
| Geolocation denied | Defaults to Venice Beach demo location |

---

## 🎨 Brand & Design

### Color Palette

| Color | Hex | Usage | Psychology |
|-------|-----|-------|-----------|
| Ocean Blue | `#0077BE` | Primary buttons, links | Trust, calm, ocean |
| Sandy Gold | `#F4A460` | Secondary actions | Warmth, sun, beach |
| Coral Accent | `#FF6B6B` | CTA, alerts | Energy, urgency, youth |
| Fresh Green | `#2ECC71` | Success, badges | Growth, environment |
| Deep Navy | `#1A3A52` | Text, headings | Readability, professional |
| Light Sand | `#FFF8DC` | Background | Cleanliness, beach |

### Animations

- **Fade-in**: Cards appear smoothly
- **Slide-down**: Sections enter from top
- **Pulse**: Loading spinners rotate
- **Hover effects**: Buttons lift and glow
- **Gradient wave**: Hero section animated background

---

## ♿ Accessibility (WCAG 2.1 AA)

✅ **Contrast**: Minimum 4.5:1 text-to-background  
✅ **Keyboard Navigation**: All interactive elements via Tab  
✅ **Screen Readers**: Semantic HTML + ARIA labels  
✅ **Touch Targets**: All buttons ≥ 44×44px  
✅ **Focus Indicators**: Visible outlines on all interactive elements  
✅ **Readable Fonts**: 16px base, 1.6 line-height  
✅ **Color Independence**: Information not conveyed by color alone  

---

## ⚡ Performance

### Optimizations

🚀 **Lazy Image Loading** – Images load when visible (IntersectionObserver)  
🚀 **Debounced Search** – Search waits 300ms before filtering  
🚀 **Efficient DOM** – Minimal re-renders, batched updates  
🚀 **CSS Animations** – Hardware-accelerated transforms (60fps)  
🚀 **API Caching** – Weather fetched once, reused across page  

### Browser Support

| Browser | Supported | Min Version |
|---------|-----------|-------------|
| Chrome | ✅ Yes | 90+ |
| Firefox | ✅ Yes | 88+ |
| Safari | ✅ Yes | 13+ |
| Edge | ✅ Yes | 90+ |

---

## 📊 Metric Units

All measurements use the **metric system**:

| Measurement | Unit | Symbol |
|-------------|------|--------|
| Temperature | Celsius | °C |
| Wind Speed | Kilometers per Hour | km/h |
| Impact | Kilograms | kg |
| Distance | Kilometers | km |

---

## 🌐 Deployment

### Deploy to GitHub Pages (Free Hosting)

**Step 1: Push to GitHub**
```bash
cd ShoreSquad
git remote add origin https://github.com/YOUR_USERNAME/ShoreSquad.git
git branch -M main
git push -u origin main
```

**Step 2: Enable GitHub Pages**
1. Go to GitHub repository
2. Settings → Pages
3. Source: `main` branch
4. Click Save
5. Site live at: `https://YOUR_USERNAME.github.io/ShoreSquad`

**Step 3: Future Updates**
```bash
git add .
git commit -m "Update ShoreSquad"
git push
# Changes live in ~1-2 minutes
```

### Alternative Hosting

- **Vercel** (free): `vercel deploy`
- **Netlify** (free): Connect GitHub repo
- **Surge.sh** (free): `surge`
- **AWS S3** (production): Higher reliability

---

## 🔧 Development

### Running in Development Mode

```bash
# Option 1: Live Server (auto-refresh)
# Right-click index.html → Open with Live Server

# Option 2: Python
python -m http.server 8000

# Option 3: Node.js
npx http-server
```

### Debugging

1. **Browser DevTools**: F12 or right-click → Inspect
2. **Console**: Check for error messages
3. **Network tab**: Verify API calls to NEA
4. **Mobile simulation**: F12 → Device Toolbar

### Making Changes

- **CSS**: Changes appear instantly (Live Server)
- **HTML**: Auto-refreshes
- **JavaScript**: Auto-refreshes
- **Images**: Lazy-loaded on scroll

---

## 🐛 Troubleshooting

### Weather data not loading?
- Check internet connection
- Verify data.gov.sg is accessible (rare downtime)
- Open DevTools (F12) → Console for errors

### Map not showing?
- Ensure Leaflet.js CDN is accessible
- Check browser console for JS errors
- Try refreshing the page (Ctrl+F5)

### Mobile responsive issues?
- Use DevTools device emulation (F12 → Ctrl+Shift+M)
- Test landscape and portrait modes
- Check touch interactions with real device

### API calls failing?
- Check rate limits (sign up for API key)
- Verify CORS isn't blocking requests
- Try from different network (rule out ISP blocks)

---

## 🚀 Future Enhancements

- 🔐 User authentication (Firebase/Supabase)
- 📱 Native mobile app (React Native / Flutter)
- 💬 Real-time crew chat (WebSockets)
- 🏆 Leaderboards & achievement badges
- 🌍 Multi-country support (beyond Singapore)
- 📊 Admin dashboard for event management
- 🗺️ Enhanced map features (routing, heat maps)
- 📸 Photo upload & community gallery

---

## 📜 License

**Open Data Licence** – Free for commercial and personal use.  
See [data.gov.sg/open-data-licence](https://data.gov.sg/open-data-licence)

---

## 🙏 Credits

- **Weather Data**: National Environment Agency (NEA), Singapore
- **Maps**: Leaflet.js, OpenStreetMap contributors
- **Data Portal**: data.gov.sg (Open Government Products)

---

## 📞 Support

- 🐛 **Report Issues**: GitHub Issues section
- 💡 **Feature Requests**: GitHub Discussions
- 📧 **Questions**: team@shoresquad.app

---

## 🎉 Contributing

Want to improve ShoreSquad? Pull requests welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome-feature`)
5. Open Pull Request

---

**Rally your crew. Clean our coasts. 🌍**

*Built with ♻️ for the environment.*
