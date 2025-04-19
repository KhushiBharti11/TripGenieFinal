document.addEventListener("DOMContentLoaded", function () {
    // Hide welcome screen after 3 seconds and show main content
    setTimeout(() => {
        document.getElementById("welcome-screen").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    }, 3000);

    const tabs = document.querySelectorAll(".tab-link");
    const sections = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            sections.forEach(section => section.style.display = "none");
            const activeTab = this.getAttribute("data-tab");
            document.getElementById(activeTab).style.display = "block";

            if (activeTab === "destinations") {
                fetchDestinations();
            }

            tabs.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const bookingTabs = document.querySelectorAll(".booking-tab");
    const bookingSections = document.querySelectorAll(".booking-section");

    bookingTabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            bookingSections.forEach(section => section.classList.remove('active'));
            const activeBookingTab = this.getAttribute("data-tab");
            document.getElementById(activeBookingTab).classList.add('active');

            if (activeBookingTab === "hotels") {
                fetchHotels();
            }

            bookingTabs.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search logic under Destinations
    const searchInput = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');

    if (searchButton && searchInput) {
        function handleSearch() {
            const searchQuery = searchInput.value.trim().toLowerCase();
            if (searchQuery) {
                // Show loading indicator
                searchResults.innerHTML = '<p>Searching...</p>';

                // First try to search in our local Indian cities data
                fetch('indian_cities.json')
                    .then(response => response.json())
                    .then(data => {
                        // Find cities that match the search query
                        const matchedCities = data.cities.filter(city =>
                            city.name.toLowerCase().includes(searchQuery));

                        if (matchedCities.length > 0) {
                            // Show matching cities before redirecting
                            searchResults.innerHTML = `<p>Found ${matchedCities.length} matching cities. Redirecting to ${matchedCities[0].name}...</p>`;

                            // Redirect after a short delay to show the message
                            setTimeout(() => {
                                const destinationName = encodeURIComponent(matchedCities[0].name);
                                window.location.href = `destination_details.html?name=${destinationName}`;
                            }, 1000);
                        } else {
                            // If not found in our local data, try the API
                            tryApiSearch(searchQuery);
                        }
                    })
                    .catch(error => {
                        console.error('Error searching local cities data:', error);
                        // Fallback to API search if local search fails
                        tryApiSearch(searchQuery);
                    });
            } else {
                searchResults.innerHTML = '<p>Please enter a destination to search.</p>';
            }
        }

        // Function to try searching via the API as a fallback
        function tryApiSearch(searchQuery) {
            // Define common Indian cities for fallback
            const commonIndianCities = [
                {name: "Delhi", description: "Capital City"},
                {name: "Mumbai", description: "City of Dreams"},
                {name: "Kolkata", description: "City of Joy"},
                {name: "Chennai", description: "Gateway to South India"},
                {name: "Bangalore", description: "Silicon Valley of India"},
                {name: "Hyderabad", description: "City of Pearls"},
                {name: "Jaipur", description: "Pink City"},
                {name: "Agra", description: "City of Taj Mahal"}
            ];

            // Try to find a match in our local fallback list
            const matchedCities = commonIndianCities.filter(city =>
                city.name.toLowerCase().includes(searchQuery.toLowerCase()));

            if (matchedCities.length > 0) {
                // Redirect to destination details page with name
                const destinationName = encodeURIComponent(matchedCities[0].name);
                window.location.href = `destination_details.html?name=${destinationName}`;
                return;
            }

            // If no match in our fallback list, try the API
            fetch(`http://127.0.0.1:5000/api/search/${searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        // Redirect to destination details page with name
                        const destinationName = encodeURIComponent(data[0].name);
                        window.location.href = `destination_details.html?name=${destinationName}`;
                    } else {
                        searchResults.innerHTML = '<p>No destinations found. Try searching for an Indian city like Delhi, Mumbai, or Jaipur.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results from API:', error);
                    searchResults.innerHTML = '<p>No destinations found. Try searching for an Indian city like Delhi, Mumbai, or Jaipur.</p>';
                });
        }

        searchButton.addEventListener("click", handleSearch);
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                handleSearch();
            }
        });
    }

    function fetchDestinations() {
        // Show loading indicator
        const destinationsList = document.getElementById("destinations-list");
        destinationsList.innerHTML = "<p>Loading destinations...</p>";

        // Load destinations from our local Indian cities data
        fetch('indian_cities.json')
            .then(response => response.json())
            .then(data => {
                destinationsList.innerHTML = "";

                // Create a heading for Indian cities
                let heading = document.createElement("h3");
                heading.textContent = "Popular Indian Cities for Travel";
                heading.style.gridColumn = "1 / -1";
                heading.style.textAlign = "center";
                heading.style.margin = "20px 0";
                destinationsList.appendChild(heading);

                // Add each city to the grid
                data.cities.forEach(city => {
                    let item = document.createElement("li");

                    // Extract a short description (first 100 characters)
                    const shortDesc = city.description.length > 100 ?
                        city.description.substring(0, 100) + '...' :
                        city.description;

                    item.innerHTML = `
                        <a href="destination_details.html?name=${encodeURIComponent(city.name)}">
                            <h4>${city.name}</h4>
                            <span class="city-famous-for">${city.famous_for.split(',')[0]}</span>
                            <p class="city-description">${shortDesc}</p>
                        </a>
                    `;
                    destinationsList.appendChild(item);
                });
            })
            .catch(error => {
                console.error('Error fetching destinations:', error);
                destinationsList.innerHTML = "<p>Error loading destinations. Please check if indian_cities.json is available.</p>";
            });
    }

    function fetchDestinationsFromAPI() {
        fetch("http://127.0.0.1:5000/destinations")
            .then(response => response.json())
            .then(data => {
                let destinationsList = document.getElementById("destinations-list");
                destinationsList.innerHTML = "";
                data.forEach(destination => {
                    let item = document.createElement("li");
                    item.innerHTML = `<a href="destination_details.html?name=${encodeURIComponent(destination.name)}">${destination.name}</a>`;
                    destinationsList.appendChild(item);
                });
            })
            .catch(error => {
                console.error('Error fetching destinations from API:', error);
                let destinationsList = document.getElementById("destinations-list");
                destinationsList.innerHTML = "<p>Error loading destinations. Please try again later.</p>";
            });
    }
    function toggleBookingTab(tabId) {
        const allTabs = document.querySelectorAll(".booking-tab-content");
        allTabs.forEach(tab => tab.style.display = "none");

        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.style.display = "block";
        }
    }
    function searchHotels() {
        const city = document.getElementById("hotel-city").value.trim();
        if (!city) {
            alert("Please enter a city name");
            return;
        }

        // Show loading spinner
        document.getElementById("hotel-loading").style.display = "flex";
        document.getElementById("hotels-container").innerHTML = "";

        // Try to get hotels from our API
        fetch(`http://127.0.0.1:5000/hotels?destination=${encodeURIComponent(city)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayHotels(city, data);
            })
            .catch(error => {
                console.error("Error fetching from API:", error);
                // Use fallback data if API fails
                const fallbackHotels = generateFallbackHotels(city);
                displayHotels(city, fallbackHotels);
            });
    }

    function generateFallbackHotels(city) {
        // Generate sample hotel data for the city
        return [
            {
                'id': `${city.toLowerCase().substring(0, 2)}001`,
                'name': `${city} Grand Hotel`,
                'price': '₹5,000 - ₹10,000 per night',
                'rating': '4.5/5',
                'description': 'Luxury hotel in the heart of the city',
                'image_url': 'https://source.unsplash.com/featured/?hotel,luxury',
                'amenities': ['Swimming Pool', 'Spa', 'Free WiFi', 'Restaurant']
            },
            {
                'id': `${city.toLowerCase().substring(0, 2)}002`,
                'name': `${city} Plaza`,
                'price': '₹3,500 - ₹7,000 per night',
                'rating': '4.2/5',
                'description': 'Comfortable stay with great amenities',
                'image_url': 'https://source.unsplash.com/featured/?hotel,plaza',
                'amenities': ['Free WiFi', 'Restaurant', 'Fitness Center']
            },
            {
                'id': `${city.toLowerCase().substring(0, 2)}003`,
                'name': `${city} Budget Inn`,
                'price': '₹1,500 - ₹3,000 per night',
                'rating': '3.8/5',
                'description': 'Affordable accommodation for travelers',
                'image_url': 'https://source.unsplash.com/featured/?hotel,budget',
                'amenities': ['Free WiFi', 'Air Conditioning']
            }
        ];
    }

    function displayHotels(city, data) {
        // Hide loading spinner
        document.getElementById("hotel-loading").style.display = "none";

        // Display hotels
        const hotelsContainer = document.getElementById("hotels-container");
        hotelsContainer.innerHTML = "";

        if (data.error) {
            hotelsContainer.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }

        if (data.length === 0) {
            hotelsContainer.innerHTML = `<p>No hotels found for ${city}. Try another city.</p>`;
            return;
        }

        // Show hotels section
        toggleBookingTab('hotels-section');

        // Display each hotel
        data.forEach(hotel => {
            const hotelCard = document.createElement("div");
            hotelCard.className = "hotel";

            // Create hotel image if available
            let imageHtml = '';
            if (hotel.image_url) {
                imageHtml = `<img src="${hotel.image_url}" alt="${hotel.name}" onerror="this.src='https://via.placeholder.com/300x150?text=Hotel+Image'">`;
            } else {
                imageHtml = `<img src="https://via.placeholder.com/300x150?text=Hotel+Image" alt="${hotel.name}">`;
            }

            // Format amenities if available
            let amenitiesHtml = '';
            if (hotel.amenities && hotel.amenities.length > 0) {
                amenitiesHtml = `
                    <div class="amenities">
                        <p><strong>Amenities:</strong> ${hotel.amenities.join(', ')}</p>
                    </div>
                `;
            }

            hotelCard.innerHTML = `
                ${imageHtml}
                <h3>${hotel.name}</h3>
                <p class="price">${hotel.price}</p>
                <p class="rating">Rating: ${hotel.rating}</p>
                <p>${hotel.description || ''}</p>
                ${amenitiesHtml}
                <div class="hotel-buttons">
                    <button class="view-details" onclick="viewHotelDetails('${hotel.id}')">View Details</button>
                    <button class="book-now" onclick="window.open('https://www.trivago.in/en-IN/srl?search=${encodeURIComponent(city + ' ' + hotel.name)}', '_blank')">Book Now</button>
                </div>
            `;

            hotelsContainer.appendChild(hotelCard);
        });
    }

    function viewHotelDetails(hotelId) {
        // Show loading spinner
        document.getElementById("hotel-loading").style.display = "flex";

        // Fetch hotel details from API
        fetch(`http://127.0.0.1:5000/hotel/${hotelId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(hotel => {
                // Hide loading spinner
                document.getElementById("hotel-loading").style.display = "none";

                // Create modal for hotel details
                const modal = document.createElement("div");
                modal.className = "hotel-modal";

                // Create hotel image if available
                let imageHtml = '';
                if (hotel.image_url) {
                    imageHtml = `<img src="${hotel.image_url}" alt="${hotel.name}" onerror="this.src='https://via.placeholder.com/600x300?text=Hotel+Image'">`;
                } else {
                    imageHtml = `<img src="https://via.placeholder.com/600x300?text=Hotel+Image" alt="${hotel.name}">`;
                }

                // Format amenities if available
                let amenitiesHtml = '';
                if (hotel.amenities && hotel.amenities.length > 0) {
                    amenitiesHtml = `
                        <div class="amenities">
                            <h4>Amenities</h4>
                            <ul>
                                ${hotel.amenities.map(amenity => `<li>${amenity}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }

                // Format rooms if available
                let roomsHtml = '';
                if (hotel.rooms && hotel.rooms.length > 0) {
                    roomsHtml = `
                        <div class="rooms">
                            <h4>Available Rooms</h4>
                            <table>
                                <tr>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Beds</th>
                                </tr>
                                ${hotel.rooms.map(room => `
                                    <tr>
                                        <td>${room.type}</td>
                                        <td>${room.price}</td>
                                        <td>${room.beds}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </div>
                    `;
                }

                // Format reviews if available
                let reviewsHtml = '';
                if (hotel.reviews && hotel.reviews.length > 0) {
                    reviewsHtml = `
                        <div class="reviews">
                            <h4>Guest Reviews</h4>
                            ${hotel.reviews.map(review => `
                                <div class="review">
                                    <p><strong>${review.user}</strong> - ${review.rating}/5</p>
                                    <p>${review.comment}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                        ${imageHtml}
                        <h2>${hotel.name}</h2>
                        <p class="address">${hotel.address || ''}</p>
                        <p class="price"><strong>Price Range:</strong> ${hotel.price_range}</p>
                        <p class="rating"><strong>Rating:</strong> ${hotel.rating}/5</p>
                        <div class="description">
                            <p>${hotel.description || ''}</p>
                        </div>
                        ${amenitiesHtml}
                        ${roomsHtml}
                        ${reviewsHtml}
                        <div class="modal-buttons">
                            <button onclick="window.open('https://www.trivago.in/en-IN/srl?search=${encodeURIComponent(hotel.name)}', '_blank')">Book on Trivago</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Add event listener to close modal when clicking outside
                modal.addEventListener('click', function(event) {
                    if (event.target === modal) {
                        modal.remove();
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching hotel details:", error);
                document.getElementById("hotel-loading").style.display = "none";
                alert("Could not load hotel details. Please try again later.");
            });
    }

    function openTrivagoInBrowser(city) {
        // Try to use the backend API first
        fetch(`http://127.0.0.1:5000/open_trivago?destination=${encodeURIComponent(city)}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Opening Trivago in your browser...");
                } else {
                    // Fallback to direct URL opening
                    openTrivagoDirectly(city);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                // Fallback to direct URL opening
                openTrivagoDirectly(city);
            });
    }

    function openTrivagoDirectly(city) {
        const trivagoUrl = `https://www.trivago.in/en-IN/srl?search=${encodeURIComponent(city)}`;
        window.open(trivagoUrl, '_blank');
        alert(`Opening Trivago search for ${city}...`);
    }

    function fetchHotels() {
        const url = 'http://127.0.0.1:5000/hotels';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let container = document.getElementById("hotels-container");
                container.innerHTML = "";
                data.forEach(hotel => {
                    let card = document.createElement('div');
                    card.classList.add('hotel');
                    card.innerHTML = `<h3>${hotel.name}</h3><p>Rating: ${hotel.rating}</p><p>${hotel.description}</p>`;
                    container.appendChild(card);
                });
            })
            .catch(error => console.error('Error fetching hotels:', error));
    }

    // Flight search functionality
    function searchFlights() {
        const fromCity = document.getElementById("flight-from").value.trim();
        const toCity = document.getElementById("flight-to").value.trim();
        const date = document.getElementById("flight-date").value;

        if (!fromCity || !toCity) {
            alert("Please enter both departure and arrival cities");
            return;
        }

        // Show loading spinner
        document.getElementById("flight-loading").style.display = "flex";
        document.getElementById("flights-container").innerHTML = "";

        // Try to get flights from our API
        fetch(`http://127.0.0.1:5000/flights?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayFlights(fromCity, toCity, date, data);
            })
            .catch(error => {
                console.error("Error fetching flights:", error);
                // Use fallback data if API fails
                const fallbackFlights = generateFallbackFlights(fromCity, toCity);
                displayFlights(fromCity, toCity, date, fallbackFlights);
            });
    }

    function generateFallbackFlights(fromCity, toCity) {
        // Generate sample flight data
        return [
            {
                'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}001`,
                'airline': 'Air India',
                'flight_number': 'AI-101',
                'departure': `${fromCity} (BOM)`,
                'arrival': `${toCity} (DEL)`,
                'departure_time': '09:00',
                'arrival_time': '11:00',
                'duration': '2h 00m',
                'price': '₹5,000',
                'class': 'Economy',
                'stops': 'Non-stop',
                'image_url': 'https://source.unsplash.com/featured/?airplane,airindia'
            },
            {
                'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}002`,
                'airline': 'IndiGo',
                'flight_number': '6E-123',
                'departure': `${fromCity} (BOM)`,
                'arrival': `${toCity} (DEL)`,
                'departure_time': '14:00',
                'arrival_time': '16:00',
                'duration': '2h 00m',
                'price': '₹4,500',
                'class': 'Economy',
                'stops': 'Non-stop',
                'image_url': 'https://source.unsplash.com/featured/?airplane,indigo'
            },
            {
                'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}003`,
                'airline': 'SpiceJet',
                'flight_number': 'SG-456',
                'departure': `${fromCity} (BOM)`,
                'arrival': `${toCity} (DEL)`,
                'departure_time': '19:00',
                'arrival_time': '21:00',
                'duration': '2h 00m',
                'price': '₹4,000',
                'class': 'Economy',
                'stops': 'Non-stop',
                'image_url': 'https://source.unsplash.com/featured/?airplane,spicejet'
            }
        ];
    }

    function displayFlights(fromCity, toCity, date, data) {
        // Hide loading spinner
        document.getElementById("flight-loading").style.display = "none";

        // Display flights
        const flightsContainer = document.getElementById("flights-container");
        flightsContainer.innerHTML = "";

        if (data.error) {
            flightsContainer.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }

        if (data.length === 0) {
            flightsContainer.innerHTML = `<p>No flights found from ${fromCity} to ${toCity}. Try another route.</p>`;
            return;
        }

        // Show flights section
        toggleBookingTab('flights-section');

        // Format date for display
        const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Selected Date';

        // Add route information
        const routeInfo = document.createElement("div");
        routeInfo.className = "route-info";
        routeInfo.innerHTML = `<h3>${fromCity} to ${toCity}</h3><p>${formattedDate}</p>`;
        flightsContainer.appendChild(routeInfo);

        // Display each flight
        data.forEach(flight => {
            const flightCard = document.createElement("div");
            flightCard.className = "flight";

            // Create flight image if available
            let imageHtml = '';
            if (flight.image_url) {
                imageHtml = `<img src="${flight.image_url}" alt="${flight.airline}" onerror="this.src='https://via.placeholder.com/300x150?text=Airline+Image'">`;
            } else {
                imageHtml = `<img src="https://via.placeholder.com/300x150?text=Airline+Image" alt="${flight.airline}">`;
            }

            flightCard.innerHTML = `
                ${imageHtml}
                <div class="flight-info">
                    <h3>${flight.airline}</h3>
                    <p>${flight.flight_number} | ${flight.stops}</p>
                </div>
                <div class="flight-times">
                    <div class="departure">
                        <p class="time">${flight.departure_time}</p>
                        <p class="airport">${flight.departure}</p>
                    </div>
                    <div class="flight-arrow"></div>
                    <div class="arrival">
                        <p class="time">${flight.arrival_time}</p>
                        <p class="airport">${flight.arrival}</p>
                    </div>
                </div>
                <p class="flight-duration">Duration: ${flight.duration}</p>
                <p class="price">${flight.price}</p>
                <p class="class">Class: ${flight.class}</p>
                <div class="flight-buttons">
                    <button class="book-now" onclick="window.open('https://www.makemytrip.com/flights/', '_blank')">Book Now</button>
                </div>
            `;

            flightsContainer.appendChild(flightCard);
        });
    }

    // Train search functionality
    function searchTrains() {
        const fromCity = document.getElementById("train-from").value.trim();
        const toCity = document.getElementById("train-to").value.trim();
        const date = document.getElementById("train-date").value;

        if (!fromCity || !toCity) {
            alert("Please enter both departure and arrival cities");
            return;
        }

        // Show loading spinner
        document.getElementById("train-loading").style.display = "flex";
        document.getElementById("trains-container").innerHTML = "";

        // Try to get trains from our API
        fetch(`http://127.0.0.1:5000/trains?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayTrains(fromCity, toCity, date, data);
            })
            .catch(error => {
                console.error("Error fetching trains:", error);
                // Use fallback data if API fails
                const fallbackTrains = generateFallbackTrains(fromCity, toCity);
                displayTrains(fromCity, toCity, date, fallbackTrains);
            });
    }

    function generateFallbackTrains(fromCity, toCity) {
        // Generate sample train data
        return [
            {
                'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}001`,
                'train_name': 'Rajdhani Express',
                'train_number': '12301',
                'departure': `${fromCity} Junction`,
                'arrival': `${toCity} Junction`,
                'departure_time': '16:00',
                'arrival_time': '08:00',
                'duration': '16h 00m',
                'price': '₹2,000',
                'class': '3A',
                'distance': '1,200 km',
                'image_url': 'https://source.unsplash.com/featured/?train,rajdhani'
            },
            {
                'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}002`,
                'train_name': 'Shatabdi Express',
                'train_number': '12302',
                'departure': `${fromCity} Junction`,
                'arrival': `${toCity} Junction`,
                'departure_time': '06:00',
                'arrival_time': '14:00',
                'duration': '8h 00m',
                'price': '₹1,500',
                'class': 'CC',
                'distance': '800 km',
                'image_url': 'https://source.unsplash.com/featured/?train,shatabdi'
            },
            {
                'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}003`,
                'train_name': `${fromCity}-${toCity} Express`,
                'train_number': '12303',
                'departure': `${fromCity} Junction`,
                'arrival': `${toCity} Junction`,
                'departure_time': '22:00',
                'arrival_time': '10:00',
                'duration': '12h 00m',
                'price': '₹1,200',
                'class': 'SL',
                'distance': '1,000 km',
                'image_url': 'https://source.unsplash.com/featured/?train,express'
            }
        ];
    }

    function displayTrains(fromCity, toCity, date, data) {
        // Hide loading spinner
        document.getElementById("train-loading").style.display = "none";

        // Display trains
        const trainsContainer = document.getElementById("trains-container");
        trainsContainer.innerHTML = "";

        if (data.error) {
            trainsContainer.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }

        if (data.length === 0) {
            trainsContainer.innerHTML = `<p>No trains found from ${fromCity} to ${toCity}. Try another route.</p>`;
            return;
        }

        // Show trains section
        toggleBookingTab('trains-section');

        // Format date for display
        const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Selected Date';

        // Add route information
        const routeInfo = document.createElement("div");
        routeInfo.className = "route-info";
        routeInfo.innerHTML = `<h3>${fromCity} to ${toCity}</h3><p>${formattedDate}</p>`;
        trainsContainer.appendChild(routeInfo);

        // Display each train
        data.forEach(train => {
            const trainCard = document.createElement("div");
            trainCard.className = "train";

            // Create train image if available
            let imageHtml = '';
            if (train.image_url) {
                imageHtml = `<img src="${train.image_url}" alt="${train.train_name}" onerror="this.src='https://via.placeholder.com/300x150?text=Train+Image'">`;
            } else {
                imageHtml = `<img src="https://via.placeholder.com/300x150?text=Train+Image" alt="${train.train_name}">`;
            }

            trainCard.innerHTML = `
                ${imageHtml}
                <div class="train-info">
                    <h3>${train.train_name}</h3>
                    <p class="train-number">${train.train_number}</p>
                </div>
                <div class="train-times">
                    <div class="departure">
                        <p class="time">${train.departure_time}</p>
                        <p class="station">${train.departure}</p>
                    </div>
                    <div class="train-arrow"></div>
                    <div class="arrival">
                        <p class="time">${train.arrival_time}</p>
                        <p class="station">${train.arrival}</p>
                    </div>
                </div>
                <p class="train-duration">Duration: ${train.duration} | Distance: ${train.distance}</p>
                <p class="price">${train.price}</p>
                <p class="class">Class: ${train.class}</p>
                <div class="train-buttons">
                    <button class="book-now" onclick="window.open('https://www.irctc.co.in/', '_blank')">Book Now</button>
                </div>
            `;

            trainsContainer.appendChild(trainCard);
        });
    }
    function searchTrains(from, to) {
        fetch(`http://127.0.0.1:5000/api/trains?from=${from}&to=${to}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); // display or render train data
            })
            .catch(error => {
                console.error('Error fetching train data:', error);
            });
    }
    function getFare(trainNo, from, to) {
        fetch(`http://127.0.0.1:5000/api/fare?trainNo=${trainNo}&from=${from}&to=${to}`)
            .then(res => res.json())
            .then(data => console.log(data));
    }
    function getLiveStatus(trainNo) {
        fetch(`http://127.0.0.1:5000/api/live-status?trainNo=${trainNo}`)
            .then(res => res.json())
            .then(data => console.log(data));
    }
            
    
    const preferencesBtn = document.getElementById("save-preferences");
    if (preferencesBtn) {
        preferencesBtn.addEventListener("click", function () {
            let selected = [];
            document.querySelectorAll("input[name='preferences']:checked").forEach(c => selected.push(c.value));
            localStorage.setItem("tripPreferences", JSON.stringify(selected));
            alert("Preferences saved!");
        });
    }

    const currentHash = window.location.hash.slice(1);
    if (currentHash && document.getElementById(currentHash)) {
        document.querySelector(`[data-tab="${currentHash}"]`)?.click();
    } else {
        document.getElementById("home").style.display = "block";
        document.querySelector('[data-tab="home"]').classList.add('active');
    }
});
