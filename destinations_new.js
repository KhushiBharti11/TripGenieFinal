// Destinations functionality
let destinationsData = [];
let manualCityData = {};
let indianCitiesData = {};

// Function to load all data
function loadAllData() {
    console.log("Loading all destination data...");
    
    // Show loading indicator
    const destinationsList = document.getElementById('destinations-list');
    if (destinationsList) {
        destinationsList.innerHTML = "<div class='loading-spinner'><div class='spinner'></div><p>Loading destinations...</p></div>";
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
        console.log("All data loaded successfully!");
        
        // Store the data in global variables
        destinationsData = destinationsJson || [];
        manualCityData = manualCitiesJson || {};
        indianCitiesData = indianCitiesJson || { cities: [] };
        
        console.log("Destinations data:", destinationsData.length, "destinations");
        console.log("Manual city data:", Object.keys(manualCityData).length, "cities");
        console.log("Indian cities data:", indianCitiesData.cities ? indianCitiesData.cities.length : 0, "cities");
        
        // Display popular destinations
        displayPopularDestinations();
        
        // Set up search functionality
        setupSearchFunctionality();
    })
    .catch(error => {
        console.error("Error loading destination data:", error);
        
        // Show error message
        if (destinationsList) {
            destinationsList.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we couldn't load the destinations data. Please try again later.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    });
}

// Function to display popular destinations
function displayPopularDestinations() {
    console.log("Displaying popular destinations");
    const destinationsList = document.getElementById('destinations-list');
    if (!destinationsList) {
        console.error("Destinations list container not found");
        return;
    }
    
    // Create a combined list of destinations
    let allDestinations = [];
    
    // Add destinations from destinations_data.json
    if (destinationsData && destinationsData.length > 0) {
        allDestinations = [...destinationsData];
    }
    
    // Add destinations from manual_indian_city_places.json
    if (manualCityData && Object.keys(manualCityData).length > 0) {
        for (const cityName in manualCityData) {
            // Check if this city is already in the list
            if (!allDestinations.some(dest => dest.name === cityName)) {
                allDestinations.push({
                    name: cityName,
                    description: `Explore the beautiful city of ${cityName} and its famous attractions.`,
                    image: manualCityData[cityName].image || 
                           (manualCityData[cityName].places && manualCityData[cityName].places.length > 0 ? 
                            manualCityData[cityName].places[0].image : null)
                });
            }
        }
    }
    
    // If we have no destinations, show an error
    if (allDestinations.length === 0) {
        destinationsList.innerHTML = `
            <div class="error-message">
                <p>No destinations found. Please try again later.</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for popular destinations
    let html = '<h3>Popular Indian Destinations</h3><div class="destinations-grid">';
    
    // Display up to 8 destinations
    const displayDestinations = allDestinations.slice(0, 8);
    
    displayDestinations.forEach(destination => {
        // Get image for the destination
        let destinationImage;
        
        if (destination.image) {
            destinationImage = destination.image;
        } else if (destination.places && destination.places.length > 0 && destination.places[0].image) {
            destinationImage = destination.places[0].image;
        } else if (destination.places_to_visit && destination.places_to_visit.length > 0 && destination.places_to_visit[0].image) {
            destinationImage = destination.places_to_visit[0].image;
        } else {
            destinationImage = 'https://via.placeholder.com/640x360?text=' + encodeURIComponent(destination.name);
        }
        
        html += `
            <div class="destination-card">
                <div class="destination-image">
                    <img src="${destinationImage}" alt="${destination.name}">
                </div>
                <div class="destination-info">
                    <h3>${destination.name}</h3>
                    <p>${destination.description || ''}</p>
                    <a href="destination_details.html?name=${encodeURIComponent(destination.name)}" class="view-details-btn">View Details</a>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    destinationsList.innerHTML = html;
}

// Function to set up search functionality
function setupSearchFunctionality() {
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchBar.value.trim();
            if (query) {
                searchDestinations(query);
            } else {
                alert('Please enter a search term');
            }
        });
    }
    
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchBar.value.trim();
                if (query) {
                    searchDestinations(query);
                } else {
                    alert('Please enter a search term');
                }
            }
        });
    }
}

// Function to search destinations
function searchDestinations(query) {
    console.log("Searching for destinations:", query);
    const searchResults = document.getElementById('search-results');
    const destinationsList = document.getElementById('destinations-list');
    
    if (!searchResults) {
        console.error("Search results container not found");
        return;
    }
    
    // Show loading indicator
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<div class="searching-message"><div class="spinner"></div><p>Searching...</p></div>';
    
    // Hide the popular destinations
    if (destinationsList) {
        destinationsList.style.display = 'none';
    }
    
    // Search in all data sources
    try {
        // 1. Search in destinations_data.json
        const filteredDestinations = destinationsData.filter(destination =>
            destination.name.toLowerCase().includes(query.toLowerCase()) ||
            (destination.description && destination.description.toLowerCase().includes(query.toLowerCase()))
        );
        
        // 2. Search in manual_indian_city_places.json
        const manualCities = [];
        for (const cityName in manualCityData) {
            if (cityName.toLowerCase().includes(query.toLowerCase())) {
                manualCities.push({
                    name: cityName,
                    description: `Explore the beautiful city of ${cityName} and its famous attractions.`,
                    image: manualCityData[cityName].image || 
                           (manualCityData[cityName].places && manualCityData[cityName].places.length > 0 ? 
                            manualCityData[cityName].places[0].image : null)
                });
            }
        }
        
        // 3. Search in indian_cities.json
        const indianCities = [];
        if (indianCitiesData && indianCitiesData.cities) {
            indianCitiesData.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query.toLowerCase()) ||
                    (city.description && city.description.toLowerCase().includes(query.toLowerCase())) ||
                    (city.famous_for && city.famous_for.toLowerCase().includes(query.toLowerCase()))) {
                    indianCities.push({
                        name: city.name,
                        description: city.description || `Explore the beautiful city of ${city.name}.`,
                        famous_for: city.famous_for,
                        image: null // Indian cities don't have images in the JSON
                    });
                }
            });
        }
        
        console.log("Search results:", {
            destinations: filteredDestinations.length,
            manualCities: manualCities.length,
            indianCities: indianCities.length
        });
        
        // Combine all results, avoiding duplicates
        const allResults = [...filteredDestinations];
        
        // Add manual cities
        manualCities.forEach(city => {
            if (!allResults.some(dest => dest.name === city.name)) {
                allResults.push(city);
            }
        });
        
        // Add Indian cities
        indianCities.forEach(city => {
            if (!allResults.some(dest => dest.name === city.name)) {
                allResults.push(city);
            }
        });
        
        // Display search results
        if (allResults.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No destinations found matching your search.</p>';
            return;
        }
        
        let html = '<h3>Search Results</h3><div class="search-results-grid">';
        
        allResults.forEach(destination => {
            // Get image for the destination
            let destinationImage;
            
            if (destination.image) {
                destinationImage = destination.image;
            } else if (destination.places && destination.places.length > 0 && destination.places[0].image) {
                destinationImage = destination.places[0].image;
            } else if (destination.places_to_visit && destination.places_to_visit.length > 0 && destination.places_to_visit[0].image) {
                destinationImage = destination.places_to_visit[0].image;
            } else {
                // Try to find an image from manualCityData
                if (manualCityData[destination.name] && manualCityData[destination.name].image) {
                    destinationImage = manualCityData[destination.name].image;
                } else if (manualCityData[destination.name] && manualCityData[destination.name].places && 
                           manualCityData[destination.name].places.length > 0 && 
                           manualCityData[destination.name].places[0].image) {
                    destinationImage = manualCityData[destination.name].places[0].image;
                } else {
                    // Use placeholder as last resort
                    destinationImage = 'https://via.placeholder.com/640x360?text=' + encodeURIComponent(destination.name);
                }
            }
            
            html += `
                <div class="destination-card">
                    <div class="destination-image">
                        <img src="${destinationImage}" alt="${destination.name}">
                    </div>
                    <div class="destination-info">
                        <h3>${destination.name}</h3>
                        <p>${destination.description || ''}</p>
                        <a href="destination_details.html?name=${encodeURIComponent(destination.name)}" class="view-details-btn">View Details</a>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        searchResults.innerHTML = html;
        
    } catch (error) {
        console.error("Error in searchDestinations:", error);
        searchResults.innerHTML = `
            <div class="error-message">
                <p>An error occurred while searching. Please try again.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Function to reset search and show popular destinations
function resetSearch() {
    const searchResults = document.getElementById('search-results');
    const destinationsList = document.getElementById('destinations-list');
    const searchBar = document.getElementById('search-bar');
    
    if (searchResults) {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
    }
    
    if (destinationsList) {
        destinationsList.style.display = 'block';
    }
    
    if (searchBar) {
        searchBar.value = '';
    }
}

// Function to view destination details
function viewDestinationDetails(destinationName) {
    window.location.href = `destination_details.html?name=${encodeURIComponent(destinationName)}`;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Destinations.js loaded");
    
    // Check if we're on the destinations tab
    const destinationsTab = document.getElementById('destinations');
    if (destinationsTab) {
        // Load all data
        loadAllData();
        
        // Add reset button to search container
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            const resetButton = document.createElement('button');
            resetButton.id = 'reset-search';
            resetButton.textContent = 'Reset';
            resetButton.addEventListener('click', resetSearch);
            resetButton.style.display = 'none'; // Hide initially
            searchContainer.appendChild(resetButton);
            
            // Show reset button when search is performed
            const searchBar = document.getElementById('search-bar');
            if (searchBar) {
                searchBar.addEventListener('input', function() {
                    resetButton.style.display = this.value.trim() ? 'block' : 'none';
                });
            }
        }
    }
});

// Add spinner CSS
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
        
        .loading-spinner, .searching-message {
            text-align: center;
            padding: 30px;
            color: #666;
        }
        
        .error-message {
            background-color: #ffebee;
            border-left: 4px solid #f44336;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #d32f2f;
        }
        
        #reset-search {
            padding: 15px 25px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s ease, transform 0.2s ease;
            margin-left: 10px;
        }
        
        #reset-search:hover {
            background-color: #d32f2f;
        }
    `;
    document.head.appendChild(style);
});
