// JavaScript for day-wise route optimization tabs

// Initialize the day route tabs functionality
function initDayRouteTabs() {
    console.log('Initializing day route tabs');

    // Add event listeners to tab buttons
    document.addEventListener('click', function(event) {
        // Check if the clicked element is a tab button
        if (event.target.classList.contains('day-route-tab-btn') ||
            event.target.parentElement.classList.contains('day-route-tab-btn')) {

            const button = event.target.classList.contains('day-route-tab-btn') ?
                event.target : event.target.parentElement;

            // Get the day and tab from the button's data attributes
            const day = button.getAttribute('data-day');
            const tab = button.getAttribute('data-tab');

            // Switch to the selected tab
            switchDayRouteTab(day, tab);
        }
    });

    // Automatically activate directions tabs for all days when the page loads
    setTimeout(() => {
        activateAllDirectionsTabs();
    }, 1000);
}

// Function to activate directions tabs for all days
function activateAllDirectionsTabs() {
    console.log('Activating directions tabs for all days');

    // Find all day route tab containers
    const dayRouteTabs = document.querySelectorAll('.day-route-tabs');

    dayRouteTabs.forEach(tabContainer => {
        // Find the day number from a button in this container
        const dayButton = tabContainer.querySelector('.day-route-tab-btn');
        if (dayButton) {
            const day = dayButton.getAttribute('data-day');
            if (day) {
                // Activate the directions tab for this day
                switchDayRouteTab(day, 'directions');

                // Initialize the map in the background to generate route data
                setTimeout(() => {
                    if (typeof initSpecificDayMap === 'function') {
                        // Initialize map but keep directions tab active
                        initSpecificDayMap(day, true);

                        // Switch back to directions tab after map initialization
                        setTimeout(() => {
                            switchDayRouteTab(day, 'directions');
                        }, 100);
                    }
                }, 500);
            }
        }
    });
}

// Function to switch between tabs
function switchDayRouteTab(day, tabName) {
    console.log(`Switching to ${tabName} tab for day ${day}`);

    // Get all tab buttons for this day
    const tabButtons = document.querySelectorAll(`.day-route-tab-btn[data-day="${day}"]`);

    // Get all tab panes for this day
    const tabPanes = document.querySelectorAll(`#day-${day}-map-tab, #day-${day}-list-tab, #day-${day}-directions-tab`);

    // Remove active class from all buttons and panes
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });

    // Add active class to the selected button
    const selectedButton = document.querySelector(`.day-route-tab-btn[data-day="${day}"][data-tab="${tabName}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    // Add active class to the selected pane
    const selectedPane = document.getElementById(`day-${day}-${tabName}-tab`);
    if (selectedPane) {
        selectedPane.classList.add('active');
    }

    // If map tab is selected and the map isn't initialized yet, initialize it
    if (tabName === 'map') {
        const mapElement = document.getElementById(`day-${day}-map`);
        if (mapElement && !mapElement.querySelector('.gm-style')) {
            console.log(`Map for day ${day} not initialized yet, initializing...`);
            if (typeof initSpecificDayMap === 'function') {
                setTimeout(() => {
                    initSpecificDayMap(day);
                }, 100);
            }
        }
    }
}

// Update the displayDayRouteDetails function to populate both list and directions tabs
function updateDayRouteTabs(day, routeDetails, directionsDetails) {
    console.log(`Updating route tabs for day ${day}`);

    // Update the list tab
    const listTab = document.getElementById(`day-${day}-route-details`);
    if (listTab && routeDetails) {
        listTab.innerHTML = routeDetails;
    }

    // Update the directions tab
    const directionsTab = document.getElementById(`day-${day}-directions`);
    if (directionsTab && directionsDetails) {
        directionsTab.innerHTML = directionsDetails;
    }
}

// Function to generate directions HTML from route data
function generateDirectionsHTML(route, distances, durations) {
    if (!route || route.length < 2) {
        return '<p class="directions-placeholder">No route data available.</p>';
    }

    // Get the start and end locations correctly
    const startLocation = route[0].split(',')[0];
    const endLocation = route[route.length-1].split(',')[0];

    let html = '<div class="directions-container">';

    // Add an embedded map at the top
    html += '<div class="directions-map-container">';
    html += `<div id="directions-overview-map" class="directions-overview-map"></div>`;
    html += `<div class="directions-map-overlay">
        <div class="map-location-pins">
            <div class="map-pin start-pin">A</div>
            <div class="map-pin end-pin">B</div>
        </div>
        <div class="map-location-labels">
            <div class="map-label start-label">${startLocation}</div>
            <div class="map-label end-label">${endLocation}</div>
        </div>
    </div>`;
    html += '</div>';

    html += '<h4 class="directions-title">Step-by-Step Directions</h4>';

    // Calculate total distance and time if available
    // Default values for better user experience
    let totalDistance = "~10 km";  // Default approximate total distance
    let totalTime = "~30 min";     // Default approximate total time

    if (distances && distances.length > 0) {
        // Try to calculate total distance
        let distanceSum = 0;
        let hasAllDistances = true;
        let knownDistanceCount = 0;

        for (let i = 0; i < distances.length; i++) {
            const distText = distances[i];
            if (distText && distText !== 'Unknown') {
                // Extract numeric value from distance text (e.g., "5.2 km" -> 5.2)
                const distValue = parseFloat(distText.replace(/[^0-9.]/g, ''));
                const unit = distText.includes('km') ? 'km' : 'm';

                // Convert to meters for calculation
                const distInMeters = unit === 'km' ? distValue * 1000 : distValue;
                distanceSum += distInMeters;
                knownDistanceCount++;
            }
        }

        // If we have at least some distances, estimate the total
        if (knownDistanceCount > 0) {
            // If we have all distances, use the exact sum
            if (knownDistanceCount === distances.length) {
                // Format total distance
                totalDistance = distanceSum < 1000 ?
                    `${Math.round(distanceSum)} m` :
                    `${(distanceSum / 1000).toFixed(1)} km`;
            } else {
                // Otherwise, estimate based on the average of known distances
                const avgDistance = distanceSum / knownDistanceCount;
                const estimatedTotal = avgDistance * distances.length;
                totalDistance = estimatedTotal < 1000 ?
                    `~${Math.round(estimatedTotal)} m` :
                    `~${(estimatedTotal / 1000).toFixed(1)} km`;
            }
        }
    }

    if (durations && durations.length > 0) {
        // Try to calculate total time
        let timeSum = 0;
        let knownTimeCount = 0;

        for (let i = 0; i < durations.length; i++) {
            const timeText = durations[i];
            if (timeText && timeText !== 'Unknown') {
                // Extract hours and minutes
                const hoursMatch = timeText.match(/(\d+)\s*hour/);
                const minutesMatch = timeText.match(/(\d+)\s*min/);

                let timeInMinutes = 0;
                if (hoursMatch) timeInMinutes += parseInt(hoursMatch[1]) * 60;
                if (minutesMatch) timeInMinutes += parseInt(minutesMatch[1]);

                timeSum += timeInMinutes;
                knownTimeCount++;
            }
        }

        // If we have at least some times, estimate the total
        if (knownTimeCount > 0) {
            // If we have all times, use the exact sum
            if (knownTimeCount === durations.length) {
                // Format total time
                const hours = Math.floor(timeSum / 60);
                const minutes = timeSum % 60;

                if (hours > 0) {
                    totalTime = `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? minutes + ' min' : ''}`;
                } else {
                    totalTime = `${minutes} min`;
                }
            } else {
                // Otherwise, estimate based on the average of known times
                const avgTime = timeSum / knownTimeCount;
                const estimatedTotal = avgTime * durations.length;
                const hours = Math.floor(estimatedTotal / 60);
                const minutes = Math.round(estimatedTotal % 60);

                if (hours > 0) {
                    totalTime = `~${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? minutes + ' min' : ''}`;
                } else {
                    totalTime = `~${minutes} min`;
                }
            }
        }
    }

    // Add journey summary below the map with total distance and time
    html += '<div class="journey-summary">';
    html += `<div class="journey-overview">`;
    html += `<div class="journey-icon start-icon">A</div>`;
    html += `<div class="journey-path"></div>`;
    html += `<div class="journey-icon end-icon">B</div>`;
    html += `</div>`;
    html += `<div class="journey-details">`;
    html += `<div class="journey-start"><strong>Start:</strong> ${startLocation}</div>`;
    html += `<div class="journey-end"><strong>End:</strong> ${endLocation}</div>`;
    html += `</div>`;
    html += `<div class="journey-stats">`;
    html += `<div class="journey-stat"><span class="stat-icon">📏</span> <strong>Total Distance:</strong> ${totalDistance}</div>`;
    html += `<div class="journey-stat"><span class="stat-icon">⏱️</span> <strong>Total Time:</strong> ${totalTime}</div>`;
    html += `</div>`;
    html += '</div>';

    // Add each step
    for (let i = 0; i < route.length - 1; i++) {
        const from = route[i].split(',')[0];
        const to = route[i + 1].split(',')[0];
        const distance = distances && distances[i] ? distances[i] : 'Unknown distance';
        const duration = durations && durations[i] ? durations[i] : 'Unknown time';

        html += `<div class="direction-step" data-from="${from}" data-to="${to}">`;
        html += `<div class="direction-number">${i + 1}</div>`;
        html += `<div class="direction-content">`;
        html += `<div class="direction-from-to"><strong>From:</strong> ${from} <strong>To:</strong> ${to}</div>`;

        // Enhanced distance display with default values if unknown
        const displayDistance = distance !== 'Unknown' ? distance : '~2 km';
        const displayDuration = duration !== 'Unknown' ? duration : '~5 min';

        html += `<div class="direction-distance-badge">
            <div class="distance-icon">📏</div>
            <div class="distance-value">${displayDistance}</div>
            <div class="distance-label">shortest distance</div>
        </div>`;

        html += `<div class="direction-details">
            <span class="detail-item"><span class="detail-icon">⏱️</span> ${displayDuration}</span>
        </div>`;

        html += `<div class="direction-action">Head to ${to} from ${from}.</div>`;
        html += `<button class="show-on-map-btn" onclick="showSegmentOnMap('${from}', '${to}', ${i+1})">
            <span class="map-btn-icon">🗺️</span> Show Shortest Path on Map
        </button>`;
        html += `</div>`;
        html += `</div>`;
    }

    html += '</div>';

    // Initialize the overview map after a short delay
    setTimeout(() => {
        initDirectionsOverviewMap(route);
    }, 500);

    // Add script to calculate distances using Haversine formula
    html += `<script>
        // Function to calculate distances using Haversine formula
        function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
            // Convert latitude and longitude from degrees to radians
            const toRadians = (degrees) => degrees * Math.PI / 180;
            const R = 6371; // Radius of the Earth in km

            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);

            const a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c; // Distance in km

            return distance;
        }

        // Function to format distance
        function formatDistance(distance) {
            if (distance < 1) {
                return Math.round(distance * 1000) + ' m';
            } else {
                return distance.toFixed(1) + ' km';
            }
        }

        // Function to estimate travel time based on distance
        function estimateTravelTime(distance) {
            // Assume average speed of 40 km/h in city
            const timeInHours = distance / 40;
            const timeInMinutes = timeInHours * 60;

            if (timeInMinutes < 60) {
                return Math.round(timeInMinutes) + ' min';
            } else {
                const hours = Math.floor(timeInHours);
                const minutes = Math.round((timeInHours - hours) * 60);
                return hours + ' hour' + (hours > 1 ? 's' : '') + (minutes > 0 ? ' ' + minutes + ' min' : '');
            }
        }

        // Function to geocode an address and get coordinates
        function geocodeAddress(address, callback) {
            if (typeof google === 'undefined' || !google.maps) {
                console.error('Google Maps API not loaded');
                // Use fallback coordinates based on city names
                const cityCoordinates = {
                    'Delhi': { lat: 28.6139, lng: 77.2090 },
                    'Mumbai': { lat: 19.0760, lng: 72.8777 },
                    'Kolkata': { lat: 22.5726, lng: 88.3639 },
                    'Chennai': { lat: 13.0827, lng: 80.2707 },
                    'Bangalore': { lat: 12.9716, lng: 77.5946 },
                    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
                    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
                    'Pune': { lat: 18.5204, lng: 73.8567 },
                    'Jaipur': { lat: 26.9124, lng: 75.7873 },
                    'Lucknow': { lat: 26.8467, lng: 80.9462 }
                };

                // Try to match the address to a known city
                for (const city in cityCoordinates) {
                    if (address.includes(city)) {
                        callback(cityCoordinates[city]);
                        return;
                    }
                }

                // If no match, use a default location (center of India)
                callback({ lat: 23.5937, lng: 78.9629 });
                return;
            }

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    callback({ lat: location.lat(), lng: location.lng() });
                } else {
                    console.error('Geocode failed for address: ' + address);
                    // Use a fallback method
                    callback({ lat: 23.5937, lng: 78.9629 }); // Default to center of India
                }
            });
        }

        // Function to calculate distances for direction steps
        function calculateDirectionStepDistances() {
            console.log('Calculating distances for direction steps...');

            // Get all direction steps
            const directionSteps = document.querySelectorAll('.direction-step[data-from][data-to]');

            // Process each step
            directionSteps.forEach(function(step, index) {
                const from = step.getAttribute('data-from');
                const to = step.getAttribute('data-to');

                if (from && to) {
                    // Geocode both addresses
                    geocodeAddress(from, function(fromCoords) {
                        geocodeAddress(to, function(toCoords) {
                            // Calculate distance using Haversine formula
                            const distance = calculateHaversineDistance(
                                fromCoords.lat, fromCoords.lng,
                                toCoords.lat, toCoords.lng
                            );

                            // Add 20% to account for road routes vs straight line
                            const roadDistance = distance * 1.2;
                            const formattedDistance = formatDistance(roadDistance);
                            const estimatedTime = estimateTravelTime(roadDistance);

                            console.log('Step ' + index + ' distance:', formattedDistance, 'time:', estimatedTime);

                            // Find the distance badge in this step
                            const distanceBadge = step.querySelector('.distance-value');
                            if (distanceBadge) {
                                distanceBadge.textContent = formattedDistance;
                            }

                            // Find the duration element
                            const durationElement = step.querySelector('.detail-item .detail-icon + span');
                            if (durationElement) {
                                durationElement.textContent = ' ' + estimatedTime;
                            }
                        });
                    });
                }
            });
        }

        // Try to calculate immediately
        calculateDirectionStepDistances();

        // Also try after a delay
        setTimeout(calculateDirectionStepDistances, 1000);

        // And also when the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            calculateDirectionStepDistances();
        });

        // Also when the window loads
        window.addEventListener('load', function() {
            calculateDirectionStepDistances();
        });
    </script>`;

    return html;
}

// Function to initialize the overview map in the directions view
function initDirectionsOverviewMap(route) {
    const mapElement = document.getElementById('directions-overview-map');
    if (!mapElement) return;

    // Check if Google Maps is available
    if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps API not loaded');
        mapElement.innerHTML = '<div class="map-error">Map could not be loaded</div>';
        return;
    }

    // Create a new map
    const map = new google.maps.Map(mapElement, {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    });

    // Create bounds to contain all points
    const bounds = new google.maps.LatLngBounds();

    // Create geocoder
    const geocoder = new google.maps.Geocoder();

    // Array to store markers
    const markers = [];

    // Function to add marker
    function addMarker(index) {
        if (index >= route.length) {
            // All markers added, create route
            createRoute();
            return;
        }

        geocoder.geocode({ address: route[index] }, (results, status) => {
            if (status === "OK" && results[0]) {
                // Special styling for start and end markers
                let markerIcon;
                let markerLabel;

                if (index === 0) {
                    // Start marker (green)
                    markerIcon = {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "#4CAF50", // Green
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2,
                        scale: 14
                    };
                    markerLabel = {
                        text: "A",
                        color: "white",
                        fontWeight: "bold"
                    };
                } else if (index === route.length - 1) {
                    // End marker (red)
                    markerIcon = {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "#F44336", // Red
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2,
                        scale: 14
                    };
                    markerLabel = {
                        text: "B",
                        color: "white",
                        fontWeight: "bold"
                    };
                } else {
                    // Intermediate markers
                    markerIcon = {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2,
                        scale: 12
                    };
                    markerLabel = {
                        text: (index + 1).toString(),
                        color: "white"
                    };
                }

                const marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    label: markerLabel,
                    icon: markerIcon,
                    animation: index === 0 || index === route.length - 1 ?
                        google.maps.Animation.DROP : null,
                    zIndex: index === 0 || index === route.length - 1 ? 10 : 1
                });

                markers.push(marker);
                bounds.extend(results[0].geometry.location);
                map.fitBounds(bounds);

                // Add next marker
                addMarker(index + 1);
            } else {
                console.error(`Geocoding failed for ${route[index]}: ${status}`);
                // Continue with next marker
                addMarker(index + 1);
            }
        });
    }

    // Function to create route
    function createRoute() {
        // Create directions service and renderer
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: "#4285F4",
                strokeWeight: 5,
                strokeOpacity: 0.7
            }
        });

        // Create waypoints
        const waypoints = route.slice(1, route.length - 1).map(place => ({
            location: place,
            stopover: true
        }));

        // Create request
        const request = {
            origin: route[0],
            destination: route[route.length - 1],
            waypoints: waypoints,
            optimizeWaypoints: false, // We've already optimized
            travelMode: google.maps.TravelMode.DRIVING
        };

        // Get directions
        directionsService.route(request, (result, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(result);

                // Add distance labels along the route
                addDistanceLabels(result, map);

                // Store the directions result for later use
                window.currentDirectionsResult = result;
            } else {
                console.error(`Directions request failed: ${status}`);
            }
        });
    }

    // Function to add distance labels along the route
    function addDistanceLabels(directionsResult, map) {
        if (!directionsResult || !directionsResult.routes || !directionsResult.routes[0]) return;

        const legs = directionsResult.routes[0].legs;

        // Add a label for each leg of the journey
        legs.forEach((leg, index) => {
            // Skip very short legs to avoid cluttering the map
            if (leg.distance.value < 500) return; // Skip legs shorter than 500 meters

            // Find the midpoint of this leg's path
            const steps = leg.steps;
            const midStep = steps[Math.floor(steps.length / 2)];
            const midPath = midStep.path || midStep.lat_lngs;

            if (midPath && midPath.length > 0) {
                const midPoint = midPath[Math.floor(midPath.length / 2)];

                // Create a custom overlay for the distance label
                const distanceLabel = new google.maps.Marker({
                    position: midPoint,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 0, // Makes the marker invisible
                    },
                    label: {
                        text: leg.distance.text,
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontWeight: "bold"
                    },
                    zIndex: 1000
                });

                // Create a custom overlay for the background
                const labelBackground = new google.maps.Marker({
                    position: midPoint,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "#4285F4",
                        fillOpacity: 0.9,
                        strokeWeight: 0,
                        scale: 7
                    },
                    zIndex: 999
                });

                // Store the markers for potential removal later
                if (!window.distanceLabels) window.distanceLabels = [];
                window.distanceLabels.push(distanceLabel);
                window.distanceLabels.push(labelBackground);
            }
        });

        // Add a "Total Distance" label at the bottom of the map
        const totalDistance = legs.reduce((total, leg) => total + leg.distance.value, 0);
        const formattedTotalDistance = totalDistance < 1000 ?
            `${totalDistance} m` :
            `${(totalDistance / 1000).toFixed(1)} km`;

        // Create the total distance info div
        const totalDistanceDiv = document.createElement('div');
        totalDistanceDiv.className = 'total-distance-info';
        totalDistanceDiv.innerHTML = `
            <div class="total-distance-label">Total Distance (Shortest Path)</div>
            <div class="total-distance-value">${formattedTotalDistance}</div>
        `;

        // Add the div to the map
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(totalDistanceDiv);
    }

    // Start adding markers
    addMarker(0);
}

// Function to show a specific segment on the map
function showSegmentOnMap(from, to, stepNumber) {
    console.log(`Showing segment from ${from} to ${to} (Step ${stepNumber})`);

    const mapElement = document.getElementById('directions-overview-map');
    if (!mapElement) return;

    // Check if Google Maps is available
    if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps API not loaded');
        return;
    }

    // Get the map instance
    const map = mapElement.__gm_map;
    if (!map) {
        console.error('Map instance not found');
        return;
    }

    // Find the distance and duration for this segment
    let segmentDistance = "Unknown";
    let segmentDuration = "Unknown";

    // Try to get the distance from the stored directions result
    if (window.currentDirectionsResult &&
        window.currentDirectionsResult.routes &&
        window.currentDirectionsResult.routes[0] &&
        window.currentDirectionsResult.routes[0].legs) {

        const legs = window.currentDirectionsResult.routes[0].legs;

        // Find the leg that matches our from/to
        for (let i = 0; i < legs.length; i++) {
            const leg = legs[i];
            const legStart = leg.start_address.split(',')[0];
            const legEnd = leg.end_address.split(',')[0];

            if (legStart.includes(from) || from.includes(legStart)) {
                if (legEnd.includes(to) || to.includes(legEnd)) {
                    segmentDistance = leg.distance.text;
                    segmentDuration = leg.duration.text;
                    break;
                }
            }
        }
    }

    // Create geocoder
    const geocoder = new google.maps.Geocoder();

    // Geocode both locations
    geocoder.geocode({ address: from }, (fromResults, fromStatus) => {
        if (fromStatus === "OK" && fromResults[0]) {
            geocoder.geocode({ address: to }, (toResults, toStatus) => {
                if (toStatus === "OK" && toResults[0]) {
                    // Create bounds that include both points
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(fromResults[0].geometry.location);
                    bounds.extend(toResults[0].geometry.location);

                    // Fit the map to these bounds with some padding
                    map.fitBounds(bounds, { padding: { top: 50, right: 50, bottom: 50, left: 50 } });

                    // Calculate the midpoint for the distance label
                    const midLat = (fromResults[0].geometry.location.lat() + toResults[0].geometry.location.lat()) / 2;
                    const midLng = (fromResults[0].geometry.location.lng() + toResults[0].geometry.location.lng()) / 2;
                    const midPoint = new google.maps.LatLng(midLat, midLng);

                    // Add a temporary line between the points
                    const line = new google.maps.Polyline({
                        path: [
                            fromResults[0].geometry.location,
                            toResults[0].geometry.location
                        ],
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 6,
                        map: map
                    });

                    // Add markers for the from and to locations
                    const fromMarker = new google.maps.Marker({
                        position: fromResults[0].geometry.location,
                        map: map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: "#4CAF50",
                            fillOpacity: 1,
                            strokeColor: "#FFFFFF",
                            strokeWeight: 2,
                            scale: 14
                        },
                        label: {
                            text: "A",
                            color: "white",
                            fontWeight: "bold"
                        },
                        animation: google.maps.Animation.DROP
                    });

                    const toMarker = new google.maps.Marker({
                        position: toResults[0].geometry.location,
                        map: map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: "#F44336",
                            fillOpacity: 1,
                            strokeColor: "#FFFFFF",
                            strokeWeight: 2,
                            scale: 14
                        },
                        label: {
                            text: "B",
                            color: "white",
                            fontWeight: "bold"
                        },
                        animation: google.maps.Animation.DROP
                    });

                    // Add info windows with enhanced content
                    const fromInfo = new google.maps.InfoWindow({
                        content: `
                            <div style="padding: 8px; max-width: 200px;">
                                <div style="font-weight: bold; color: #4CAF50; margin-bottom: 5px;">START POINT</div>
                                <div style="font-weight: bold; font-size: 14px;">${from}</div>
                            </div>
                        `
                    });

                    const toInfo = new google.maps.InfoWindow({
                        content: `
                            <div style="padding: 8px; max-width: 200px;">
                                <div style="font-weight: bold; color: #F44336; margin-bottom: 5px;">END POINT</div>
                                <div style="font-weight: bold; font-size: 14px;">${to}</div>
                                <div style="margin-top: 5px; font-size: 12px;">
                                    <strong>Distance:</strong> ${segmentDistance} | <strong>Time:</strong> ${segmentDuration}
                                </div>
                            </div>
                        `
                    });

                    // Add a distance label at the midpoint
                    const distanceLabel = new google.maps.Marker({
                        position: midPoint,
                        map: map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: "#4285F4",
                            fillOpacity: 0.9,
                            strokeWeight: 2,
                            strokeColor: "#FFFFFF",
                            scale: 12
                        },
                        label: {
                            text: segmentDistance,
                            color: "#FFFFFF",
                            fontSize: "10px",
                            fontWeight: "bold"
                        },
                        zIndex: 1000
                    });

                    // Add a "Shortest Path" overlay
                    const shortestPathDiv = document.createElement('div');
                    shortestPathDiv.className = 'shortest-path-overlay';
                    shortestPathDiv.innerHTML = `
                        <div class="shortest-path-content">
                            <div class="shortest-path-title">Shortest Path</div>
                            <div class="shortest-path-details">
                                <div><strong>From:</strong> ${from}</div>
                                <div><strong>To:</strong> ${to}</div>
                                <div><strong>Distance:</strong> ${segmentDistance}</div>
                                <div><strong>Travel Time:</strong> ${segmentDuration}</div>
                            </div>
                        </div>
                    `;

                    // Add the div to the map
                    map.controls[google.maps.ControlPosition.TOP_CENTER].push(shortestPathDiv);

                    fromInfo.open(map, fromMarker);
                    toInfo.open(map, toMarker);

                    // Remove everything after 8 seconds
                    setTimeout(() => {
                        line.setMap(null);
                        fromMarker.setMap(null);
                        toMarker.setMap(null);
                        distanceLabel.setMap(null);
                        fromInfo.close();
                        toInfo.close();

                        // Remove the shortest path overlay
                        if (shortestPathDiv.parentNode) {
                            shortestPathDiv.parentNode.removeChild(shortestPathDiv);
                        }

                        // Reinitialize the overview map
                        initDirectionsOverviewMap(window.currentRoute);
                    }, 8000);
                }
            });
        }
    });
}

// Function to highlight a specific segment of the route on the map
function highlightRouteSegment(from, to, stepNumber) {
    console.log(`Highlighting route segment from ${from} to ${to} (Step ${stepNumber})`);

    // Switch to the map tab
    const dayNumber = getCurrentDayNumber();
    if (dayNumber) {
        switchDayRouteTab(dayNumber, 'map');

        // Add a visual indicator on the map
        const mapElement = document.getElementById(`day-${dayNumber}-map`);
        if (mapElement) {
            // Create or update the highlight overlay
            let highlightOverlay = mapElement.querySelector('.segment-highlight-overlay');
            if (!highlightOverlay) {
                highlightOverlay = document.createElement('div');
                highlightOverlay.className = 'segment-highlight-overlay';
                mapElement.appendChild(highlightOverlay);
            }

            // Show the highlight with animation
            highlightOverlay.innerHTML = `
                <div class="segment-highlight">
                    <div class="segment-info">
                        <div class="segment-step">Step ${stepNumber}</div>
                        <div class="segment-places">${from} → ${to}</div>
                    </div>
                </div>
            `;

            // Make it visible with animation
            highlightOverlay.style.display = 'flex';
            setTimeout(() => {
                highlightOverlay.classList.add('active');

                // Hide after 5 seconds
                setTimeout(() => {
                    highlightOverlay.classList.remove('active');
                    setTimeout(() => {
                        highlightOverlay.style.display = 'none';
                    }, 500);
                }, 5000);
            }, 100);

            // Try to center the map on this segment
            if (typeof google !== 'undefined' && google.maps) {
                // Find the map instance
                const mapInstance = findMapInstance(mapElement);
                if (mapInstance) {
                    // Create geocoder
                    const geocoder = new google.maps.Geocoder();

                    // Geocode both locations
                    geocoder.geocode({ address: from }, (fromResults, fromStatus) => {
                        if (fromStatus === "OK" && fromResults[0]) {
                            geocoder.geocode({ address: to }, (toResults, toStatus) => {
                                if (toStatus === "OK" && toResults[0]) {
                                    // Create bounds that include both points
                                    const bounds = new google.maps.LatLngBounds();
                                    bounds.extend(fromResults[0].geometry.location);
                                    bounds.extend(toResults[0].geometry.location);

                                    // Fit the map to these bounds
                                    mapInstance.fitBounds(bounds);

                                    // Add a temporary line between the points
                                    const line = new google.maps.Polyline({
                                        path: [
                                            fromResults[0].geometry.location,
                                            toResults[0].geometry.location
                                        ],
                                        geodesic: true,
                                        strokeColor: '#FF0000',
                                        strokeOpacity: 1.0,
                                        strokeWeight: 6,
                                        map: mapInstance
                                    });

                                    // Remove the line after 5 seconds
                                    setTimeout(() => {
                                        line.setMap(null);
                                    }, 5000);
                                }
                            });
                        }
                    });
                }
            }
        }
    }
}

// Helper function to find the Google Maps instance in a container
function findMapInstance(mapElement) {
    // Look for the map instance in the element's data
    if (mapElement && mapElement.__gm_map) {
        return mapElement.__gm_map;
    }

    // Try to find it by looking for the Google Maps elements
    const gmStyleElement = mapElement.querySelector('.gm-style');
    if (gmStyleElement && gmStyleElement.__gm_map) {
        return gmStyleElement.__gm_map;
    }

    // If we can't find it, return null
    return null;
}

// Helper function to get the current day number from the active tab
function getCurrentDayNumber() {
    const activeTabBtn = document.querySelector('.day-route-tab-btn.active');
    if (activeTabBtn) {
        return activeTabBtn.getAttribute('data-day');
    }
    return null;
}

// Initialize tabs when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDayRouteTabs();
});

// Export functions for use in other scripts
window.switchDayRouteTab = switchDayRouteTab;
window.updateDayRouteTabs = updateDayRouteTabs;
window.generateDirectionsHTML = generateDirectionsHTML;
window.highlightRouteSegment = highlightRouteSegment;
window.initDirectionsOverviewMap = initDirectionsOverviewMap;
window.showSegmentOnMap = showSegmentOnMap;
