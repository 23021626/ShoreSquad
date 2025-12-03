# ShoreSquad 🌊

Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

## Overview

ShoreSquad is a mobile-first web application that mobilizes young people to clean beaches by:
- 📍 Interactive map showing cleanup events
- 🌡️ Real-time weather forecasts from Singapore's NEA API
- 👥 Social crew management and impact tracking
- 🎯 Gamified impact dashboard

## Features

- **Interactive Map** – Discover nearby beach cleanups with Leaflet.js
- **Real-Time Weather** – 4-day forecast powered by National Environment Agency (NEA) API
- **Search & Filter** – Find cleanups by date, location, and crew
- **Impact Dashboard** – Track your environmental contribution (kg collected, cleanups joined)
- **Mobile-First Design** – Fully responsive with accessibility (WCAG 2.1 AA)
- **Social Features** – Share cleanups, invite friends, build crews

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Maps:** Leaflet.js
- **Weather API:** Singapore's National Environment Agency (NEA) Real-time API
- **Development:** Live Server for hot-reload development

## Weather API Integration

### NEA Real-time Weather API

ShoreSquad uses Singapore's official NEA weather API to provide up-to-date forecasts:

**Endpoints:**
- **2-Hour Forecast:** `https://api.data.gov.sg/v1/environment/2-hour-weather-forecast`
- **4-Day Forecast:** `https://api.data.gov.sg/v1/environment/4-day-weather-forecast`

**Example Response (2-Hour Forecast):**
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

**Data Format:**
- Temperature unit: **Celsius (°C)**
- Wind speed unit: **km/h**
- Humidity: **% (percentage)**
- Updates every 30 minutes

### How to Use

1. The app automatically fetches and displays weather on page load
2. Select a cleanup location on the map to view its weather
3. Weather data is cached for performance
4. Graceful fallback if API is unavailable

## Metric Units

All measurements use the **metric system**:
- 🌡️ Temperature: °C (Celsius)
- 💨 Wind: km/h (kilometers per hour)
- ⚖️ Impact: kg (kilograms)
- 📍 Distance: km (kilometers)

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Ocean Blue | #0077BE | Primary, trust |
| Sandy Gold | #F4A460 | Secondary, warmth |
| Coral Accent | #FF6B6B | Call-to-action |
| Fresh Green | #2ECC71 | Success, eco-impact |
| Deep Navy | #1A3A52 | Text, contrast |
| Light Sand | #FFF8DC | Background |

## Accessibility

- ♿ WCAG 2.1 AA compliant
- 🎹 Full keyboard navigation
- 📱 Touch-friendly (44×44px minimum targets)
- 🎤 Screen reader support with ARIA labels
- 🔤 Readable fonts (1.6 line-height, 16px base)

## Getting Started

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, Edge)
- No build process or dependencies required
- Live Server extension (optional, for development)

### Installation

```bash
# Clone the repository
cd ShoreSquad

# Option 1: Use Live Server in VS Code
# Right-click index.html → Open with Live Server

# Option 2: Use Python
python -m http.server 8000
# Navigate to http://localhost:8000

# Option 3: Use Node.js http-server
npx http-server
```

### File Structure

```
ShoreSquad/
├── index.html        # HTML5 boilerplate with semantic markup
├── css/
│   └── styles.css    # Responsive design + brand colors
├── js/
│   └── app.js        # Core app logic + API integrations
├── .gitignore        # Git exclusions
└── README.md         # This file
```

## Development

### Running Live Server

```bash
# Install Live Server extension in VS Code
# Then: Open Command Palette → "Live Server: Open with Live Server"

# Or start manually on port 5500
# VS Code's Live Server will auto-refresh on file changes
```

### API Testing

To test the NEA API directly:

```bash
# 2-Hour Forecast
curl "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"

# 4-Day Forecast
curl "https://api.data.gov.sg/v1/environment/4-day-weather-forecast"
```

### Performance Tips

- Images use lazy-loading (IntersectionObserver)
- Search/filter inputs use debouncing (300ms)
- Maps use circle markers for better performance
- Service Worker hooks for PWA enhancement

## Future Enhancements

- 🔐 User authentication (Firebase/Supabase)
- 📱 Mobile app (React Native / Flutter)
- 💬 Real-time crew chat
- 🏆 Leaderboards & badges
- 🌍 Multi-location support (beyond Singapore)
- 📊 Admin dashboard for event management

## API Rate Limits

Singapore's data.gov.sg has rate limits. As of December 2025:

> Sign up on data.gov.sg for higher rate limits (enforced 31 Dec 2025)

For production use:
```bash
# Register at: https://data.gov.sg/signin
# Request API key for priority support
```

## License

Open Data Licence – Free for commercial and personal use.
See [data.gov.sg/open-data-licence](https://data.gov.sg/open-data-licence)

## Credits

- **Weather Data:** National Environment Agency (NEA), Singapore
- **Maps:** Leaflet.js, OpenStreetMap contributors
- **Data Portal:** data.gov.sg (Open Government Products)

## Support

- 🐛 Report issues: Issues section in repo
- 💡 Feature requests: Create a GitHub Discussion
- 📧 Questions: Contact team@shoresquad.app

---

**Rally your crew. Clean our coasts. 🌍**

Built with ♻️ for the environment.
