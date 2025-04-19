// Global variables to store destination data
let manualCityData = {};

// Function to load destination details
function loadDestinationDetails() {
    console.log("Loading destination details...");
    
    // Get the destination name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const destinationName = urlParams.get('name');
    
    // If no destination name is provided, show an error
    if (!destinationName) {
        document.getElementById('destination-title').textContent = "Destination Not Found";
        document.getElementById('places-grid').innerHTML = "<p>No destination specified. Please go back and select a destination.</p>";
        return;
    }
    
    // Set the destination title
    document.getElementById('destination-title').textContent = destinationName;
    
    // Load the manual_indian_city_places.json file
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
            
            // Display the destination details
            displayDestinationDetails(destinationName);
        })
        .catch(error => {
            console.error("Error loading manual_indian_city_places.json:", error);
            
            // Show error message
            document.getElementById('places-grid').innerHTML = `
                <div class="error">
                    <p>Sorry, we couldn't load the destination details. Please try again later.</p>
                    <p>Error: ${error.message}</p>
                    <p><a href="ui.html">Back to Home</a></p>
                </div>
            `;
        });
}

// Function to display destination details
function displayDestinationDetails(destinationName) {
    console.log("Displaying details for destination:", destinationName);
    
    // Check if the destination exists in our data
    const destinationData = manualCityData[destinationName];
    if (!destinationData) {
        // Try to find the destination with case-insensitive search
        const cityKey = Object.keys(manualCityData).find(key => 
            key.toLowerCase() === destinationName.toLowerCase()
        );
        
        if (cityKey) {
            // Found the destination with different case
            displayDestinationDetails(cityKey);
            return;
        }
        
        // Destination not found
        document.getElementById('places-grid').innerHTML = `
            <div class="error">
                <p>Destination "${destinationName}" not found. Please try another destination.</p>
                <p><a href="ui.html">Back to Home</a></p>
            </div>
        `;
        return;
    }
    
    // Update the destination title
    document.getElementById('destination-title').textContent = destinationName;
    
    // Display the destination image
    if (destinationData.image) {
        const headerImage = document.querySelector('.destination-header-image img');
        if (headerImage) {
            headerImage.src = destinationData.image;
            headerImage.alt = destinationName;
        }
    }
    
    // Display the places to visit
    if (destinationData.places && destinationData.places.length > 0) {
        let placesHtml = '';
        let placesListHtml = '<ul>';
        
        destinationData.places.forEach(place => {
            // Add to places grid
            placesHtml += `
                <div class="place-card">
                    <div class="place-image">
                        <img src="${place.image || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(place.name)}" alt="${place.name}">
                    </div>
                    <div class="place-info">
                        <h3>${place.name}</h3>
                        <p>${place.description || ''}</p>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + destinationName)}" target="_blank" class="map-link">
                            <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Map">
                            View on Map
                        </a>
                    </div>
                </div>
            `;
            
            // Add to places list
            placesListHtml += `<li>${place.name}</li>`;
        });
        
        placesListHtml += '</ul>';
        
        // Update the places grid
        document.getElementById('places-grid').innerHTML = placesHtml;
        
        // Update the places list
        document.getElementById('places-list').innerHTML = placesListHtml;
    } else {
        document.getElementById('places-grid').innerHTML = "<p>No places to visit found for this destination.</p>";
        document.getElementById('places-list').innerHTML = "<p>No attractions found.</p>";
    }
    
    // Add some default cuisine information
    document.getElementById('cuisine-list').innerHTML = `
        <p>Explore the local cuisine of ${destinationName}. Try the famous local dishes and street food.</p>
    `;
    
    // Add some default hotel information
    document.getElementById('hotels-list').innerHTML = `
        <li>Various hotels available in ${destinationName} ranging from budget to luxury options.</li>
        <li>Use the buttons below to find and book hotels.</li>
    `;
    
    // Add some default restaurant information
    document.getElementById('restaurants-list').innerHTML = `
        <li>Enjoy local cuisine at various restaurants in ${destinationName}.</li>
        <li>Try street food for an authentic experience.</li>
    `;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Destination_details.js loaded");
    
    // Load destination details
    loadDestinationDetails();
});
