// Global variables to store destination data
let destinationsData = [];
let manualCityData = {};
let indianCitiesData = {};

// Function to load popular destinations
function loadPopularDestinations() {
    console.log("Loading popular destinations...");
    
    // Get the destinations list container
    const destinationsList = document.getElementById('destinations-list');
    if (!destinationsList) {
        console.error("Destinations list container not found");
        return;
    }
    
    // Show loading message
    destinationsList.innerHTML = "<p>Loading destinations...</p>";
    
    // First, try to load the manual_indian_city_places.json file
    fetch('manual_indian_city_places.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Manual city data loaded successfully:", Object.keys(data).length, "cities");
            manualCityData = data;
            
            // Display the destinations
            displayDestinations();
        })
        .catch(error => {
            console.error("Error loading manual_indian_city_places.json:", error);
            
            // Try to load destinations_data.json as a fallback
            fetch('destinations_data.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Destinations data loaded successfully:", data.length, "destinations");
                    destinationsData = data;
                    
                    // Display the destinations
                    displayDestinations();
                })
                .catch(error => {
                    console.error("Error loading destinations_data.json:", error);
                    
                    // Show error message
                    destinationsList.innerHTML = `
                        <div class="error-message">
                            <p>Sorry, we couldn't load the destinations data. Please try again later.</p>
                            <p>Error: ${error.message}</p>
                        </div>
                    `;
                });
        });
}

// Function to display destinations
function displayDestinations() {
    console.log("Displaying destinations");
    
    // Get the destinations list container
    const destinationsList = document.getElementById('destinations-list');
    if (!destinationsList) {
        console.error("Destinations list container not found");
        return;
    }
    
    // Create a list of destinations to display
    let destinations = [];
    
    // Add destinations from manual_indian_city_places.json
    if (Object.keys(manualCityData).length > 0) {
        for (const cityName in manualCityData) {
            destinations.push({
                name: cityName,
                description: `Explore the beautiful city of ${cityName} and its famous attractions.`,
                image: manualCityData[cityName].image || 
                       (manualCityData[cityName].places && manualCityData[cityName].places.length > 0 ? 
                        manualCityData[cityName].places[0].image : null)
            });
        }
    }
    
    // Add destinations from destinations_data.json if we have any
    if (destinationsData.length > 0) {
        destinationsData.forEach(destination => {
            // Check if this destination is already in the list
            if (!destinations.some(dest => dest.name === destination.name)) {
                destinations.push(destination);
            }
        });
    }
    
    // If we have no destinations, show an error
    if (destinations.length === 0) {
        destinationsList.innerHTML = `
            <div class="error-message">
                <p>No destinations found. Please try again later.</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for destinations
    let html = '<h3>Popular Indian Destinations</h3><div class="destinations-grid">';
    
    // Display up to 8 destinations
    const displayDestinations = destinations.slice(0, 8);
    
    displayDestinations.forEach(destination => {
        // Get image for the destination
        let destinationImage = destination.image || 'https://via.placeholder.com/640x360?text=' + encodeURIComponent(destination.name);
        
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

// Function to search destinations
function searchDestinations(query) {
    console.log("Searching for destinations:", query);
    
    // Get the search results container
    const searchResults = document.getElementById('search-results');
    if (!searchResults) {
        console.error("Search results container not found");
        return;
    }
    
    // Show the search results container
    searchResults.style.display = 'block';
    searchResults.innerHTML = "<p>Searching...</p>";
    
    // Create a list of all destinations
    let allDestinations = [];
    
    // Add destinations from manual_indian_city_places.json
    if (Object.keys(manualCityData).length > 0) {
        for (const cityName in manualCityData) {
            allDestinations.push({
                name: cityName,
                description: `Explore the beautiful city of ${cityName} and its famous attractions.`,
                image: manualCityData[cityName].image || 
                       (manualCityData[cityName].places && manualCityData[cityName].places.length > 0 ? 
                        manualCityData[cityName].places[0].image : null)
            });
        }
    }
    
    // Add destinations from destinations_data.json
    if (destinationsData.length > 0) {
        destinationsData.forEach(destination => {
            // Check if this destination is already in the list
            if (!allDestinations.some(dest => dest.name === destination.name)) {
                allDestinations.push(destination);
            }
        });
    }
    
    // Filter destinations based on search query
    const filteredDestinations = allDestinations.filter(destination => 
        destination.name.toLowerCase().includes(query.toLowerCase()) ||
        (destination.description && destination.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    // If no results found
    if (filteredDestinations.length === 0) {
        searchResults.innerHTML = "<p>No destinations found matching your search.</p>";
        return;
    }
    
    // Create HTML for search results
    let html = '<h3>Search Results</h3><div class="search-results-grid">';
    
    filteredDestinations.forEach(destination => {
        // Get image for the destination
        let destinationImage = destination.image || 'https://via.placeholder.com/640x360?text=' + encodeURIComponent(destination.name);
        
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
}

// Function to reset search
function resetSearch() {
    console.log("Resetting search");
    
    // Get the search results container
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
    }
    
    // Get the search bar
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.value = '';
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Destinations.js loaded");
    
    // Load popular destinations
    loadPopularDestinations();
    
    // Set up search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    const resetBtn = document.getElementById('reset-search');
    
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
    
    // Add reset button if it doesn't exist
    if (!resetBtn) {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            const newResetBtn = document.createElement('button');
            newResetBtn.id = 'reset-search';
            newResetBtn.textContent = 'Reset';
            newResetBtn.addEventListener('click', resetSearch);
            searchContainer.appendChild(newResetBtn);
        }
    } else {
        resetBtn.addEventListener('click', resetSearch);
    }
});
