// Function to load destination details
function loadDestinationDetails() {
    console.log('Loading destination details');
    
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
    
    // Load the manual_indian_city_places.json file using XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'manual_indian_city_places.json', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                console.log('Successfully loaded city data:', Object.keys(data).length, 'cities');
                
                // Check if the destination exists in our data
                const destinationData = data[destinationName];
                if (!destinationData) {
                    // Try to find the destination with case-insensitive search
                    const cityKey = Object.keys(data).find(key => 
                        key.toLowerCase() === destinationName.toLowerCase()
                    );
                    
                    if (cityKey) {
                        // Found the destination with different case
                        document.getElementById('destination-title').textContent = cityKey;
                        displayDestinationDetails(data[cityKey], cityKey);
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
                
                // Display the destination details
                displayDestinationDetails(destinationData, destinationName);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('places-grid').innerHTML = `
                    <div class="error">
                        <p>Error parsing destination data: ${error.message}. Please try again later.</p>
                        <p><a href="ui.html">Back to Home</a></p>
                    </div>
                `;
            }
        } else {
            console.error('Error loading destination data. Status:', xhr.status);
            document.getElementById('places-grid').innerHTML = `
                <div class="error">
                    <p>Error loading destination data. Status: ${xhr.status}. Please try again later.</p>
                    <p><a href="ui.html">Back to Home</a></p>
                </div>
            `;
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error while loading destination data');
        document.getElementById('places-grid').innerHTML = `
            <div class="error">
                <p>Network error while loading destination data. Please check your connection and try again.</p>
                <p><a href="ui.html">Back to Home</a></p>
            </div>
        `;
    };
    
    xhr.send();
}

// Function to display destination details
function displayDestinationDetails(destinationData, destinationName) {
    console.log('Displaying details for destination:', destinationName);
    
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
    console.log('Destination_details.js loaded');
    
    // Load destination details
    loadDestinationDetails();
});
