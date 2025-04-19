// Add this to the top of your script.js file or include it separately
console.log("Debug script loaded");

// Function to test API endpoints
async function testAPI() {
    console.log("Testing API endpoints...");
    
    try {
        // Test hotels endpoint
        console.log("Testing hotels endpoint...");
        const hotelsResponse = await fetch("http://127.0.0.1:5000/hotels?destination=Mumbai");
        const hotelsData = await hotelsResponse.json();
        console.log("Hotels API response:", hotelsData);
        
        // Test flights endpoint
        console.log("Testing flights endpoint...");
        const flightsResponse = await fetch("http://127.0.0.1:5000/flights?from=Mumbai&to=Delhi");
        const flightsData = await flightsResponse.json();
        console.log("Flights API response:", flightsData);
        
        // Test trains endpoint
        console.log("Testing trains endpoint...");
        const trainsResponse = await fetch("http://127.0.0.1:5000/trains?from=Mumbai&to=Delhi");
        const trainsData = await trainsResponse.json();
        console.log("Trains API response:", trainsData);
        
        console.log("All API tests completed");
    } catch (error) {
        console.error("API test failed:", error);
    }
}

// Function to test DOM elements
function testDOM() {
    console.log("Testing DOM elements...");
    
    // Test hotel search elements
    const hotelCity = document.getElementById("hotel-city");
    const hotelLoading = document.getElementById("hotel-loading");
    const hotelsContainer = document.getElementById("hotels-container");
    console.log("Hotel elements:", { 
        "hotel-city": hotelCity ? "Found" : "Not found", 
        "hotel-loading": hotelLoading ? "Found" : "Not found",
        "hotels-container": hotelsContainer ? "Found" : "Not found"
    });
    
    // Test flight search elements
    const flightFrom = document.getElementById("flight-from");
    const flightTo = document.getElementById("flight-to");
    const flightDate = document.getElementById("flight-date");
    const flightLoading = document.getElementById("flight-loading");
    const flightsContainer = document.getElementById("flights-container");
    console.log("Flight elements:", { 
        "flight-from": flightFrom ? "Found" : "Not found", 
        "flight-to": flightTo ? "Found" : "Not found",
        "flight-date": flightDate ? "Found" : "Not found",
        "flight-loading": flightLoading ? "Found" : "Not found",
        "flights-container": flightsContainer ? "Found" : "Not found"
    });
    
    // Test train search elements
    const trainFrom = document.getElementById("train-from");
    const trainTo = document.getElementById("train-to");
    const trainDate = document.getElementById("train-date");
    const trainLoading = document.getElementById("train-loading");
    const trainsContainer = document.getElementById("trains-container");
    console.log("Train elements:", { 
        "train-from": trainFrom ? "Found" : "Not found", 
        "train-to": trainTo ? "Found" : "Not found",
        "train-date": trainDate ? "Found" : "Not found",
        "train-loading": trainLoading ? "Found" : "Not found",
        "trains-container": trainsContainer ? "Found" : "Not found"
    });
}

// Function to test search functions
function testSearchFunctions() {
    console.log("Testing search functions...");
    
    // Check if search functions are defined
    console.log("searchHotels function:", typeof searchHotels === "function" ? "Defined" : "Not defined");
    console.log("searchFlights function:", typeof searchFlights === "function" ? "Defined" : "Not defined");
    console.log("searchTrains function:", typeof searchTrains === "function" ? "Defined" : "Not defined");
    
    // Check if display functions are defined
    console.log("displayHotels function:", typeof displayHotels === "function" ? "Defined" : "Not defined");
    console.log("displayFlights function:", typeof displayFlights === "function" ? "Defined" : "Not defined");
    console.log("displayTrains function:", typeof displayTrains === "function" ? "Defined" : "Not defined");
}

// Run tests when the page loads
document.addEventListener("DOMContentLoaded", function() {
    console.log("Running debug tests...");
    testDOM();
    testSearchFunctions();
    
    // Add click event listeners for debugging
    const debugHotelsBtn = document.createElement("button");
    debugHotelsBtn.textContent = "Debug Hotels";
    debugHotelsBtn.style.position = "fixed";
    debugHotelsBtn.style.bottom = "10px";
    debugHotelsBtn.style.left = "10px";
    debugHotelsBtn.style.zIndex = "9999";
    debugHotelsBtn.onclick = function() {
        console.log("Debug Hotels clicked");
        if (typeof searchHotels === "function") {
            const city = prompt("Enter city name for hotel search:", "Mumbai");
            if (city) {
                document.getElementById("hotel-city").value = city;
                searchHotels();
            }
        } else {
            console.error("searchHotels function not found");
        }
    };
    document.body.appendChild(debugHotelsBtn);
    
    const debugAPIBtn = document.createElement("button");
    debugAPIBtn.textContent = "Test API";
    debugAPIBtn.style.position = "fixed";
    debugAPIBtn.style.bottom = "10px";
    debugAPIBtn.style.left = "120px";
    debugAPIBtn.style.zIndex = "9999";
    debugAPIBtn.onclick = testAPI;
    document.body.appendChild(debugAPIBtn);
});
