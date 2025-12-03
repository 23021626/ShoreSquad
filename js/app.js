/**
 * ShoreSquad - Main Application Module
 * Handles map initialization, weather API integration, cleanup data,
 * crew management, and social features.
 */

// ============================================
// Mock Data for Development
// ============================================

const mockCleanups = [
    {
        id: 1,
        title: "Venice Beach Spring Cleanup",
        location: "Venice Beach, CA",
        date: "2025-03-15",
        time: "09:00",
        description: "Join us for a morning of beach cleanup and community connection!",
        crew: "Eco Warriors",
        members: 12,
        impact: 45,
        icon: "🌊"
    },
    {
        id: 2,
        title: "Malibu Coast Conservation",
        location: "Malibu, CA",
        date: "2025-03-22",
        time: "10:00",
        description: "Help protect our beautiful coastline. Bring friends!",
        crew: "Beach Guardians",
        members: 8,
        impact: 32,
        icon: "🏖️"
    },
    {
        id: 3,
        title: "Santa Monica Pier Cleanup",
        location: "Santa Monica, CA",
        date: "2025-03-29",
        time: "08:00",
        description: "Join the largest beach cleanup event of the month.",
        crew: "Ocean Lovers",
        members: 25,
        impact: 78,
        icon: "♻️"
    }
];

// ============================================
// Application State
// ============================================

const appState = {
    currentUser: {
        id: 'user123',
        name: 'Alex',
        crew: 'Eco Warriors',
        cleanupsJoined: 3,
        totalImpact: 125,
        crewMembers: 8
    },
    map: null,
    currentLocation: { lat: 34.0195, lng: -118.4912 }, // Default: Venice Beach
    selectedCleanup: null,
    cleanups: mockCleanups,
    favorites: new Set()
};

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function for search/filter inputs
 */
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Lazy-load images using IntersectionObserver
 */
function lazyLoadImages() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Format date to readable format
 */
function formatDate(dateStr) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ============================================
// Map Initialization
// ============================================

function initMap() {
    const { lat, lng } = appState.currentLocation;
    
    appState.map = L.map('map').setView([lat, lng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(appState.map);

    // Add markers for each cleanup
    appState.cleanups.forEach(cleanup => {
        // Rough coordinates for demo (in real app, would be exact)
        const coords = [
            { lat: 34.0195, lng: -118.4912 }, // Venice Beach
            { lat: 34.0280, lng: -118.6819 }, // Malibu
            { lat: 34.0136, lng: -118.4944 }  // Santa Monica
        ];

        const marker = L.circleMarker(coords[cleanup.id - 1], {
            radius: 8,
            fillColor: '#0077BE',
            color: '#FFF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        marker.bindPopup(`
            <div style="padding: 8px;">
                <strong>${cleanup.title}</strong><br>
                📍 ${cleanup.location}<br>
                👥 ${cleanup.members} joining
            </div>
        `);

        marker.on('click', () => {
            appState.selectedCleanup = cleanup;
            updateWeather(cleanup);
            highlightCleanupCard(cleanup.id);
        });

        marker.addTo(appState.map);
    });
}

// ============================================
// Weather Integration (Mock)
// ============================================

function updateWeather(cleanup) {
    const weatherContainer = document.getElementById('weatherContainer');
    
    // Mock weather data
    const weatherData = {
        1: { temp: 22, condition: '☀️ Sunny', humidity: 65, windSpeed: 8 },
        2: { temp: 20, condition: '🌤️ Partly Cloudy', humidity: 70, windSpeed: 12 },
        3: { temp: 21, condition: '☀️ Sunny', humidity: 68, windSpeed: 7 }
    };

    const weather = weatherData[cleanup.id] || { temp: 20, condition: '☀️ Sunny', humidity: 65, windSpeed: 8 };

    weatherContainer.innerHTML = `
        <div class="weather-card">
            <h3>${cleanup.location}</h3>
            <div class="weather-emoji">${weather.condition.split(' ')[0]}</div>
            <div class="weather-temp">${weather.temp}°C</div>
            <p>${weather.condition}</p>
            <small>💧 ${weather.humidity}% | 🌬️ ${weather.windSpeed} km/h</small>
        </div>
    `;

    // In production, integrate OpenWeatherMap API:
    // fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
}

// ============================================
// Cleanup List Rendering
// ============================================

function renderCleanups(cleanupsToRender = appState.cleanups) {
    const cleanupsList = document.getElementById('cleanupsList');
    cleanupsList.innerHTML = '';

    if (cleanupsToRender.length === 0) {
        cleanupsList.innerHTML = '<p class="placeholder">No cleanups found.</p>';
        return;
    }

    cleanupsToRender.forEach(cleanup => {
        const li = document.createElement('li');
        li.className = 'cleanup-card';
        li.id = `cleanup-${cleanup.id}`;
        li.setAttribute('role', 'listitem');
        
        li.innerHTML = `
            <div class="cleanup-header">
                <h3 class="cleanup-title">${cleanup.icon} ${cleanup.title}</h3>
                <span class="cleanup-badge">${cleanup.members} joining</span>
            </div>
            
            <div class="cleanup-details">
                <div class="cleanup-detail-item">
                    <span>📍</span> <strong>${cleanup.location}</strong>
                </div>
                <div class="cleanup-detail-item">
                    <span>📅</span> <strong>${formatDate(cleanup.date)}</strong>
                </div>
                <div class="cleanup-detail-item">
                    <span>⏰</span> <strong>${cleanup.time}</strong>
                </div>
                <div class="cleanup-detail-item">
                    <span>👥</span> <strong>${cleanup.crew}</strong>
                </div>
            </div>
            
            <p class="cleanup-description">${cleanup.description}</p>
            
            <div class="cleanup-actions">
                <button class="btn btn-primary" onclick="joinCleanup(${cleanup.id})" aria-label="Join this cleanup">
                    ✓ Join Cleanup
                </button>
                <button class="btn btn-secondary" onclick="shareCleanup(${cleanup.id})" aria-label="Share this cleanup">
                    🔗 Share
                </button>
            </div>
        `;

        cleanupsList.appendChild(li);
    });
}

// ============================================
// Cleanup Actions
// ============================================

function joinCleanup(cleanupId) {
    const cleanup = appState.cleanups.find(c => c.id === cleanupId);
    if (cleanup) {
        cleanup.members += 1;
        appState.currentUser.cleanupsJoined += 1;
        appState.currentUser.totalImpact += cleanup.impact;
        updateImpactDashboard();
        renderCleanups();
        showNotification(`✓ You joined "${cleanup.title}"!`, 'success');
    }
}

function shareCleanup(cleanupId) {
    const cleanup = appState.cleanups.find(c => c.id === cleanupId);
    if (cleanup) {
        const text = `Join me at ${cleanup.title} on ${cleanup.date}! Help clean our beaches. #ShoreSquad`;
        if (navigator.share) {
            navigator.share({
                title: 'ShoreSquad',
                text: text,
                url: window.location.href
            }).catch(err => console.log('Share error:', err));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(text);
            showNotification('✓ Copied to clipboard!', 'success');
        }
    }
}

// ============================================
// Search & Filter
// ============================================

function filterCleanups() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;

    const filtered = appState.cleanups.filter(cleanup => {
        const matchesSearch = cleanup.title.toLowerCase().includes(searchInput) ||
                              cleanup.location.toLowerCase().includes(searchInput) ||
                              cleanup.crew.toLowerCase().includes(searchInput);

        let matchesDate = true;
        const today = new Date();
        const cleanupDate = new Date(cleanup.date);

        if (dateFilter === 'today') {
            matchesDate = cleanupDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'week') {
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            matchesDate = cleanupDate >= today && cleanupDate <= nextWeek;
        } else if (dateFilter === 'month') {
            matchesDate = cleanupDate.getMonth() === today.getMonth();
        }

        return matchesSearch && matchesDate;
    });

    renderCleanups(filtered);
}

// ============================================
// Impact Dashboard
// ============================================

function updateImpactDashboard() {
    document.getElementById('cleanupCount').textContent = appState.currentUser.cleanupsJoined;
    document.getElementById('impactKg').textContent = appState.currentUser.totalImpact;
    document.getElementById('crewCount').textContent = appState.currentUser.crewMembers;
}

// ============================================
// Utility: Notifications
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `${type} notification`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#2ECC71' : '#0077BE'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ============================================
// Highlight Cleanup Card
// ============================================

function highlightCleanupCard(cleanupId) {
    document.querySelectorAll('.cleanup-card').forEach(card => {
        card.style.borderLeft = '4px solid #ECF0F1';
    });
    const selectedCard = document.getElementById(`cleanup-${cleanupId}`);
    if (selectedCard) {
        selectedCard.style.borderLeft = '4px solid #FF6B6B';
    }
}

// ============================================
// Mobile Navigation Toggle
// ============================================

function setupMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            });
        });
    }
}

// ============================================
// Event Listeners & Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize map
    initMap();

    // Initialize impact dashboard
    updateImpactDashboard();

    // Render cleanups
    renderCleanups();

    // Setup mobile navigation
    setupMobileNav();

    // Setup search and filter listeners with debouncing
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterCleanups, 300));
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', filterCleanups);
    }

    // Explore button
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.querySelector('.map-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Load images lazily
    lazyLoadImages();

    // Detect user location (with permission)
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                appState.currentLocation = { lat: latitude, lng: longitude };
                // In production, reinitialize map with user location
                console.log('User location:', latitude, longitude);
            },
            (error) => {
                console.log('Geolocation permission denied or unavailable:', error);
            }
        );
    }

    // Register Service Worker for PWA capability (optional)
    if ('serviceWorker' in navigator) {
        // navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error:', err));
    }
});

// ============================================
// Performance Monitoring (Optional)
// ============================================

// Log Core Web Vitals if available
if ('PerformanceObserver' in window) {
    // Can be used with Web Vitals library for production
    console.log('Performance monitoring available');
}

/**
 * Export for testing and external use
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { appState, initMap, filterCleanups, joinCleanup, shareCleanup };
}
