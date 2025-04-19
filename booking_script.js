// Hotel search functionality
function searchHotels() {
    console.log("searchHotels function called");

    // Show a message that we're redirecting to Trivago
    const hotelsContainer = document.getElementById("hotels-container");
    if (hotelsContainer) {
        hotelsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Redirecting to Trivago for hotel booking...</h3>
                <p>You will be redirected to Trivago to search for hotels.</p>
            </div>
        `;
    }

    // Show loading spinner
    const loadingElement = document.getElementById("hotel-loading");
    if (loadingElement) loadingElement.style.display = "flex";

    // Redirect to Trivago after a short delay
    setTimeout(() => {
        window.open('https://www.trivago.in/', '_blank');

        // Hide loading spinner
        if (loadingElement) loadingElement.style.display = "none";

        // Update the message after redirection
        if (hotelsContainer) {
            hotelsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>Redirected to Trivago</h3>
                    <p>Please check your browser for the Trivago website tab that has opened.</p>
                    <p>If the Trivago website didn't open, <a href="https://www.trivago.in/" target="_blank">click here</a>.</p>
                </div>
            `;
        }
    }, 1500);
}

// Flight search functionality
function searchFlights() {
    console.log("searchFlights function called");

    // Show a message that we're redirecting to a flight booking site
    const flightsContainer = document.getElementById("flights-container");
    if (flightsContainer) {
        flightsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Redirecting to MakeMyTrip for flight booking...</h3>
                <p>You will be redirected to MakeMyTrip to search for flights.</p>
            </div>
        `;
    }

    // Show loading spinner
    const loadingElement = document.getElementById("flight-loading");
    if (loadingElement) loadingElement.style.display = "flex";

    // Redirect to MakeMyTrip after a short delay
    setTimeout(() => {
        window.open('https://www.makemytrip.com/flights/', '_blank');

        // Hide loading spinner
        if (loadingElement) loadingElement.style.display = "none";

        // Update the message after redirection
        if (flightsContainer) {
            flightsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>Redirected to MakeMyTrip</h3>
                    <p>Please check your browser for the MakeMyTrip website tab that has opened.</p>
                    <p>If the MakeMyTrip website didn't open, <a href="https://www.makemytrip.com/flights/" target="_blank">click here</a>.</p>
                </div>
            `;
        }
    }, 1500);
}

// Function to generate fallback flight data
function generateFallbackFlights(fromCity, toCity) {
    console.log("Generating fallback flights for:", fromCity, "to", toCity);
    return [
        {
            'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}001`,
            'airline': 'Air India',
            'flight_number': 'AI-101',
            'departure': `${fromCity}`,
            'arrival': `${toCity}`,
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
            'departure': `${fromCity}`,
            'arrival': `${toCity}`,
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
            'departure': `${fromCity}`,
            'arrival': `${toCity}`,
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

// Function to display flights - Simplified to just return as we redirect to external site
function displayFlights(fromCity, toCity, date, data) {
    console.log("displayFlights called with data:", data);
    return;
}

// Train search functionality
function searchTrains() {
    console.log("searchTrains function called");

    // Show a message that we're redirecting to IRCTC
    const trainsContainer = document.getElementById("trains-container");
    if (trainsContainer) {
        trainsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Redirecting to IRCTC for train booking...</h3>
                <p>You will be redirected to the official IRCTC website to search for trains.</p>
            </div>
        `;
    }

    // Show loading spinner
    const loadingElement = document.getElementById("train-loading");
    if (loadingElement) loadingElement.style.display = "flex";

    // Redirect to IRCTC after a short delay
    setTimeout(() => {
        window.open('https://www.irctc.co.in/nget/train-search', '_blank');

        // Hide loading spinner
        if (loadingElement) loadingElement.style.display = "none";

        // Update the message after redirection
        if (trainsContainer) {
            trainsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>Redirected to IRCTC</h3>
                    <p>Please check your browser for the IRCTC website tab that has opened.</p>
                    <p>If the IRCTC website didn't open, <a href="https://www.irctc.co.in/nget/train-search" target="_blank">click here</a>.</p>
                </div>
            `;
        }
    }, 1500);
}

// Function to generate fallback train data
function generateFallbackTrains(fromCity, toCity) {
    console.log("Generating fallback trains for:", fromCity, "to", toCity);
    return [
        {
            'train_number': '12301',
            'train_name': 'Rajdhani Express',
            'from_station_code': fromCity.substring(0, 3).toUpperCase(),
            'to_station_code': toCity.substring(0, 3).toUpperCase(),
            'departure_time': '16:00',
            'arrival_time': '08:00',
            'travel_time': '16h 00m',
            'distance': '1,200 km',
            'class_type': '3A',
            'fare': '₹2,000',
            'booking_url': 'https://www.irctc.co.in/nget/train-search'
        },
        {
            'train_number': '12302',
            'train_name': 'Shatabdi Express',
            'from_station_code': fromCity.substring(0, 3).toUpperCase(),
            'to_station_code': toCity.substring(0, 3).toUpperCase(),
            'departure_time': '06:00',
            'arrival_time': '14:00',
            'travel_time': '8h 00m',
            'distance': '800 km',
            'class_type': 'CC',
            'fare': '₹1,500',
            'booking_url': 'https://www.irctc.co.in/nget/train-search'
        },
        {
            'train_number': '12303',
            'train_name': `${fromCity}-${toCity} Express`,
            'from_station_code': fromCity.substring(0, 3).toUpperCase(),
            'to_station_code': toCity.substring(0, 3).toUpperCase(),
            'departure_time': '22:00',
            'arrival_time': '10:00',
            'travel_time': '12h 00m',
            'distance': '1,000 km',
            'class_type': 'SL',
            'fare': '₹1,200',
            'booking_url': 'https://www.irctc.co.in/nget/train-search'
        }
    ];
}

// Function to display trains
function displayTrains(fromCity, toCity, date, data) {
    console.log("displayTrains called with data:", data);

    // Hide loading spinner
    const loadingElement = document.getElementById("train-loading");
    if (loadingElement) loadingElement.style.display = "none";

    // Display trains
    const trainsContainer = document.getElementById("trains-container");
    console.log("trainsContainer element:", trainsContainer);

    if (!trainsContainer) {
        console.error("trains-container element not found!");
        return;
    }

    // Instead of displaying trains, show a message and redirect to IRCTC
    trainsContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3>Redirected to IRCTC</h3>
            <p>Please check your browser for the IRCTC website tab that has opened.</p>
            <p>If the IRCTC website didn't open, <a href="https://www.irctc.co.in/nget/train-search" target="_blank">click here</a>.</p>
        </div>
    `;

    // Open IRCTC in a new tab
    window.open('https://www.irctc.co.in/nget/train-search', '_blank');

    return;
}

// Bus search functionality
function searchBuses() {
    console.log("searchBuses function called");

    // Show a message that we're redirecting to a bus booking site
    const busesContainer = document.getElementById("buses-container");
    if (busesContainer) {
        busesContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Redirecting to RedBus for bus booking...</h3>
                <p>You will be redirected to RedBus to search for buses.</p>
            </div>
        `;
    }

    // Show loading spinner
    const loadingElement = document.getElementById("bus-loading");
    if (loadingElement) loadingElement.style.display = "flex";

    // Redirect to RedBus after a short delay
    setTimeout(() => {
        window.open('https://www.redbus.in/', '_blank');

        // Hide loading spinner
        if (loadingElement) loadingElement.style.display = "none";

        // Update the message after redirection
        if (busesContainer) {
            busesContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>Redirected to RedBus</h3>
                    <p>Please check your browser for the RedBus website tab that has opened.</p>
                    <p>If the RedBus website didn't open, <a href="https://www.redbus.in/" target="_blank">click here</a>.</p>
                </div>
            `;
        }
    }, 1500);
}

// Function to generate fallback bus data
function generateFallbackBuses(fromCity, toCity) {
    console.log("Generating fallback buses for:", fromCity, "to", toCity);
    return [
        {
            'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}001`,
            'operator': 'RedBus',
            'bus_type': 'Volvo A/C Sleeper',
            'is_ac': true,
            'departure': `${fromCity}`,
            'arrival': `${toCity}`,
            'departure_time': '19:00',
            'arrival_time': '07:00',
            'duration': '12h 00m',
            'distance': '800 km',
            'price': '₹1,200',
            'amenities': ['WiFi', 'Charging Point', 'Water Bottle'],
            'seats': '40 Berths',
            'rating': '4.5/5',
            'image_url': 'https://source.unsplash.com/featured/?bus,travel,redbus'
        },
        {
            'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}002`,
            'operator': 'VRL Travels',
            'bus_type': 'AC Seater',
            'is_ac': true,
            'departure': `${fromCity}`,
            'arrival': `${toCity}`,
            'departure_time': '20:00',
            'arrival_time': '06:00',
            'duration': '10h 00m',
            'distance': '700 km',
            'price': '₹1,000',
            'amenities': ['Charging Point', 'Water Bottle'],
            'seats': '45 Seats',
            'rating': '4.2/5',
            'image_url': 'https://source.unsplash.com/featured/?bus,travel,vrl'
        },
        {
            'id': `${fromCity.toLowerCase().substring(0, 1)}${toCity.toLowerCase().substring(0, 1)}003`,
            'operator': 'SRS Travels',
            'bus_type': 'Non-AC Sleeper',
            'is_ac': false,
            'departure': `${fromCity}`,
            'arrival': `${toCity}`,
            'departure_time': '21:00',
            'arrival_time': '08:00',
            'duration': '11h 00m',
            'distance': '750 km',
            'price': '₹800',
            'amenities': ['Water Bottle'],
            'seats': '35 Berths',
            'rating': '3.8/5',
            'image_url': 'https://source.unsplash.com/featured/?bus,travel,srs'
        }
    ];
}

// Function to display buses - Simplified to just return as we redirect to external site
function displayBuses(fromCity, toCity, date, data) {
    console.log("displayBuses called with data:", data);
    return;
}

// Function to toggle between booking tabs
function toggleBookingTab(tabId) {
    console.log("Toggling booking tab:", tabId);

    // Hide all booking tab content
    const tabContents = document.querySelectorAll('.booking-tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
    });

    // Remove active class from all booking tabs
    const bookingTabs = document.querySelectorAll('.booking-tab');
    bookingTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';

        // Add active class to the clicked tab
        const activeTab = document.querySelector(`.booking-tab[onclick*="'${tabId}'"`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
}

// Cab search functionality
function searchCabs() {
    console.log("searchCabs function called");

    // Show a message that we're redirecting to a cab booking site
    const cabsContainer = document.getElementById("cabs-container");
    if (cabsContainer) {
        cabsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Redirecting to Uber for cab booking...</h3>
                <p>You will be redirected to Uber to book a cab.</p>
            </div>
        `;
    }

    // Show loading spinner
    const loadingElement = document.getElementById("cab-loading");
    if (loadingElement) loadingElement.style.display = "flex";

    // Redirect to Uber after a short delay
    setTimeout(() => {
        window.open('https://www.uber.com/in/en/', '_blank');

        // Hide loading spinner
        if (loadingElement) loadingElement.style.display = "none";

        // Update the message after redirection
        if (cabsContainer) {
            cabsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>Redirected to Uber</h3>
                    <p>Please check your browser for the Uber website tab that has opened.</p>
                    <p>If the Uber website didn't open, <a href="https://www.uber.com/in/en/" target="_blank">click here</a>.</p>
                </div>
            `;
        }
    }, 1500);
}
