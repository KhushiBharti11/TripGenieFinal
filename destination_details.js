document.addEventListener('DOMContentLoaded', function() {
    // Get the destination name from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const destinationName = urlParams.get('name');

    if (destinationName) {
        // Set the page title
        document.title = `${destinationName} - Trip Genie`;

        // Set the destination title in the header
        document.getElementById('destination-title').textContent = destinationName;

        // Load city information
        loadCityInformation(destinationName);
    } else {
        // If no destination name is provided, show an error
        document.body.innerHTML = '<div class="error">No destination specified. <a href="ui.html">Go back to home</a></div>';
    }
});

// Function to load city information from the JSON files
function loadCityInformation(cityName) {
    // First try to load from manual_indian_city_places.json
    fetch('manual_indian_city_places.json')
        .then(response => response.json())
        .then(manualData => {
            // Check if the city exists in manual data
            if (manualData[cityName]) {
                // Also fetch indian_cities.json for additional information
                fetch('indian_cities.json')
                    .then(response => response.json())
                    .then(data => {
                        // Find the city in the data
                        const city = data.cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());

                        // Display city information with both data sources
                        displayCityInformation(city, manualData[cityName], cityName);
                    })
                    .catch(error => {
                        console.error('Error loading indian_cities.json:', error);
                        // Still display manual data even if indian_cities.json fails
                        displayCityInformation(null, manualData[cityName], cityName);
                    });
            } else {
                // If not in manual data, try indian_cities.json only
                fetch('indian_cities.json')
                    .then(response => response.json())
                    .then(data => {
                        // Find the city in the data
                        const city = data.cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());

                        if (city) {
                            // Display city information
                            displayCityInformation(city, null, cityName);
                        } else {
                            // If city not found in either database, show a message
                            document.body.innerHTML = `<div class="error">Information for ${cityName} not found. <a href="ui.html">Go back to home</a></div>`;
                        }
                    })
                    .catch(error => {
                        console.error('Error loading indian_cities.json:', error);
                        document.body.innerHTML = '<div class="error">Error loading city information. <a href="ui.html">Go back to home</a></div>';
                    });
            }
        })
        .catch(error => {
            console.error('Error loading manual_indian_city_places.json:', error);

            // Fallback to indian_cities.json if manual data fails
            fetch('indian_cities.json')
                .then(response => response.json())
                .then(data => {
                    // Find the city in the data
                    const city = data.cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());

                    if (city) {
                        // Display city information
                        displayCityInformation(city, null, cityName);
                    } else {
                        // If city not found in our database, show a message
                        document.body.innerHTML = `<div class="error">Information for ${cityName} not found. <a href="ui.html">Go back to home</a></div>`;
                    }
                })
                .catch(error => {
                    console.error('Error loading indian_cities.json:', error);
                    document.body.innerHTML = '<div class="error">Error loading city information. <a href="ui.html">Go back to home</a></div>';
                });
        });
}

// Function to display city information
function displayCityInformation(city, manualData, cityName) {
    const mainContent = document.querySelector('main');

    // Add city description if available from indian_cities.json
    if (city) {
        const descriptionSection = document.createElement('section');
        descriptionSection.id = 'description';
        descriptionSection.innerHTML = `
            <h2>About ${city.name}</h2>
            <p>${city.description}</p>
            <p><strong>Famous for:</strong> ${city.famous_for}</p>
            <p><strong>Best time to visit:</strong> ${city.best_time_to_visit}</p>
        `;
        mainContent.insertBefore(descriptionSection, mainContent.firstChild);

        // Display attractions from indian_cities.json
        const placesList = document.getElementById('places-list');
        placesList.innerHTML = ''; // Clear previous
        city.attractions.forEach(attraction => {
            const li = document.createElement('li');
            li.textContent = attraction;
            placesList.appendChild(li);
        });

        // Display cuisine information
        document.getElementById('cuisine-list').textContent = city.cuisine;
    } else {
        // If no city data from indian_cities.json, create a basic description
        const descriptionSection = document.createElement('section');
        descriptionSection.id = 'description';
        descriptionSection.innerHTML = `
            <h2>About ${cityName}</h2>
            <p>Explore the beautiful city of ${cityName} and its famous attractions.</p>
        `;
        mainContent.insertBefore(descriptionSection, mainContent.firstChild);

        // Set default cuisine information
        document.getElementById('cuisine-list').textContent = 'Information about local cuisine not available.';
    }

    // Display places from manual_indian_city_places.json if available
    if (manualData && manualData.places) {
        const placesGrid = document.getElementById('places-grid');
        placesGrid.innerHTML = ''; // Clear previous

        // Add header image if available
        if (manualData.image) {
            const headerSection = document.querySelector('#description');
            headerSection.insertAdjacentHTML('afterbegin', `
                <div class="destination-header">
                    <div class="destination-header-image">
                        <img src="${manualData.image}" alt="${cityName}">
                    </div>
                    <div class="destination-header-info">
                        <h2>${cityName}</h2>
                        <p>${city ? city.description : `Explore the beautiful city of ${cityName}.`}</p>
                    </div>
                </div>
            `);
        }

        // Add each place to the grid
        manualData.places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.innerHTML = `
                <div class="place-image">
                    <img src="${place.image}" alt="${place.name}">
                </div>
                <div class="place-info">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}+${encodeURIComponent(cityName)}" target="_blank" class="map-link">
                        <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Map Pin">
                        View on Map
                    </a>
                </div>
            `;
            placesGrid.appendChild(placeCard);

            // Also add to the places list if not already there
            if (city) {
                const placesList = document.getElementById('places-list');
                if (!Array.from(placesList.children).some(li => li.textContent === place.name)) {
                    const li = document.createElement('li');
                    li.textContent = place.name;
                    placesList.appendChild(li);
                }
            } else {
                // If no city data, create places list from manual data
                const placesList = document.getElementById('places-list');
                const li = document.createElement('li');
                li.textContent = place.name;
                placesList.appendChild(li);
            }
        });
    } else if (city) {
        // If no manual data but we have city data, create simple place cards
        const placesGrid = document.getElementById('places-grid');
        placesGrid.innerHTML = ''; // Clear previous

        city.attractions.forEach(attraction => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.innerHTML = `
                <div class="place-image">
                    <img src="https://via.placeholder.com/640x360?text=${encodeURIComponent(attraction)}" alt="${attraction}">
                </div>
                <div class="place-info">
                    <h3>${attraction}</h3>
                    <p>A popular attraction in ${city.name}.</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction)}+${encodeURIComponent(city.name)}" target="_blank" class="map-link">
                        <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Map Pin">
                        View on Map
                    </a>
                </div>
            `;
            placesGrid.appendChild(placeCard);
        });
    }

    // Fetch hotels (this would typically come from an API)
    fetchHotels(cityName);
}

function fetchHotels(destination) {
    // For demonstration, we'll create some sample hotels
    // In a real application, this would fetch from an API
    const sampleHotels = [
        { name: `${destination} Grand Hotel`, price: '₹5,000 - ₹10,000 per night', rating: '4.5/5' },
        { name: `${destination} Luxury Resort`, price: '₹8,000 - ₹15,000 per night', rating: '4.8/5' },
        { name: `${destination} Budget Stay`, price: '₹2,000 - ₹4,000 per night', rating: '3.9/5' }
    ];

    const hotelsList = document.getElementById('hotels-list');
    hotelsList.innerHTML = ''; // Clear previous

    sampleHotels.forEach(hotel => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${hotel.name}</h3>
            <p><strong>Price:</strong> ${hotel.price}</p>
            <p><strong>Rating:</strong> ${hotel.rating}</p>
        `;
        hotelsList.appendChild(li);
    });

    // Also add sample restaurants
    const restaurantsList = document.getElementById('restaurants-list');
    restaurantsList.innerHTML = ''; // Clear previous

    const sampleRestaurants = [
        { name: `${destination} Spice Garden`, cuisine: 'Local Specialties', rating: '4.3/5' },
        { name: `${destination} Fine Dining`, cuisine: 'Multi-cuisine', rating: '4.6/5' },
        { name: `${destination} Street Food Corner`, cuisine: 'Street Food', rating: '4.2/5' }
    ];

    sampleRestaurants.forEach(restaurant => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${restaurant.name}</h3>
            <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
            <p><strong>Rating:</strong> ${restaurant.rating}</p>
        `;
        restaurantsList.appendChild(li);
    });
}
