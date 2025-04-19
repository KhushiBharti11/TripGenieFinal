// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Main.js loaded");

    // Hide welcome screen after 3 seconds and show main content
    setTimeout(() => {
        const welcomeScreen = document.getElementById("welcome-screen");
        const mainContent = document.getElementById("main-content");
        if (welcomeScreen && mainContent) {
            welcomeScreen.style.display = "none";
            mainContent.style.display = "block";
        }
    }, 3000);

    // Tab navigation
    const tabLinks = document.querySelectorAll('.tab-link');
    if (tabLinks.length > 0) {
        console.log("Found tab links:", tabLinks.length);
        tabLinks.forEach(tab => {
            tab.addEventListener('click', function(event) {
                event.preventDefault();
                const tabId = this.getAttribute('data-tab');
                console.log("Tab clicked:", tabId);

                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });

                // Remove active class from all tabs
                tabLinks.forEach(tab => {
                    tab.classList.remove('active');
                });

                // Show the selected tab content
                const selectedTab = document.getElementById(tabId);
                if (selectedTab) {
                    selectedTab.style.display = 'block';
                    console.log("Showing tab:", tabId);
                } else {
                    console.error("Tab content not found:", tabId);
                }

                // Add active class to the clicked tab
                this.classList.add('active');
            });
        });
    } else {
        console.error("No tab links found");

        // Fallback: Try to find tabs with class 'tab-item'
        const altTabLinks = document.querySelectorAll('.tab-item');
        if (altTabLinks.length > 0) {
            console.log("Found alternative tab links:", altTabLinks.length);
            altTabLinks.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    console.log("Alt tab clicked:", tabId);

                    // Hide all tab contents
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.style.display = 'none';
                    });

                    // Remove active class from all tabs
                    altTabLinks.forEach(tab => {
                        tab.classList.remove('active');
                    });

                    // Show the selected tab content
                    const selectedTab = document.getElementById(tabId);
                    if (selectedTab) {
                        selectedTab.style.display = 'block';
                        console.log("Showing alt tab:", tabId);
                    } else {
                        console.error("Alt tab content not found:", tabId);
                    }

                    // Add active class to the clicked tab
                    this.classList.add('active');
                });
            });
        }
    }

    // Booking tab navigation
    const bookingTabs = document.querySelectorAll('.booking-tab');
    if (bookingTabs.length > 0) {
        console.log("Found booking tabs:", bookingTabs.length);
        bookingTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                toggleBookingTab(tabId);
            });
        });
    }

    // Initialize search buttons
    const searchHotelsButton = document.querySelector('button[onclick="searchHotels()"]');
    if (searchHotelsButton) {
        searchHotelsButton.addEventListener('click', function() {
            if (typeof searchHotels === 'function') {
                searchHotels();
            } else {
                console.error("searchHotels function not found");
            }
        });
    }

    const searchFlightsButton = document.querySelector('button[onclick="searchFlights()"]');
    if (searchFlightsButton) {
        searchFlightsButton.addEventListener('click', function() {
            if (typeof searchFlights === 'function') {
                searchFlights();
            } else {
                console.error("searchFlights function not found");
            }
        });
    }

    const searchTrainsButton = document.querySelector('button[onclick="searchTrains()"]');
    if (searchTrainsButton) {
        searchTrainsButton.addEventListener('click', function() {
            if (typeof searchTrains === 'function') {
                searchTrains();
            } else {
                console.error("searchTrains function not found");
            }
        });
    }

    // Set default dates for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    if (dateInputs.length > 0) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        dateInputs.forEach(input => {
            input.value = tomorrowStr;
        });
    }

    // Initialize the page - show home tab by default
    const homeTab = document.getElementById('home');
    if (homeTab) {
        homeTab.style.display = 'block';
        const homeTabLink = document.querySelector('[data-tab="home"]');
        if (homeTabLink) {
            homeTabLink.classList.add('active');
        }
    }

    // Explicitly initialize the destinations tab
    if (typeof loadPopularDestinations === 'function') {
        console.log("Explicitly calling loadPopularDestinations");
        loadPopularDestinations();
    } else {
        console.error("loadPopularDestinations function not found");
    }

    // Initialize the Gemini trip planning functionality
    const generateItineraryBtn = document.getElementById('generate-itinerary');
    if (generateItineraryBtn) {
        generateItineraryBtn.addEventListener('click', generateItinerary);
    }

    // Add direct handlers for login and register buttons
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if (loginBtn) {
        console.log("Adding login button handler from main.js");
        loginBtn.onclick = function() {
            console.log("Login button clicked from main.js handler");
            // The actual login logic is in profile.js
        };
    }

    if (registerBtn) {
        console.log("Adding register button handler from main.js");
        registerBtn.onclick = function() {
            console.log("Register button clicked from main.js handler");
            // The actual register logic is in profile.js
        };
    }

    // Destinations search functionality is now handled in destinations.js
});

// Destination search and display functionality has been moved to destinations.js

// Simple function to switch tabs
function switchTab(tabId) {
    console.log("Switching to tab:", tabId);

    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
    });

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to the clicked nav link
    const activeLink = document.querySelector(`nav ul li a[onclick*="'${tabId}'"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        console.log("Active link set:", activeLink.textContent);
    } else {
        console.log("Could not find active link for tab:", tabId);
    }

    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        console.log("Tab displayed:", tabId);

        // If booking tab is selected, automatically select the first booking option
        if (tabId === 'booking') {
            setTimeout(() => {
                const firstBookingTab = document.querySelector('.booking-tab');
                if (firstBookingTab) {
                    firstBookingTab.click();
                }
            }, 100);
        }
    }
}

// Simple function to toggle between booking tabs
function toggleBookingTab(tabId) {
    console.log("Toggling booking tab:", tabId);

    // Hide all booking tab content
    const allTabs = document.querySelectorAll('.booking-tab-content');
    allTabs.forEach(tab => {
        tab.style.display = 'none';
    });

    // Remove active class from all booking tab buttons
    const allTabButtons = document.querySelectorAll('.booking-tab');
    allTabButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked tab button
    const activeButton = document.querySelector(`.booking-tab[onclick*="'${tabId}'"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
}

// Function to open Trivago search
function openTrivago() {
    const city = document.getElementById('hotel-city').value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const trivagoUrl = `https://www.trivago.in/en-IN/srl?search=${encodeURIComponent(city)}`;
    window.open(trivagoUrl, '_blank');
}

// Function to generate travel itinerary using Gemini AI
function generateItinerary() {
    console.log('generateItinerary function called');
    const destination = document.getElementById('destination').value.trim();
    const days = document.getElementById('days').value;
    const persons = document.getElementById('persons').value;

    // Get selected preferences
    const preferencesElements = document.querySelectorAll('input[name="travel-preferences"]:checked');
    const preferences = Array.from(preferencesElements).map(el => el.value);

    console.log('Destination:', destination);
    console.log('Days:', days);
    console.log('Persons:', persons);
    console.log('Preferences:', preferences);

    if (!destination) {
        alert('Please enter a destination city');
        return;
    }

    // Check if the input looks like a country rather than a city
    const commonCountries = ['india', 'usa', 'uk', 'australia', 'japan', 'china', 'france', 'germany', 'italy', 'spain', 'thailand', 'singapore', 'malaysia', 'indonesia', 'vietnam', 'cambodia', 'laos', 'myanmar', 'philippines', 'south korea', 'north korea', 'russia', 'canada', 'mexico', 'brazil', 'argentina', 'chile', 'peru', 'colombia', 'venezuela', 'egypt', 'south africa', 'kenya', 'morocco', 'nigeria', 'ghana', 'ethiopia', 'tanzania', 'uganda', 'rwanda', 'burundi', 'zimbabwe', 'zambia', 'malawi', 'mozambique', 'namibia', 'botswana', 'lesotho', 'swaziland', 'mauritius', 'seychelles', 'madagascar', 'comoros', 'djibouti', 'eritrea', 'somalia', 'sudan', 'south sudan', 'chad', 'niger', 'mali', 'mauritania', 'senegal', 'gambia', 'guinea', 'guinea-bissau', 'sierra leone', 'liberia', 'ivory coast', 'burkina faso', 'ghana', 'togo', 'benin', 'cameroon', 'central african republic', 'gabon', 'congo', 'democratic republic of congo', 'angola', 'equatorial guinea', 'sao tome and principe', 'cape verde', 'algeria', 'tunisia', 'libya', 'morocco', 'western sahara', 'mauritania', 'mali', 'niger', 'chad', 'sudan', 'eritrea', 'djibouti', 'somalia', 'ethiopia', 'kenya', 'uganda', 'rwanda', 'burundi', 'tanzania', 'malawi', 'mozambique', 'zambia', 'zimbabwe', 'botswana', 'namibia', 'south africa', 'lesotho', 'swaziland', 'madagascar', 'comoros', 'mauritius', 'seychelles', 'reunion', 'mayotte', 'saint helena', 'ascension and tristan da cunha', 'falkland islands', 'south georgia and the south sandwich islands', 'bouvet island', 'heard island and mcdonald islands', 'french southern territories', 'antarctica', 'united states', 'canada', 'mexico', 'guatemala', 'belize', 'el salvador', 'honduras', 'nicaragua', 'costa rica', 'panama', 'bahamas', 'cuba', 'jamaica', 'haiti', 'dominican republic', 'puerto rico', 'virgin islands', 'anguilla', 'saint kitts and nevis', 'antigua and barbuda', 'montserrat', 'dominica', 'saint lucia', 'saint vincent and the grenadines', 'barbados', 'grenada', 'trinidad and tobago', 'aruba', 'curacao', 'bonaire', 'sint eustatius and saba', 'sint maarten', 'saint martin', 'guadeloupe', 'martinique', 'saint barthelemy', 'haiti', 'turks and caicos islands', 'cayman islands', 'jamaica', 'cuba', 'bahamas', 'bermuda', 'greenland', 'saint pierre and miquelon', 'united states minor outlying islands', 'united states virgin islands', 'british virgin islands', 'caribbean netherlands', 'saint martin', 'saint barthelemy', 'saint pierre and miquelon', 'saint helena', 'ascension and tristan da cunha', 'falkland islands', 'south georgia and the south sandwich islands', 'bouvet island', 'heard island and mcdonald islands', 'french southern territories', 'antarctica'];

    if (commonCountries.includes(destination.toLowerCase())) {
        alert('Please enter a specific city name, not a country. For example, enter "Delhi" instead of "India".');
        return;
    }

    // Show loading spinner
    const loadingElement = document.getElementById('itinerary-loading');
    const resultElement = document.getElementById('itinerary-result');

    if (loadingElement) loadingElement.style.display = 'block';
    if (resultElement) resultElement.innerHTML = '';

    // Since the backend API might not be available, let's generate a sample itinerary
    setTimeout(() => {
        // Hide loading spinner
        if (loadingElement) loadingElement.style.display = 'none';

        // Generate a sample itinerary
        const sampleItinerary = generateSampleItinerary(destination, days, persons, preferences);

        // Display the itinerary
        if (resultElement) {
            resultElement.innerHTML = `
                <h3>${days}-Day Itinerary for ${destination} (${persons} ${persons === '1' ? 'Person' : 'Persons'})</h3>
                <div class="itinerary-content">
                    ${formatItinerary(sampleItinerary)}
                </div>
                <div class="itinerary-actions">
                    <button onclick="printItinerary()" class="action-button">Print Itinerary</button>
                    <button onclick="saveItinerary()" class="action-button">Save Itinerary</button>
                </div>
            `;
        }
    }, 2000); // Simulate a 2-second delay for API response
}

// Function to generate a sample itinerary when the API is not available
function generateSampleItinerary(destination, days, persons, preferences) {
    // Create a sample itinerary based on the destination and preferences
    let itinerary = `# ${days}-Day Itinerary for ${destination} (${persons} ${persons === '1' ? 'Person' : 'Persons'})\n\n`;

    // Add a brief introduction
    itinerary += `Welcome to your personalized itinerary for ${destination}! Based on your preferences (${preferences.join(', ')}), we've created a ${days}-day plan for ${persons} ${persons === '1' ? 'person' : 'persons'} to help you explore this amazing destination.\n\n`;

    // Generate budget information

    // Determine budget category based on preferences
    let budgetCategory = "Moderate";
    if (preferences.includes('Budget-friendly')) {
        budgetCategory = "Budget";
    } else if (preferences.includes('Luxury')) {
        budgetCategory = "Luxury";
    }

    // Get hotel category
    const hotelCategory = document.getElementById('hotel-category').value;

    // Base costs per person per day (reduced for more reasonable budgets)
    const baseCostsPerPerson = {
        "Budget": {
            food: { min: 300, max: 600 },
            activities: { min: 200, max: 400 },
            misc: { min: 100, max: 200 }
        },
        "Moderate": {
            food: { min: 600, max: 1000 },
            activities: { min: 400, max: 800 },
            misc: { min: 200, max: 400 }
        },
        "Luxury": {
            food: { min: 1000, max: 2000 },
            activities: { min: 800, max: 1500 },
            misc: { min: 400, max: 800 }
        }
    }[budgetCategory];

    // Hotel costs per room (not per person) - adjusted to be more reasonable
    const hotelCostsPerRoom = {
        "budget": { min: 800, max: 1500 },
        "moderate": { min: 1500, max: 3500 },
        "luxury": { min: 3500, max: 8000 }
    }[hotelCategory];

    // Transportation costs (shared among the group) - adjusted to be more reasonable
    const transportationCosts = {
        "Budget": {
            description: "Public transportation (buses, metros)",
            costPerDay: { min: 50, max: 100 },
            costPerGroup: { min: 150, max: 300 } // Slightly higher for group as sometimes multiple trips needed
        },
        "Moderate": {
            description: "Mix of public transport and occasional cabs",
            costPerDay: { min: 100, max: 250 },
            costPerGroup: { min: 300, max: 600 }
        },
        "Luxury": {
            description: "AC cabs and private transportation",
            costPerDay: { min: 300, max: 600 },
            costPerGroup: { min: 600, max: 1200 }
        }
    }[budgetCategory];

    const personsNum = parseInt(persons);

    // Calculate number of rooms needed (assuming 2 persons per room)
    const roomsNeeded = Math.ceil(personsNum / 2);

    // Calculate daily costs
    const accommodationPerDay = {
        min: hotelCostsPerRoom.min * roomsNeeded,
        max: hotelCostsPerRoom.max * roomsNeeded
    };

    const foodPerDay = {
        min: baseCostsPerPerson.food.min * personsNum,
        max: baseCostsPerPerson.food.max * personsNum
    };

    // Transportation is shared for the group with some scaling
    const transportationPerDay = {
        min: personsNum <= 2 ? transportationCosts.costPerDay.min * personsNum : transportationCosts.costPerGroup.min,
        max: personsNum <= 2 ? transportationCosts.costPerDay.max * personsNum : transportationCosts.costPerGroup.max
    };

    const activitiesPerDay = {
        min: baseCostsPerPerson.activities.min * personsNum,
        max: baseCostsPerPerson.activities.max * personsNum
    };

    const miscPerDay = {
        min: baseCostsPerPerson.misc.min * personsNum,
        max: baseCostsPerPerson.misc.max * personsNum
    };

    // Calculate total daily budget
    const totalDailyBudget = {
        min: accommodationPerDay.min + foodPerDay.min + transportationPerDay.min + activitiesPerDay.min + miscPerDay.min,
        max: accommodationPerDay.max + foodPerDay.max + transportationPerDay.max + activitiesPerDay.max + miscPerDay.max
    };

    // Calculate total trip budget
    const totalBudget = {
        min: Math.round(totalDailyBudget.min * days),
        max: Math.round(totalDailyBudget.max * days)
    };

    // Add budget breakdown with improved clarity
    itinerary += `## Budget Estimate (${budgetCategory} Category)\n\n`;
    itinerary += `**Total Trip Cost for ${persons} ${persons === '1' ? 'Person' : 'Persons'}:** ₹${totalBudget.min.toLocaleString()} - ₹${totalBudget.max.toLocaleString()} for ${days} days\n\n`;
    itinerary += `**Per Person Cost for Entire Trip:** ₹${Math.round(totalBudget.min/personsNum).toLocaleString()} - ₹${Math.round(totalBudget.max/personsNum).toLocaleString()}\n\n`;

    // Add note about shared accommodations
    if (personsNum > 1) {
        itinerary += `*Note: This budget assumes ${roomsNeeded} hotel room${roomsNeeded > 1 ? 's' : ''} shared by ${personsNum} people and shared transportation costs.*\n\n`;
    }

    itinerary += `**Daily Expenses Breakdown:**\n\n`;
    itinerary += `- **Accommodation:** ₹${accommodationPerDay.min.toLocaleString()} - ₹${accommodationPerDay.max.toLocaleString()} per night total (${roomsNeeded} ${hotelCategory} room${roomsNeeded > 1 ? 's' : ''})\n`;
    itinerary += `- **Food:** ₹${Math.round(foodPerDay.min/personsNum).toLocaleString()} - ₹${Math.round(foodPerDay.max/personsNum).toLocaleString()} per person per day\n`;
    itinerary += `- **Transportation:** ₹${Math.round(transportationPerDay.min/personsNum).toLocaleString()} - ₹${Math.round(transportationPerDay.max/personsNum).toLocaleString()} per person per day (${transportationCosts.description})\n`;
    itinerary += `- **Activities & Sightseeing:** ₹${Math.round(activitiesPerDay.min/personsNum).toLocaleString()} - ₹${Math.round(activitiesPerDay.max/personsNum).toLocaleString()} per person per day\n`;
    itinerary += `- **Miscellaneous:** ₹${Math.round(miscPerDay.min/personsNum).toLocaleString()} - ₹${Math.round(miscPerDay.max/personsNum).toLocaleString()} per person per day\n\n`;

    // Generate daily plans
    for (let day = 1; day <= days; day++) {
        itinerary += `## Day ${day}\n\n`;

        // Morning activities
        itinerary += `### Morning\n\n`;

        // Generate specific restaurant names based on destination
        const breakfastPlace = getRandomRestaurant(destination, "breakfast", preferences);
        itinerary += `- Breakfast at **${breakfastPlace}** to experience the authentic flavors of ${destination} [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(breakfastPlace + ' ' + destination)})\n`;

        // Generate specific attraction names based on destination and preferences
        const morningAttraction = getRandomAttraction(destination, [], preferences);
        itinerary += `- Visit **${morningAttraction}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(morningAttraction + ' ' + destination)})\n`;

        // Add preference-specific morning activities
        if (preferences.includes('Shopping')) {
            const market = getRandomMarket(destination);
            itinerary += `- Explore **${market}** for local shopping [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(market + ' ' + destination)})\n`;
        } else if (preferences.includes('Nature')) {
            const natureSpot = getRandomNatureSpot(destination);
            itinerary += `- Explore **${natureSpot}** to enjoy the natural beauty [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(natureSpot + ' ' + destination)})\n`;
        } else {
            itinerary += `- Explore the local markets and shops\n`;
        }
        itinerary += `\n`;

        // Afternoon activities
        itinerary += `### Afternoon\n\n`;

        // Lunch based on food preferences
        let lunchPlace;
        if (preferences.includes('Vegetarian')) {
            lunchPlace = getRandomVegetarianRestaurant(destination);
            itinerary += `- Enjoy vegetarian lunch at **${lunchPlace}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lunchPlace + ' ' + destination)})\n`;
        } else if (preferences.includes('Non-Vegetarian')) {
            lunchPlace = getRandomNonVegRestaurant(destination);
            itinerary += `- Enjoy non-vegetarian specialties at **${lunchPlace}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lunchPlace + ' ' + destination)})\n`;
        } else {
            lunchPlace = getRandomRestaurant(destination, "lunch", preferences);
            itinerary += `- Enjoy lunch at **${lunchPlace}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lunchPlace + ' ' + destination)})\n`;
        }

        // Afternoon attraction based on preferences
        let afternoonAttraction;
        if (preferences.includes('Historical')) {
            afternoonAttraction = getRandomHistoricalSite(destination, [morningAttraction]);
            itinerary += `- Visit the historical site **${afternoonAttraction}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(afternoonAttraction + ' ' + destination)})\n`;
        } else if (preferences.includes('Art')) {
            afternoonAttraction = getRandomArtMuseum(destination, [morningAttraction]);
            itinerary += `- Visit **${afternoonAttraction}** to appreciate art and culture [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(afternoonAttraction + ' ' + destination)})\n`;
        } else if (preferences.includes('Religious')) {
            afternoonAttraction = getRandomReligiousSite(destination, [morningAttraction]);
            itinerary += `- Visit the spiritual site **${afternoonAttraction}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(afternoonAttraction + ' ' + destination)})\n`;
        } else {
            afternoonAttraction = getRandomAttraction(destination, [morningAttraction], preferences);
            itinerary += `- Visit **${afternoonAttraction}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(afternoonAttraction + ' ' + destination)})\n`;
        }

        // Add relaxation activity based on preferences
        if (preferences.includes('Relaxed')) {
            const relaxSpot = getRandomRelaxationSpot(destination);
            itinerary += `- Relax at **${relaxSpot}** to recharge [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(relaxSpot + ' ' + destination)})\n`;
        } else if (preferences.includes('Adventure')) {
            const adventureActivity = getRandomAdventureActivity(destination);
            itinerary += `- Experience the thrill of **${adventureActivity}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adventureActivity + ' ' + destination)})\n`;
        } else {
            itinerary += `- Take some time to relax and soak in the local atmosphere\n`;
        }
        itinerary += `\n`;

        // Evening activities
        itinerary += `### Evening\n\n`;

        // Dinner based on preferences
        let dinnerPlace;
        if (preferences.includes('Luxury')) {
            dinnerPlace = getRandomLuxuryRestaurant(destination);
            itinerary += `- Enjoy a luxurious dinner at **${dinnerPlace}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dinnerPlace + ' ' + destination)})\n`;
        } else if (preferences.includes('Budget-friendly')) {
            dinnerPlace = getRandomBudgetRestaurant(destination);
            itinerary += `- Enjoy an affordable yet delicious dinner at **${dinnerPlace}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dinnerPlace + ' ' + destination)})\n`;
        } else if (preferences.includes('Food')) {
            dinnerPlace = getRandomFamousRestaurant(destination);
            itinerary += `- Experience the best local cuisine at **${dinnerPlace}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dinnerPlace + ' ' + destination)})\n`;
        } else {
            dinnerPlace = getRandomRestaurant(destination, "dinner", preferences);
            itinerary += `- Dinner at **${dinnerPlace}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dinnerPlace + ' ' + destination)})\n`;
        }

        // Add preference-specific evening activities
        if (preferences.includes('Nightlife')) {
            const nightlifeSpot = getRandomNightlifeSpot(destination);
            itinerary += `- Experience the vibrant nightlife at **${nightlifeSpot}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nightlifeSpot + ' ' + destination)})\n`;
        }
        if (preferences.includes('Cultural')) {
            const culturalShow = getRandomCulturalShow(destination);
            itinerary += `- Attend **${culturalShow}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(culturalShow + ' ' + destination)})\n`;
        }
        if (preferences.includes('Food')) {
            const foodTour = `${destination} Food Walking Tour`;
            itinerary += `- Try a food tasting tour: **${foodTour}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('food tour ' + destination)})\n`;
        }
        if (preferences.includes('Photography')) {
            const photoSpot = getRandomPhotoSpot(destination);
            itinerary += `- Capture beautiful evening shots at **${photoSpot}** [🗺️](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(photoSpot + ' ' + destination)})\n`;
        }

        itinerary += `\n`;
    }

    // Add a conclusion
    itinerary += `## Additional Information\n\n`;
    itinerary += `- **Best time to visit:** Year-round, but spring and fall offer the most pleasant weather\n`;
    itinerary += `- **Local transportation:** Public transit, taxis, and ride-sharing services are readily available\n`;
    itinerary += `- **Currency:** Make sure to have some local currency for small purchases\n`;
    itinerary += `- **Emergency contacts:** Police: 100, Ambulance: 108, Tourist Helpline: 1363\n`;

    return itinerary;
}

// Helper functions to generate specific names for the itinerary
function getRandomRestaurant(destination, mealType, preferences = []) {
    const restaurants = {
        "Delhi": {
            breakfast: ["Saravana Bhavan", "Karim's", "Sita Ram Diwan Chand", "Cafe Lota"],
            lunch: ["Bukhara", "Indian Accent", "Dakshin", "Moti Mahal"],
            dinner: ["Punjabi by Nature", "Dum Pukht", "Spice Route", "Chor Bizarre"]
        },
        "Mumbai": {
            breakfast: ["Cafe Madras", "Britannia & Co.", "Pancham Puriwala", "Kyani & Co."],
            lunch: ["Trishna", "Khyber", "Mahesh Lunch Home", "Chetana"],
            dinner: ["The Bombay Canteen", "Gajalee", "Pali Village Cafe", "Bastian"]
        },
        "Kolkata": {
            breakfast: ["Flurys", "Ganguram", "Maharaja", "Balwant Singh's Eating House"],
            lunch: ["6 Ballygunge Place", "Oh! Calcutta", "Bhojohori Manna", "Aaheli"],
            dinner: ["Peter Cat", "Arsalan", "Mocambo", "Dum Pukht"]
        },
        "Jaipur": {
            breakfast: ["Rawat Mishthan Bhandar", "Sanjay Omelette", "Laxmi Mishthan Bhandar", "Tapri Central"],
            lunch: ["Spice Court", "Handi", "Niros", "Peacock Rooftop Restaurant"],
            dinner: ["Chokhi Dhani", "1135 AD", "Suvarna Mahal", "Bar Palladio"]
        },
        "Varanasi": {
            breakfast: ["Kashi Chaat Bhandar", "Aadha-Aadha", "Baati Chokha", "Dosa Cafe"],
            lunch: ["Pizzeria Vaatika Cafe", "Shri Annapurna Restaurant", "Canton Royale", "Mangi Ferra"],
            dinner: ["Banaras Haveli Restaurant", "Keshari Restaurant", "Zaika Restaurant", "Tadka Restaurant"]
        },
        "Goa": {
            breakfast: ["Cafe Bodega", "Infantaria", "Cafe Chocolatti", "German Bakery"],
            lunch: ["Gunpowder", "Mum's Kitchen", "Fisherman's Wharf", "Britto's"],
            dinner: ["Thalassa", "A Reverie", "Antares", "Martin's Corner"]
        }
    };

    // Default restaurants if destination not found
    const defaultRestaurants = {
        breakfast: ["Morning Cafe", "Sunrise Breakfast", "Local Delights", "Heritage Breakfast"],
        lunch: ["City View Restaurant", "Spice Garden", "Royal Dining", "Flavors of India"],
        dinner: ["Gourmet House", "Twilight Terrace", "Fine Dining Experience", "Traditional Kitchen"]
    };

    const options = restaurants[destination] || defaultRestaurants;
    const mealOptions = options[mealType] || options.lunch;

    return mealOptions[Math.floor(Math.random() * mealOptions.length)];
}

function getRandomAttraction(destination, exclude = [], preferences = []) {
    const attractions = {
        "Delhi": ["Red Fort", "Qutub Minar", "Humayun's Tomb", "India Gate", "Lotus Temple", "Akshardham Temple", "Jama Masjid", "Chandni Chowk"],
        "Mumbai": ["Gateway of India", "Marine Drive", "Elephanta Caves", "Chhatrapati Shivaji Terminus", "Juhu Beach", "Sanjay Gandhi National Park", "Colaba Causeway", "Haji Ali Dargah"],
        "Kolkata": ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Kali Temple", "Indian Museum", "Park Street", "Marble Palace", "Science City", "New Market"],
        "Jaipur": ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Jal Mahal", "Nahargarh Fort", "Albert Hall Museum", "Jaigarh Fort"],
        "Varanasi": ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath", "Ramnagar Fort", "Assi Ghat", "Manikarnika Ghat", "Sankat Mochan Hanuman Temple", "Banaras Hindu University"],
        "Goa": ["Baga Beach", "Calangute Beach", "Basilica of Bom Jesus", "Fort Aguada", "Dudhsagar Falls", "Anjuna Flea Market", "Chapora Fort", "Shantadurga Temple"]
    };

    // Default attractions if destination not found
    const defaultAttractions = [
        "City Museum", "Heritage Temple", "Central Park", "Old Fort", "Art Gallery",
        "Historical Monument", "Botanical Garden", "Local Market", "Ancient Ruins", "Riverside Walk"
    ];

    const options = attractions[destination] || defaultAttractions;

    // Filter out excluded attractions
    const filteredOptions = options.filter(option => !exclude.includes(option));

    return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
}

function getRandomNightlifeSpot(destination) {
    const nightlifeSpots = {
        "Delhi": ["Kitty Su", "Social", "Hauz Khas Village", "Piano Man Jazz Club", "Auro Kitchen & Bar"],
        "Mumbai": ["Tryst", "Trilogy", "Toto's Garage", "Dome", "Aer"],
        "Kolkata": ["Roxy", "Tantra", "The Myx", "Shisha Bar Stock Exchange", "The Grid"],
        "Jaipur": ["Bar Palladio", "Blackout", "Aza", "Grunge Lounge Bar", "The Polo Bar"],
        "Varanasi": ["Prinsep Bar", "Zaika Roof Top Restaurant", "Up & Above", "Spicy Bites", "Canton Royale"],
        "Goa": ["Tito's", "LPK Waterfront", "Club Cubana", "SinQ Night Club", "Mambo's"]
    };

    const defaultSpots = ["City Nightclub", "Rooftop Lounge", "Jazz Bar", "Pub District", "Cocktail Bar"];

    const options = nightlifeSpots[destination] || defaultSpots;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomCulturalShow(destination) {
    const culturalShows = {
        "Delhi": ["Dances of India at Kamani Auditorium", "Kingdom of Dreams Show", "Kathak Performance at Triveni Kala Sangam", "Qawwali at Nizamuddin Dargah"],
        "Mumbai": ["Performance at NCPA", "Prithvi Theatre Show", "Royal Opera House Performance", "Bollywood Show at Film City"],
        "Kolkata": ["Bengali Theatre at Academy of Fine Arts", "Rabindra Sangeet Performance", "Classical Dance at Rabindra Sadan", "Baul Music Show"],
        "Jaipur": ["Rajasthani Folk Dance at Chokhi Dhani", "Puppet Show at Jawahar Kala Kendra", "Cultural Performance at Amber Fort", "Traditional Music at Albert Hall"],
        "Varanasi": ["Ganga Aarti at Dashashwamedh Ghat", "Classical Music Performance at Sankat Mochan Temple", "Kathak Dance Show", "Subah-e-Banaras Morning Raga"],
        "Goa": ["Portuguese Dance Performance", "Goan Folk Dance Show", "Konkani Theatre", "Traditional Music at Ancestral Goa"]
    };

    const defaultShows = ["Traditional Dance Performance", "Local Music Concert", "Heritage Cultural Show", "Folk Art Exhibition", "Classical Music Evening"];

    const options = culturalShows[destination] || defaultShows;
    return options[Math.floor(Math.random() * options.length)];
}

// Additional helper functions for preference-based places
function getRandomMarket(destination) {
    const markets = {
        "Delhi": ["Chandni Chowk", "Sarojini Nagar Market", "Dilli Haat", "Khan Market", "Janpath Market"],
        "Mumbai": ["Crawford Market", "Colaba Causeway", "Linking Road", "Fashion Street", "Chor Bazaar"],
        "Kolkata": ["New Market", "College Street", "Gariahat Market", "Hatibagan Market", "Burrabazar"],
        "Jaipur": ["Johari Bazaar", "Bapu Bazaar", "Tripolia Bazaar", "Nehru Bazaar", "Chandpole Bazaar"],
        "Varanasi": ["Vishwanath Gali", "Thatheri Bazaar", "Godowlia Market", "Chowk", "Lanka Market"],
        "Goa": ["Anjuna Flea Market", "Mapusa Market", "Arpora Night Market", "Calangute Market Square", "Panjim Municipal Market"]
    };

    const defaultMarkets = ["Central Market", "Heritage Bazaar", "Handicraft Market", "Local Shopping Center", "Souvenir Market"];

    const options = markets[destination] || defaultMarkets;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomNatureSpot(destination) {
    const natureSpots = {
        "Delhi": ["Lodhi Gardens", "Deer Park", "Yamuna Biodiversity Park", "Garden of Five Senses", "Nehru Park"],
        "Mumbai": ["Sanjay Gandhi National Park", "Hanging Gardens", "Mahim Nature Park", "Powai Lake", "Aarey Milk Colony"],
        "Kolkata": ["Botanical Gardens", "Rabindra Sarobar Lake", "Eco Park", "Nicco Park", "Millennium Park"],
        "Jaipur": ["Sisodia Rani Garden", "Central Park", "Kanak Vrindavan", "Smriti Van", "Jawahar Circle Garden"],
        "Varanasi": ["Assi Ghat Garden", "Tulsi Manas Mandir Garden", "Dr. Sampurnanand Park", "Sarnath Deer Park", "Banaras Hindu University Botanical Garden"],
        "Goa": ["Cotigao Wildlife Sanctuary", "Mollem National Park", "Salim Ali Bird Sanctuary", "Bhagwan Mahavir Wildlife Sanctuary", "Netravali Wildlife Sanctuary"]
    };

    const defaultNatureSpots = ["City Park", "Botanical Garden", "Nature Reserve", "Riverside Walk", "Scenic Viewpoint"];

    const options = natureSpots[destination] || defaultNatureSpots;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomVegetarianRestaurant(destination) {
    const vegRestaurants = {
        "Delhi": ["Saravana Bhavan", "Sagar Ratna", "Haldiram's", "Bikanervala", "Naivedyam"],
        "Mumbai": ["Shiv Sagar", "Cream Centre", "Swati Snacks", "Chetana", "Pancham Puriwala"],
        "Kolkata": ["Ganguram", "Haldiram's", "Annapurna Sweets", "Bhojohori Manna", "Banana Leaf"],
        "Jaipur": ["Rawat Mishthan Bhandar", "Laxmi Mishthan Bhandar", "Sanjay Omelette", "Niros", "Tapri Central"],
        "Varanasi": ["Aadha-Aadha", "Shree Shivay", "Dosa Cafe", "Kashi Chat Bhandar", "Baati Chokha"],
        "Goa": ["Bean Me Up", "Cafe Bodega", "Saraya Art Cafe", "Blue Planet Cafe", "Ritz Classic"]
    };

    const defaultVegRestaurants = ["Pure Veg Delight", "Green Garden Restaurant", "Vegetarian Paradise", "Fresh Harvest", "Nature's Bounty"];

    const options = vegRestaurants[destination] || defaultVegRestaurants;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomNonVegRestaurant(destination) {
    const nonVegRestaurants = {
        "Delhi": ["Karim's", "Bukhara", "Moti Mahal", "Gulati", "Pind Balluchi"],
        "Mumbai": ["Trishna", "Mahesh Lunch Home", "Bademiya", "Britannia & Co.", "Jai Hind Lunch Home"],
        "Kolkata": ["Peter Cat", "Arsalan", "Mocambo", "Shiraz", "Aminia"],
        "Jaipur": ["Handi", "Lassiwala", "Chokhi Dhani", "Spice Court", "Niros"],
        "Varanasi": ["Keshari Restaurant", "Zaika Restaurant", "Canton Royale", "Tadka Restaurant", "Mangi Ferra"],
        "Goa": ["Fisherman's Wharf", "Britto's", "Martin's Corner", "Gunpowder", "Mum's Kitchen"]
    };

    const defaultNonVegRestaurants = ["Meat & Grill", "Seafood Specialties", "Carnivore's Delight", "Tandoor House", "Spice & Kebab"]

    const options = nonVegRestaurants[destination] || defaultNonVegRestaurants;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomHistoricalSite(destination, exclude = []) {
    const historicalSites = {
        "Delhi": ["Red Fort", "Qutub Minar", "Humayun's Tomb", "Purana Qila", "Safdarjung Tomb", "Jantar Mantar", "Tughlaqabad Fort", "Feroz Shah Kotla"],
        "Mumbai": ["Elephanta Caves", "Chhatrapati Shivaji Terminus", "Gateway of India", "Kanheri Caves", "Worli Fort", "Banganga Tank", "Asiatic Society Library", "Dr. Bhau Daji Lad Museum"],
        "Kolkata": ["Victoria Memorial", "Fort William", "Marble Palace", "Jorasanko Thakur Bari", "Metcalfe Hall", "Currency Building", "Belur Math", "Indian Museum"],
        "Jaipur": ["Amber Fort", "City Palace", "Hawa Mahal", "Jantar Mantar", "Nahargarh Fort", "Jaigarh Fort", "Albert Hall Museum", "Galtaji Temple"],
        "Varanasi": ["Ramnagar Fort", "Chunar Fort", "Man Mandir Observatory", "Banaras Hindu University", "Alamgir Mosque", "Lal Khan's Tomb", "Sarnath Archaeological Museum", "Bharat Kala Bhavan"],
        "Goa": ["Basilica of Bom Jesus", "Fort Aguada", "Chapora Fort", "Se Cathedral", "Reis Magos Fort", "St. Augustine Tower", "Ancestral Goa Museum", "Cabo de Rama Fort"]
    };

    const defaultHistoricalSites = ["Ancient Fort", "Heritage Palace", "Historical Monument", "Archaeological Site", "Colonial Building", "Royal Residence", "Ancient Temple", "Historical Museum"];

    const options = historicalSites[destination] || defaultHistoricalSites;
    const filteredOptions = options.filter(option => !exclude.includes(option));
    return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
}

function getRandomArtMuseum(destination, exclude = []) {
    const artMuseums = {
        "Delhi": ["National Gallery of Modern Art", "Kiran Nadar Museum of Art", "National Crafts Museum", "National Museum", "Sanskriti Museums"],
        "Mumbai": ["Jehangir Art Gallery", "National Gallery of Modern Art", "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", "Dr. Bhau Daji Lad Museum", "Piramal Museum of Art"],
        "Kolkata": ["Academy of Fine Arts", "Birla Academy of Art & Culture", "Indian Museum", "Victoria Memorial Art Gallery", "Tagore House Museum"],
        "Jaipur": ["Albert Hall Museum", "Jawahar Kala Kendra", "Museum of Legacies", "Anokhi Museum of Hand Printing", "City Palace Museum"],
        "Varanasi": ["Bharat Kala Bhavan", "Archaeological Museum Sarnath", "Ramnagar Fort Museum", "Kriti Gallery", "Assi Art Gallery"],
        "Goa": ["Museum of Goa", "Goa State Museum", "Houses of Goa Museum", "Fundação Oriente", "Sunaparanta Centre for the Arts"]
    };

    const defaultArtMuseums = ["City Art Gallery", "Modern Art Museum", "Heritage Art Center", "Cultural Arts Museum", "Contemporary Art Space"];

    const options = artMuseums[destination] || defaultArtMuseums;
    const filteredOptions = options.filter(option => !exclude.includes(option));
    return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
}

function getRandomReligiousSite(destination, exclude = []) {
    const religiousSites = {
        "Delhi": ["Jama Masjid", "Lotus Temple", "Akshardham Temple", "ISKCON Temple", "Gurudwara Bangla Sahib", "Laxminarayan Temple", "Cathedral Church of the Redemption", "Nizamuddin Dargah"],
        "Mumbai": ["Siddhivinayak Temple", "Haji Ali Dargah", "ISKCON Temple", "Mahalakshmi Temple", "Mumba Devi Temple", "St. Thomas Cathedral", "Babulnath Temple", "Global Vipassana Pagoda"],
        "Kolkata": ["Dakshineswar Kali Temple", "Kalighat Temple", "Belur Math", "St. Paul's Cathedral", "Nakhoda Mosque", "ISKCON Temple", "Paresnath Jain Temple", "Birla Mandir"],
        "Jaipur": ["Govind Dev Ji Temple", "Birla Mandir", "Galtaji Temple", "Moti Dungri Ganesh Temple", "Akshardham Temple", "Digamber Jain Temple", "Jama Masjid", "Garh Ganesh Temple"],
        "Varanasi": ["Kashi Vishwanath Temple", "Sankat Mochan Hanuman Temple", "Durga Temple", "Tulsi Manas Temple", "Bharat Mata Temple", "Alamgir Mosque", "Kedar Temple", "New Vishwanath Temple"],
        "Goa": ["Basilica of Bom Jesus", "Se Cathedral", "Shantadurga Temple", "Mangeshi Temple", "Mahalasa Temple", "Church of Our Lady of the Immaculate Conception", "Shri Mangueshi Temple", "Tambdi Surla Mahadev Temple"]
    };

    const defaultReligiousSites = ["Ancient Temple", "Sacred Shrine", "Historic Mosque", "Grand Cathedral", "Spiritual Center", "Holy Pilgrimage Site", "Meditation Sanctuary", "Religious Monument"];

    const options = religiousSites[destination] || defaultReligiousSites;
    const filteredOptions = options.filter(option => !exclude.includes(option));
    return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
}

function getRandomRelaxationSpot(destination) {
    const relaxationSpots = {
        "Delhi": ["The Lodhi Spa", "Amatrra Spa", "Lodhi Gardens", "Garden of Five Senses", "Nehru Park"],
        "Mumbai": ["Juhu Beach", "Marine Drive", "Spa by JW at JW Marriott", "Four Fountains Spa", "Hanging Gardens"],
        "Kolkata": ["Maidan Park", "Rabindra Sarobar Lake", "Spa at ITC Sonar", "Eco Park", "Millennium Park"],
        "Jaipur": ["Jal Mahal", "Central Park", "Spa at Rambagh Palace", "Sisodia Rani Garden", "Kanak Vrindavan"],
        "Varanasi": ["Assi Ghat", "Banaras Spa at Taj Ganges", "Man Mandir Ghat", "Tulsi Manas Temple Garden", "Sarnath Deer Park"],
        "Goa": ["Anjuna Beach", "Palolem Beach", "Sereno Spa at Park Hyatt", "Arambol Beach", "Morjim Beach"]
    };

    const defaultRelaxationSpots = ["Luxury Spa", "Peaceful Garden", "Scenic Viewpoint", "Tranquil Beach", "Wellness Center", "Meditation Retreat", "Riverside Relaxation", "Peaceful Park"];

    const options = relaxationSpots[destination] || defaultRelaxationSpots;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomAdventureActivity(destination) {
    const adventureActivities = {
        "Delhi": ["Hot Air Ballooning in NCR", "Rock Climbing at IMF", "Paintball at Shootout Zone", "Go-karting at F9 Go Karting", "Adventure Island Theme Park"],
        "Mumbai": ["Sailing at Gateway of India", "Hiking at Sanjay Gandhi National Park", "Parasailing at Juhu Beach", "Essel World Rides", "Go-karting at Smaaash"],
        "Kolkata": ["Zip-lining at Eco Park", "Boating at Rabindra Sarobar", "Adventure activities at Nicco Park", "Cycling Tour of Old Kolkata", "River Cruise on Hooghly"],
        "Jaipur": ["Hot Air Ballooning over Amber Fort", "Zip-lining at Flying Fox", "Elephant Safari at Amer", "Cycling Tour of Old City", "Jeep Safari at Nahargarh Biological Park"],
        "Varanasi": ["Sunrise Boat Ride on the Ganges", "Cycling Tour of Old City", "Helicopter Tour over Varanasi", "Sunset Cruise on the Ganges", "Tuk-tuk Adventure through Narrow Lanes"],
        "Goa": ["Parasailing at Baga Beach", "White Water Rafting at Mhadei River", "Scuba Diving at Grande Island", "Jet Skiing at Calangute", "Banana Boat Ride at Anjuna Beach"]
    };

    const defaultAdventureActivities = ["City Zip-lining", "Adventure Park Visit", "Cycling Tour", "Rock Climbing", "Water Sports", "Hiking Expedition", "Bungee Jumping", "Off-road Adventure"];

    const options = adventureActivities[destination] || defaultAdventureActivities;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomLuxuryRestaurant(destination) {
    const luxuryRestaurants = {
        "Delhi": ["Indian Accent", "Bukhara at ITC Maurya", "Dum Pukht", "Le Cirque at The Leela", "Orient Express at Taj Palace"],
        "Mumbai": ["Wasabi by Morimoto", "Ziya at The Oberoi", "The Table", "Masala Library", "Vetro at The Oberoi"],
        "Kolkata": ["The Orient at Taj Bengal", "Zen at The Park", "Souk at Taj Bengal", "Baan Thai at The Oberoi Grand", "La Cucina at Hyatt Regency"],
        "Jaipur": ["Suvarna Mahal at Rambagh Palace", "Cinnamon at Jai Mahal Palace", "Steam at Rambagh Palace", "Taruveda Bistro", "1135 AD at Amber Fort"],
        "Varanasi": ["Tadka at Taj Ganges", "Varuna at Taj Ganges", "Darbhanga at Brijrama Palace", "Mangi Ferra", "Canton Royale"],
        "Goa": ["Thalassa", "Antares", "A Reverie", "La Plage", "Gunpowder"]
    };

    const defaultLuxuryRestaurants = ["Royal Fine Dining", "Gourmet Experience", "Five-Star Restaurant", "Luxury Rooftop Dining", "Premium Culinary Destination"];

    const options = luxuryRestaurants[destination] || defaultLuxuryRestaurants;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomBudgetRestaurant(destination) {
    const budgetRestaurants = {
        "Delhi": ["Paranthe Wali Gali", "Saravana Bhavan", "Haldiram's", "Nizam's Kathi Kabab", "Khan Chacha"],
        "Mumbai": ["Bademiya", "Amar Juice Center", "Cafe Madras", "Pancham Puriwala", "Sardar Pav Bhaji"],
        "Kolkata": ["Arsalan", "Anadi Cabin", "Sharma Dhaba", "Kusum Rolls", "Haji Saheb"],
        "Jaipur": ["Lassiwala", "Rawat Mishthan Bhandar", "Nand's", "Sanjay Omelette", "Masala Chowk"],
        "Varanasi": ["Kashi Chaat Bhandar", "Deena Chat Bhandar", "Baati Chokha", "Blue Lassi Shop", "Aadha-Aadha"],
        "Goa": ["Anand Seafood Restaurant", "Souza Lobo", "Ritz Classic", "Infantaria", "Britto's"]
    };

    const defaultBudgetRestaurants = ["Local Eatery", "Street Food Corner", "Budget Dining", "Value Meals", "Affordable Tastes"];

    const options = budgetRestaurants[destination] || defaultBudgetRestaurants;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomFamousRestaurant(destination) {
    const famousRestaurants = {
        "Delhi": ["Karim's", "Bukhara", "Indian Accent", "Moti Mahal", "Paranthe Wali Gali"],
        "Mumbai": ["Trishna", "Britannia & Co.", "Leopold Cafe", "Bademiya", "Swati Snacks"],
        "Kolkata": ["Peter Cat", "Arsalan", "Flurys", "6 Ballygunge Place", "Oh! Calcutta"],
        "Jaipur": ["Chokhi Dhani", "Laxmi Mishthan Bhandar", "Handi", "Niros", "Suvarna Mahal"],
        "Varanasi": ["Kashi Chaat Bhandar", "Baati Chokha", "Pizzeria Vaatika Cafe", "Blue Lassi Shop", "Keshari Restaurant"],
        "Goa": ["Thalassa", "Britto's", "Gunpowder", "Martin's Corner", "Fisherman's Wharf"]
    };

    const defaultFamousRestaurants = ["City's Best Restaurant", "Legendary Eatery", "Must-Visit Dining", "Iconic Food Destination", "Culinary Landmark"];

    const options = famousRestaurants[destination] || defaultFamousRestaurants;
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomPhotoSpot(destination) {
    const photoSpots = {
        "Delhi": ["India Gate at Sunset", "Humayun's Tomb Gardens", "Qutub Minar Complex", "Lodhi Art District", "Hauz Khas Fort Lake"],
        "Mumbai": ["Marine Drive at Sunset", "Gateway of India", "Bandra-Worli Sea Link", "Elephanta Caves", "Kala Ghoda Art District"],
        "Kolkata": ["Howrah Bridge at Sunset", "Victoria Memorial", "College Street", "Princep Ghat", "Millennium Park"],
        "Jaipur": ["Hawa Mahal Facade", "Jal Mahal at Sunset", "Amber Fort Viewpoint", "Patrika Gate", "Nahargarh Fort Sunset Point"],
        "Varanasi": ["Dashashwamedh Ghat during Ganga Aarti", "Sunrise Boat Ride on the Ganges", "Man Mandir Ghat", "Ramnagar Fort Sunset", "Chet Singh Ghat"],
        "Goa": ["Dudhsagar Falls", "Chapora Fort Sunset", "Palolem Beach", "Basilica of Bom Jesus", "Arambol Beach Sunset"]
    };

    const defaultPhotoSpots = ["Scenic Viewpoint", "Historic Monument at Sunset", "City Skyline View", "Cultural Landmark", "Natural Wonder", "Architectural Marvel", "Riverside Panorama", "Heritage Street"];

    const options = photoSpots[destination] || defaultPhotoSpots;
    return options[Math.floor(Math.random() * options.length)];
}

// Helper function to format the itinerary text with HTML
function formatItinerary(text) {
    if (!text) return '';

    // Replace markdown-style links with HTML links
    let formatted = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Replace markdown-style headers with HTML headers
    formatted = formatted
        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Wrap lists in <ul> tags
    formatted = formatted.replace(/<li>(.+?)<\/li>/g, function(match) {
        return '<ul>' + match + '</ul>';
    }).replace(/<\/ul><ul>/g, '');

    // Add paragraph tags for regular text
    const lines = formatted.split('\n');
    let inList = false;

    formatted = lines.map(line => {
        if (line.trim() === '') return '';
        if (line.includes('<h2>') || line.includes('<h3>') || line.includes('<h4>')) return line;
        if (line.includes('<ul>')) {
            inList = true;
            return line;
        }
        if (line.includes('</ul>')) {
            inList = false;
            return line;
        }
        if (!inList && !line.includes('<li>')) return `<p>${line}</p>`;
        return line;
    }).join('\n');

    return formatted;
}

// Function to print the itinerary
function printItinerary() {
    const itineraryContent = document.querySelector('.itinerary-content');
    if (!itineraryContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Travel Itinerary</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                h2, h3, h4 { color: #4285F4; }
                ul { margin-bottom: 15px; }
                li { margin-bottom: 5px; }
            </style>
        </head>
        <body>
            ${itineraryContent.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Function to save the itinerary
function saveItinerary() {
    const itineraryContent = document.querySelector('.itinerary-content');

    if (!itineraryContent) {
        alert('No itinerary to save');
        return;
    }

    // Check if user is logged in using the userAuth module
    if (!window.userAuth || !window.userAuth.isLoggedIn()) {
        const destination = document.getElementById('destination').value.trim();
        const plainText = itineraryContent.innerText;

        const blob = new Blob([plainText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${destination.replace(/\s+/g, '_')}_Itinerary.txt`;
        a.click();

        URL.revokeObjectURL(url);

        // Prompt user to login to save to profile
        if (confirm('Login to save this itinerary to your profile?')) {
            // Switch to profile tab
            const profileTabLink = document.querySelector('[data-tab="profile"]');
            if (profileTabLink) {
                profileTabLink.click();
            }
        }
        return;
    }

    // User is logged in, save to profile
    // Get itinerary data from the page
    const itineraryTitle = itineraryContent.querySelector('h2');

    if (!itineraryTitle) {
        alert('Could not find itinerary title');
        return;
    }

    // Parse destination and days from title
    const titleText = itineraryTitle.textContent;
    const match = titleText.match(/(\d+)-Day Itinerary for (.+)/);

    if (!match) {
        alert('Could not parse itinerary title');
        return;
    }

    const days = parseInt(match[1]);
    const destination = match[2];

    // Get additional information
    const persons = document.getElementById('persons') ? document.getElementById('persons').value : null;
    const preferences = [];
    document.querySelectorAll('input[name="travel-preferences"]:checked').forEach(el => {
        preferences.push(el.value);
    });

    // Create a unique identifier for the itinerary based on content
    const contentHash = hashCode(itineraryContent.innerHTML);

    // Get current user and check for existing itineraries
    const currentUser = window.userAuth.getCurrentUser();
    const existingItinerary = currentUser.itineraries ? currentUser.itineraries.find(i =>
        i.destination.toLowerCase() === destination.toLowerCase() &&
        i.days === days &&
        i.contentHash === contentHash
    ) : null;

    if (existingItinerary) {
        if (!confirm('You already have a similar itinerary saved. Do you want to save another copy?')) {
            return;
        }
    }

    // Create new itinerary with more details
    const newItinerary = {
        id: Date.now(),
        destination,
        days,
        persons,
        preferences: preferences.join(', '),
        content: itineraryContent.innerHTML,
        contentHash: contentHash,
        summary: `A ${days}-day itinerary with recommendations for attractions, restaurants, and activities${preferences.length > 0 ? ` focusing on ${preferences.join(', ')}` : ''}.`,
        savedDate: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
    };

    // Save itinerary using the userAuth module
    const result = window.userAuth.saveItinerary(newItinerary);

    if (result.success) {
        // Show success message with option to view saved itineraries
        if (confirm('Itinerary saved successfully to your profile! Would you like to view your saved itineraries?')) {
            // Switch to profile tab
            const profileTabLink = document.querySelector('[data-tab="profile"]');
            if (profileTabLink) {
                profileTabLink.click();

                // Switch to saved itineraries tab within profile
                setTimeout(() => {
                    const savedItinerariesTab = document.querySelector('.profile-tab-btn[data-tab="saved-itineraries"]');
                    if (savedItinerariesTab) {
                        savedItinerariesTab.click();
                    }
                }, 100);
            }
        }
    } else {
        alert('Error saving itinerary: ' + result.message);
    }
}

// Simple hash function to create a content identifier
function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash.toString();
}
