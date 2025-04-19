// Destination details functionality
let destinationsData = [];
let manualCityData = {};
let indianCitiesData = {};

// Function to load all data
function loadAllData() {
    console.log("Loading all destination data for details page...");
    
    // Show loading indicator
    const detailsContainer = document.getElementById('destination-details-container');
    if (detailsContainer) {
        detailsContainer.innerHTML = "<div class='loading-spinner'><div class='spinner'></div><p>Loading destination details...</p></div>";
    }
    
    // Load all three data sources
    Promise.all([
        fetch('destinations_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }),
        fetch('manual_indian_city_places.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }),
        fetch('indian_cities.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
    ])
    .then(([destinationsJson, manualCitiesJson, indianCitiesJson]) => {
        console.log("All data loaded successfully for details page!");
        
        // Store the data in global variables
        destinationsData = destinationsJson || [];
        manualCityData = manualCitiesJson || {};
        indianCitiesData = indianCitiesJson || { cities: [] };
        
        console.log("Destinations data:", destinationsData.length, "destinations");
        console.log("Manual city data:", Object.keys(manualCityData).length, "cities");
        console.log("Indian cities data:", indianCitiesData.cities ? indianCitiesData.cities.length : 0, "cities");
        
        // Get destination name from URL
        const urlParams = new URLSearchParams(window.location.search);
        const destinationName = urlParams.get('name');
        
        if (destinationName) {
            displayDestinationDetails(destinationName);
        } else {
            // No destination specified
            if (detailsContainer) {
                detailsContainer.innerHTML = `
                    <div class="error-message">
                        <p>No destination specified. Please go back and select a destination.</p>
                        <a href="ui.html" class="back-btn">Back to Home</a>
                    </div>
                `;
            }
        }
    })
    .catch(error => {
        console.error("Error loading destination data for details page:", error);
        
        // Show error message
        const detailsContainer = document.getElementById('destination-details-container');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we couldn't load the destination details. Please try again later.</p>
                    <p>Error: ${error.message}</p>
                    <a href="ui.html" class="back-btn">Back to Home</a>
                </div>
            `;
        }
    });
}

// Function to display destination details
function displayDestinationDetails(destinationName) {
    console.log("Displaying details for destination:", destinationName);
    const detailsContainer = document.getElementById('destination-details-container');
    if (!detailsContainer) {
        console.error("Details container not found");
        return;
    }
    
    // Find destination in all data sources
    let destinationDetails = null;
    let destinationPlaces = [];
    
    // 1. Check in destinations_data.json
    const destinationFromData = destinationsData.find(dest => 
        dest.name.toLowerCase() === destinationName.toLowerCase()
    );
    
    // 2. Check in manual_indian_city_places.json
    const manualCityDetails = manualCityData[destinationName] || 
                             Object.entries(manualCityData).find(([key]) => 
                                 key.toLowerCase() === destinationName.toLowerCase()
                             )?.[1];
    
    // 3. Check in indian_cities.json
    const indianCityDetails = indianCitiesData.cities ? 
                             indianCitiesData.cities.find(city => 
                                 city.name.toLowerCase() === destinationName.toLowerCase()
                             ) : null;
    
    // Combine data from all sources
    if (destinationFromData) {
        destinationDetails = destinationFromData;
        if (destinationFromData.places_to_visit) {
            destinationPlaces = destinationFromData.places_to_visit.map(place => ({
                name: place.name,
                description: place.description,
                image: place.image
            }));
        }
    }
    
    if (manualCityDetails) {
        if (!destinationDetails) {
            destinationDetails = {
                name: destinationName,
                description: `Explore the beautiful city of ${destinationName} and its famous attractions.`,
                image: manualCityDetails.image
            };
        }
        
        if (manualCityDetails.places) {
            // Add places from manual city data
            manualCityDetails.places.forEach(place => {
                // Check if this place is already in the list
                if (!destinationPlaces.some(p => p.name === place.name)) {
                    destinationPlaces.push({
                        name: place.name,
                        description: place.description,
                        image: place.image
                    });
                }
            });
        }
    }
    
    if (indianCityDetails && !destinationDetails) {
        destinationDetails = {
            name: indianCityDetails.name,
            description: indianCityDetails.description || `Explore the beautiful city of ${indianCityDetails.name}.`,
            famous_for: indianCityDetails.famous_for
        };
    }
    
    // If no destination found
    if (!destinationDetails) {
        detailsContainer.innerHTML = `
            <div class="error-message">
                <p>Destination "${destinationName}" not found. Please try another destination.</p>
                <a href="ui.html" class="back-btn">Back to Home</a>
            </div>
        `;
        return;
    }
    
    // Get image for the destination
    let destinationImage;
    
    if (destinationDetails.image) {
        destinationImage = destinationDetails.image;
    } else if (destinationPlaces.length > 0 && destinationPlaces[0].image) {
        destinationImage = destinationPlaces[0].image;
    } else {
        destinationImage = 'https://via.placeholder.com/1200x600?text=' + encodeURIComponent(destinationName);
    }
    
    // Create HTML for destination details
    let html = `
        <div class="destination-header">
            <div class="destination-banner" style="background-image: url('${destinationImage}');">
                <div class="destination-title">
                    <h1>${destinationDetails.name}</h1>
                </div>
            </div>
        </div>
        
        <div class="destination-content">
            <div class="destination-description">
                <h2>About ${destinationDetails.name}</h2>
                <p>${destinationDetails.description || ''}</p>
                ${destinationDetails.famous_for ? `<p><strong>Famous for:</strong> ${destinationDetails.famous_for}</p>` : ''}
            </div>
            
            <div class="destination-map">
                <h2>Location</h2>
                <div class="map-container">
                    <iframe 
                        width="100%" 
                        height="300" 
                        frameborder="0" 
                        style="border:0" 
                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(destinationDetails.name)}" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
    `;
    
    // Add places to visit
    if (destinationPlaces.length > 0) {
        html += `
            <div class="places-to-visit">
                <h2>Famous Places to Visit</h2>
                <div class="places-grid">
        `;
        
        destinationPlaces.forEach(place => {
            html += `
                <div class="place-card">
                    <div class="place-image">
                        <img src="${place.image || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(place.name)}" alt="${place.name}">
                    </div>
                    <div class="place-info">
                        <h3>${place.name}</h3>
                        <p>${place.description || ''}</p>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + destinationDetails.name)}" target="_blank" class="map-link">
                            <i class="fas fa-map-marker-alt"></i> View on Map
                        </a>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Add back button
    html += `
            <div class="back-container">
                <a href="ui.html" class="back-btn">Back to Home</a>
            </div>
        </div>
    `;
    
    detailsContainer.innerHTML = html;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Destination_details.js loaded");
    
    // Load all data
    loadAllData();
    
    // Add Font Awesome for icons
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(fontAwesome);
});

// Add spinner and styles CSS
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #4285F4;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-spinner {
            text-align: center;
            padding: 50px;
            color: #666;
        }
        
        .error-message {
            background-color: #ffebee;
            border-left: 4px solid #f44336;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            color: #d32f2f;
        }
        
        .destination-header {
            margin-bottom: 30px;
        }
        
        .destination-banner {
            height: 400px;
            background-size: cover;
            background-position: center;
            position: relative;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .destination-title {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 20px;
            color: white;
        }
        
        .destination-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .destination-description, .destination-map, .places-to-visit {
            margin-bottom: 40px;
        }
        
        .places-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .place-card {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .place-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        
        .place-image img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        
        .place-info {
            padding: 15px;
        }
        
        .map-link {
            display: inline-block;
            margin-top: 10px;
            color: #4285F4;
            text-decoration: none;
            font-weight: bold;
        }
        
        .map-link:hover {
            text-decoration: underline;
        }
        
        .back-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .back-btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4285F4;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        
        .back-btn:hover {
            background-color: #3367d6;
        }
    `;
    document.head.appendChild(style);
});
