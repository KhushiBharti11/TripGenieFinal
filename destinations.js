// Destinations functionality
let destinationsData = [];
let manualCityData = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log("Destinations.js loaded");

    // Load destinations data from JSON files
    Promise.all([
        fetch('destinations_data.json').then(response => response.json()).catch(error => {
            console.error("Error loading destinations_data.json:", error);
            return [];
        }),
        fetch('manual_indian_city_places.json').then(response => response.json()).catch(error => {
            console.error("Error loading manual_indian_city_places.json:", error);
            return {};
        })
    ])
    .then(([destinationsJson, manualCitiesJson]) => {
        destinationsData = destinationsJson;
        manualCityData = manualCitiesJson;
        console.log("Destinations data loaded:", destinationsData.length, "destinations");
        console.log("Manual city data loaded:", Object.keys(manualCityData).length, "cities");

        // Initialize the destinations tab
        initializeDestinationsTab();

        // Explicitly load popular destinations
        loadPopularDestinations();
    })
    .catch(error => {
        console.error("Error in Promise.all for destinations data:", error);
    });

    // Initialize search functionality will be handled by initializeDestinationsTab function
});  // End of DOMContentLoaded event listener

// Function to initialize the destinations tab
function initializeDestinationsTab() {
    console.log("Initializing destinations tab");

    // Initialize search functionality for destinations
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        console.log("Search button found, adding event listener");
        searchBtn.addEventListener('click', function() {
            const searchQuery = document.getElementById('search-bar').value.trim();
            if (searchQuery) {
                searchDestinations(searchQuery);
            } else {
                alert('Please enter a search term');
            }
        });
    } else {
        console.error("Search button not found");
    }

    // Add event listener for Enter key in search bar
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        console.log("Search bar found, adding event listener");
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchQuery = searchBar.value.trim();
                if (searchQuery) {
                    searchDestinations(searchQuery);
                } else {
                    alert('Please enter a search term');
                }
            }
        });
    } else {
        console.error("Search bar not found");
    }

    // Also load popular destinations
    loadPopularDestinations();
}

// Function to load popular destinations
function loadPopularDestinations() {
    console.log("Loading popular destinations");
    const destinationsList = document.getElementById('destinations-list');
    if (!destinationsList) {
        console.error("Destinations list container not found");
        return;
    }

    destinationsList.innerHTML = "<p>Loading popular destinations...</p>";

    // Create a grid of popular destinations from both data sources
    let html = '<h3>Popular Indian Destinations</h3><div class="destinations-grid">';

    // Add cities from manual_indian_city_places.json
    const manualCitiesArray = Object.keys(manualCityData).map(cityName => {
        return {
            name: cityName,
            description: `Explore the beautiful city of ${cityName} and its famous attractions.`,
            image: manualCityData[cityName].image || (manualCityData[cityName].places && manualCityData[cityName].places.length > 0 ? manualCityData[cityName].places[0].image : null)
        };
    });

    // Add cities from destinations_data.json
    const popularDestinations = [...destinationsData];

    // Combine both sources, avoiding duplicates
    manualCitiesArray.forEach(manualCity => {
        if (!popularDestinations.some(dest => dest.name === manualCity.name)) {
            popularDestinations.push(manualCity);
        }
    });

    // Display up to 8 popular destinations
    const displayDestinations = popularDestinations.slice(0, 8);

    displayDestinations.forEach(destination => {
        // Get image for the destination
        let destinationImage;

        if (destination.image) {
            destinationImage = destination.image;
        } else if (destination.places && destination.places.length > 0) {
            destinationImage = destination.places[0].image;
        } else if (destination.places_to_visit && destination.places_to_visit.length > 0) {
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

// Function to search destinations
function searchDestinations(query) {
    console.log("Searching for destinations:", query);
    const searchResults = document.getElementById('search-results');
    if (!searchResults) {
        console.error("Search results container not found");
        return;
    }

    // Show the search results container
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<p class="searching-message">Searching...</p>';

    try {
        // Also check indian_cities.json for more comprehensive search
        fetch('indian_cities.json')
            .then(response => response.json())
            .then(data => {
                // Find cities in indian_cities.json
                const indianCities = data.cities.filter(city =>
                    city.name.toLowerCase().includes(query.toLowerCase()) ||
                    city.description.toLowerCase().includes(query.toLowerCase()) ||
                    city.famous_for.toLowerCase().includes(query.toLowerCase())
                ).map(city => ({
                    name: city.name,
                    description: city.description,
                    famous_for: city.famous_for,
                    // Use placeholder image for now
                    image: null
                }));

                console.log("Found cities in indian_cities.json:", indianCities.length);

                // Filter destinations based on search query
                const filteredDestinations = destinationsData.filter(destination =>
                    destination.name.toLowerCase().includes(query.toLowerCase()) ||
                    (destination.description && destination.description.toLowerCase().includes(query.toLowerCase()))
                );

                console.log("Filtered destinations from destinations_data.json:", filteredDestinations.length);

                // Also check manual city data
                const manualCities = [];
                for (const cityName in manualCityData) {
                    if (cityName.toLowerCase().includes(query.toLowerCase())) {
                        manualCities.push({
                            name: cityName,
                            description: `Explore the beautiful city of ${cityName} and its famous attractions.`,
                            image: manualCityData[cityName].image || null,
                            places: manualCityData[cityName].places || []
                        });
                    }
                }

                console.log("Found cities in manual_indian_city_places.json:", manualCities.length);

                // Combine results from all sources, avoiding duplicates
                const allResults = [...filteredDestinations];

                // Add manual cities
                manualCities.forEach(manualCity => {
                    if (!allResults.some(dest => dest.name === manualCity.name)) {
                        allResults.push(manualCity);
                    }
                });

                // Add indian cities
                indianCities.forEach(indianCity => {
                    if (!allResults.some(dest => dest.name === indianCity.name)) {
                        allResults.push(indianCity);
                    }
                });

                console.log("Total combined results:", allResults.length);

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
                        // Use image from manual data if available
                        destinationImage = destination.image;
                    } else if (destination.places && destination.places.length > 0) {
                        // Use first place image from manual data
                        destinationImage = destination.places[0].image;
                    } else if (destination.places_to_visit && destination.places_to_visit.length > 0) {
                        // Use image from destinations_data
                        destinationImage = destination.places_to_visit[0].image;
                    } else {
                        // Fallback to placeholder
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

                searchResults.innerHTML = html;

                // Hide the popular destinations when showing search results
                const destinationsList = document.getElementById('destinations-list');
                if (destinationsList) {
                    destinationsList.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Error fetching indian_cities.json:", error);
                // Fallback to just using destinations_data.json and manual_indian_city_places.json
                searchWithoutIndianCities(query, searchResults);
            });
    } catch (error) {
        console.error("Error in searchDestinations function:", error);
        searchResults.innerHTML = '<p class="error-message">An error occurred while searching. Please try again.</p>';
    }
}

// Fallback search function if indian_cities.json fails to load
function searchWithoutIndianCities(query, searchResults) {
    try {
        // Filter destinations based on search query
        const filteredDestinations = destinationsData.filter(destination =>
            destination.name.toLowerCase().includes(query.toLowerCase()) ||
            (destination.description && destination.description.toLowerCase().includes(query.toLowerCase()))
        );

        // Also check manual city data
        const manualCities = [];
        for (const cityName in manualCityData) {
            if (cityName.toLowerCase().includes(query.toLowerCase())) {
                manualCities.push({
                    name: cityName,
                    description: `Explore the beautiful city of ${cityName} and its famous attractions.`,
                    image: manualCityData[cityName].image || null,
                    places: manualCityData[cityName].places || []
                });
            }
        }

        // Combine results, avoiding duplicates
        const allResults = [...filteredDestinations];
        manualCities.forEach(manualCity => {
            if (!allResults.some(dest => dest.name === manualCity.name)) {
                allResults.push(manualCity);
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
            } else if (destination.places && destination.places.length > 0) {
                destinationImage = destination.places[0].image;
            } else if (destination.places_to_visit && destination.places_to_visit.length > 0) {
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

        searchResults.innerHTML = html;

        // Hide the popular destinations when showing search results
        const destinationsList = document.getElementById('destinations-list');
        if (destinationsList) {
            destinationsList.style.display = 'none';
        }
    } catch (error) {
        console.error("Error in searchWithoutIndianCities function:", error);
        searchResults.innerHTML = '<p class="error-message">An error occurred while searching. Please try again.</p>';
    }
}

// Function to view destination details
function viewDestinationDetails(destinationName) {
    console.log("Viewing destination details for:", destinationName);

    // Redirect to the destination details page
    window.location.href = `destination_details.html?name=${encodeURIComponent(destinationName)}`;
}

// Function to generate an itinerary for the selected destination
function generateItineraryForDestination(destination) {
    // Switch to the trip planning tab
    const tripPlanningTab = document.querySelector('[data-tab="trip-planning"]');
    if (tripPlanningTab) {
        tripPlanningTab.click();

        // Set the destination in the form
        const destinationInput = document.getElementById('destination');
        if (destinationInput) {
            destinationInput.value = destination;
        }

        // Scroll to the form
        const itineraryForm = document.querySelector('.itinerary-form');
        if (itineraryForm) {
            itineraryForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
