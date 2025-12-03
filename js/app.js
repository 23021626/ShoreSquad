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
// Weather Integration - NEA API
// ============================================

/**
 * Fetch real-time weather from NEA Singapore API
 * Returns 4-day forecast with hourly data
 */
async function fetchNEAWeather() {
    try {
        // NEA Real-time Weather Readings API
        const response = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            throw new Error('No weather data available');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching NEA weather:', error);
        showNotification(`⚠️ Weather API unavailable: ${error.message}`, 'error');
        return null;
    }
}

/**
 * Map weather condition text to emoji
 */
function getWeatherEmoji(condition) {
    const conditions = {
        'Fair': '☀️',
        'Sunny': '☀️',
        'Partly Cloudy': '🌤️',
        'Cloudy': '☁️',
        'Overcast': '☁️',
        'Light Rain': '🌦️',
        'Moderate Rain': '🌧️',
        'Heavy Rain': '⛈️',
        'Thundery Showers': '⛈️',
        'Showers': '🌧️'
    };
    
    for (const [key, emoji] of Object.entries(conditions)) {
        if (condition.toLowerCase().includes(key.toLowerCase())) {
            return emoji;
        }
    }
    return '🌤️'; // Default
}

/**
 * Format and display 4-day weather forecast
 */
function updateWeather(cleanup) {
    const weatherContainer = document.getElementById('weatherContainer');
    
    // Show loading state
    weatherContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <span>Loading weather data...</span>
        </div>
    `;

    // Fetch real weather from NEA
    fetchNEAWeather().then(data => {
        try {
            if (!data || !data.items || data.items.length === 0) {
                throw new Error('No forecast data received');
            }

            // Build 4-day forecast from available data points
            const forecasts = data.items.slice(0, 4); // Get up to 4 days
            let forecastHTML = '';

            forecasts.forEach((item, index) => {
                try {
                    const forecastTime = new Date(item.valid_period.start);
                    const dayName = forecastTime.toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' });
                    const timeRange = new Date(item.valid_period.start).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) + 
                                      ' - ' + 
                                      new Date(item.valid_period.end).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });

                    // Get forecast for general area (first zone)
                    const forecast = item.general ? item.general : {};
                    const condition = forecast.forecast || 'Fair';
                    const emoji = getWeatherEmoji(condition);

                    forecastHTML += `
                        <div class="weather-card">
                            <h4>${dayName}</h4>
                            <p class="weather-time">${timeRange}</p>
                            <div class="weather-emoji">${emoji}</div>
                            <p class="weather-condition">${condition}</p>
                            <small>🌍 General Forecast</small>
                        </div>
                    `;
                } catch (itemError) {
                    console.warn('Error processing forecast item:', itemError);
                }
            });

            // Add disclaimer about zones
            forecastHTML += `
                <div style="grid-column: 1 / -1; padding: 12px; background: #E8F4F8; border-radius: 8px; font-size: 0.9rem; color: #1A3A52;">
                    <strong>ℹ️ Note:</strong> Forecast data provided by National Environment Agency (NEA) Singapore. 
                    Data updated every 30 minutes. Select a cleanup to see detailed weather for that location.
                </div>
            `;

            weatherContainer.innerHTML = forecastHTML;
        } catch (error) {
            console.error('Error rendering weather:', error);
            weatherContainer.innerHTML = `
                <div class="error" style="grid-column: 1 / -1;">
                    <strong>❌ Error:</strong> Could not render weather forecast. ${error.message}
                </div>
            `;
        }
    }).catch(error => {
        console.error('Unexpected error in weather update:', error);
        weatherContainer.innerHTML = `
            <div class="error" style="grid-column: 1 / -1;">
                <strong>❌ Error:</strong> An unexpected error occurred while loading weather.
            </div>
        `;
    });
}

/**
 * Fetch detailed 4-day forecast for specific location
 */
async function fetchWeatherForecast() {
    try {
        const response = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching 4-day forecast:', error);
        return null;
    }
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
    try {
        const cleanup = appState.cleanups.find(c => c.id === cleanupId);
        if (!cleanup) {
            throw new Error('Cleanup not found');
        }
        
        cleanup.members += 1;
        appState.currentUser.cleanupsJoined += 1;
        appState.currentUser.totalImpact += cleanup.impact;
        updateImpactDashboard();
        renderCleanups();
        showNotification(`✓ You joined "${cleanup.title}"!`, 'success');
    } catch (error) {
        console.error('Error joining cleanup:', error);
        showNotification(`❌ Error: Could not join cleanup. ${error.message}`, 'error');
    }
}

function shareCleanup(cleanupId) {
    try {
        const cleanup = appState.cleanups.find(c => c.id === cleanupId);
        if (!cleanup) {
            throw new Error('Cleanup not found');
        }
        
        const text = `Join me at ${cleanup.title} on ${cleanup.date}! Help clean our beaches. #ShoreSquad`;
        
        if (navigator.share) {
            navigator.share({
                title: 'ShoreSquad',
                text: text,
                url: window.location.href
            }).catch(err => {
                if (err.name !== 'AbortError') {
                    console.warn('Share error:', err);
                    fallbackCopyShare(text);
                }
            });
        } else {
            // Fallback: Copy to clipboard
            fallbackCopyShare(text);
        }
    } catch (error) {
        console.error('Error sharing cleanup:', error);
        showNotification(`❌ Error: Could not share cleanup. ${error.message}`, 'error');
    }
}

function fallbackCopyShare(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✓ Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Clipboard error:', err);
        showNotification('⚠️ Could not copy to clipboard', 'error');
    });
}

// ============================================
// Search & Filter
// ============================================

function filterCleanups() {
    try {
        const searchInput = document.getElementById('searchInput');
        const dateFilter = document.getElementById('dateFilter');
        
        if (!searchInput || !dateFilter) {
            throw new Error('Filter elements not found');
        }

        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = dateFilter.value;

        const filtered = appState.cleanups.filter(cleanup => {
            try {
                const matchesSearch = cleanup.title.toLowerCase().includes(searchTerm) ||
                                      cleanup.location.toLowerCase().includes(searchTerm) ||
                                      cleanup.crew.toLowerCase().includes(searchTerm);

                let matchesDate = true;
                const today = new Date();
                const cleanupDate = new Date(cleanup.date);

                if (filterValue === 'today') {
                    matchesDate = cleanupDate.toDateString() === today.toDateString();
                } else if (filterValue === 'week') {
                    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    matchesDate = cleanupDate >= today && cleanupDate <= nextWeek;
                } else if (filterValue === 'month') {
                    matchesDate = cleanupDate.getMonth() === today.getMonth();
                }

                return matchesSearch && matchesDate;
            } catch (itemError) {
                console.warn('Error filtering item:', itemError);
                return false;
            }
        });

        renderCleanups(filtered);
    } catch (error) {
        console.error('Error filtering cleanups:', error);
        showNotification(`⚠️ Filter error: ${error.message}`, 'error');
    }
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
// Utility: Notifications with Styling
// ============================================

function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `${type} notification`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.textContent = message;
        
        const bgColor = type === 'success' ? '#2ECC71' : 
                        type === 'error' ? '#FF6B6B' : 
                        '#0077BE';
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 14px 20px;
            background: ${bgColor};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 600;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to console
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
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
    try {
        // Initialize map
        initMap();

        // Initialize impact dashboard
        updateImpactDashboard();

        // Render cleanups
        renderCleanups();

        // Setup mobile navigation
        setupMobileNav();

        // Load and display initial weather on page load
        updateWeather(null);

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
                try {
                    document.querySelector('.map-section').scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    console.warn('Error scrolling to map:', error);
                }
            });
        }

        // Load images lazily
        lazyLoadImages();

        // Detect user location (with permission)
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        appState.currentLocation = { lat: latitude, lng: longitude };
                        console.log('User location:', latitude, longitude);
                    } catch (error) {
                        console.warn('Error processing geolocation:', error);
                    }
                },
                (error) => {
                    console.log('Geolocation unavailable:', error.message);
                }
            );
        }

        // Register Service Worker for PWA capability (optional)
        if ('serviceWorker' in navigator) {
            // navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error:', err));
        }

        console.log('ShoreSquad initialized successfully');
    } catch (error) {
        console.error('Critical error initializing ShoreSquad:', error);
        showNotification('❌ Failed to initialize application. Please refresh the page.', 'error');
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
