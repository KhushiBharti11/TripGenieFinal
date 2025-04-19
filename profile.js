// Profile functionality for Trip Genie
// Wait for window to load completely to ensure all elements are available
window.onload = function() {
    console.log("Profile.js loaded (window.onload)");

    // Debug information
    console.log("Login section exists:", document.getElementById('login-section') !== null);
    console.log("User profile section exists:", document.getElementById('user-profile') !== null);
    console.log("Login button exists:", document.getElementById('login-btn') !== null);
    console.log("Register button exists:", document.getElementById('register-btn') !== null);

    // Add direct click handler to profile tab link
    const profileTabLink = document.querySelector('a[onclick*="\'profile\'"]');
    if (profileTabLink) {
        console.log("Found profile tab link:", profileTabLink.textContent);
        profileTabLink.addEventListener('click', function() {
            console.log("Profile tab link clicked directly");
        });
    } else {
        console.log("Could not find profile tab link");
    }

    initializeProfile();
};

// Also keep the DOMContentLoaded event for redundancy
document.addEventListener('DOMContentLoaded', function() {
    console.log("Profile.js loaded (DOMContentLoaded)");
});

// Main initialization function
function initializeProfile() {

    // DOM elements
    const loginSection = document.getElementById('login-section');
    const userProfileSection = document.getElementById('user-profile');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileUsername = document.getElementById('profile-username');
    const submitFeedbackBtn = document.getElementById('submit-feedback');

    // Profile tab buttons
    const profileTabBtns = document.querySelectorAll('.profile-tab-btn');

    // Check if user is already logged in
    checkLoginStatus();

    // Add event listeners using direct onclick attribute for maximum compatibility
    if (loginBtn) {
        console.log("Adding click handler to login button");
        loginBtn.onclick = function() {
            console.log("Login button clicked via onclick");
            handleLogin();
        };
    } else {
        console.log("Login button not found");
    }

    if (registerBtn) {
        console.log("Adding click handler to register button");
        registerBtn.onclick = function() {
            console.log("Register button clicked via onclick");
            handleRegister();
        };
    } else {
        console.log("Register button not found");
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', handleFeedbackSubmission);
    }

    // Add event listeners to profile tab buttons
    profileTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchProfileTab(tabName);
        });
    });

    // Function to check if user is logged in using the userAuth module
    function checkLoginStatus() {
        if (window.userAuth && window.userAuth.isLoggedIn()) {
            // User is logged in
            if (loginSection) loginSection.style.display = 'none';
            if (userProfileSection) userProfileSection.style.display = 'block';

            const currentUser = window.userAuth.getCurrentUser();
            if (profileUsername) profileUsername.textContent = currentUser.username;

            // Load user data
            loadUserData(currentUser);
        } else {
            // User is not logged in
            if (loginSection) loginSection.style.display = 'block';
            if (userProfileSection) userProfileSection.style.display = 'none';
        }
    }

    // Function to handle login using the userAuth module
    function handleLogin() {
        console.log("Login button clicked");
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        console.log("Username:", username);
        console.log("Password length:", password.length);

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        // Use the userAuth module to login
        if (window.userAuth) {
            const result = window.userAuth.login(username, password);

            if (result.success) {
                // Update UI
                if (loginSection) loginSection.style.display = 'none';
                if (userProfileSection) userProfileSection.style.display = 'block';
                if (profileUsername) profileUsername.textContent = result.user.username;

                // Load user data
                loadUserData(result.user);

                // Clear input fields
                usernameInput.value = '';
                passwordInput.value = '';
            } else {
                alert(result.message || 'Invalid username or password');
            }
        } else {
            alert('Authentication system not available');
        }
    }

    // Function to handle registration using the userAuth module
    function handleRegister() {
        console.log("Register button clicked");
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        console.log("Username:", username);
        console.log("Password length:", password.length);

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        // Use the userAuth module to register
        if (window.userAuth) {
            const result = window.userAuth.register(username, password);

            if (result.success) {
                // Update UI
                if (loginSection) loginSection.style.display = 'none';
                if (userProfileSection) userProfileSection.style.display = 'block';
                if (profileUsername) profileUsername.textContent = result.user.username;

                // Clear input fields
                usernameInput.value = '';
                passwordInput.value = '';

                alert('Registration successful! You are now logged in.');
            } else {
                alert(result.message || 'Registration failed');
            }
        } else {
            alert('Authentication system not available');
        }
    }

    // Function to handle logout using the userAuth module
    function handleLogout() {
        // Use the userAuth module to logout
        if (window.userAuth) {
            window.userAuth.logout();
        } else {
            // Fallback to direct localStorage removal
            localStorage.removeItem('currentUser');
        }

        // Update UI
        if (loginSection) loginSection.style.display = 'block';
        if (userProfileSection) userProfileSection.style.display = 'none';
    }

    // Function to load user data
    function loadUserData(user) {
        // Load saved itineraries
        loadSavedItineraries(user.itineraries || []);

        // Load past trips
        loadPastTrips(user.trips || []);

        // Load feedback
        loadFeedback(user.feedback || []);
    }

    // Function to load saved itineraries
    function loadSavedItineraries(itineraries) {
        const itinerariesList = document.getElementById('saved-itineraries-list');
        const itineraryCount = document.getElementById('itinerary-count');
        const itinerarySearch = document.getElementById('itinerary-search');
        const itinerarySort = document.getElementById('itinerary-sort');

        if (!itinerariesList) return;

        // Update itinerary count
        if (itineraryCount) {
            itineraryCount.textContent = itineraries.length;
        }

        if (itineraries.length === 0) {
            itinerariesList.innerHTML = '<p class="empty-state">No saved itineraries found. Generate and save an itinerary to see it here!</p>';
            return;
        }

        // Add event listeners for search and sort if they don't exist yet
        if (itinerarySearch && !itinerarySearch._hasListener) {
            itinerarySearch.addEventListener('input', function() {
                filterItineraries();
            });
            itinerarySearch._hasListener = true;
        }

        if (itinerarySort && !itinerarySort._hasListener) {
            itinerarySort.addEventListener('change', function() {
                filterItineraries();
            });
            itinerarySort._hasListener = true;
        }

        // Store itineraries in a data attribute for filtering/sorting
        itinerariesList.dataset.itineraries = JSON.stringify(itineraries);

        // Initial display of itineraries
        displayFilteredItineraries(itineraries);

        // Function to filter and sort itineraries
        function filterItineraries() {
            const searchTerm = itinerarySearch ? itinerarySearch.value.toLowerCase() : '';
            const sortOption = itinerarySort ? itinerarySort.value : 'date-desc';

            // Get stored itineraries
            const allItineraries = JSON.parse(itinerariesList.dataset.itineraries || '[]');

            // Filter by search term
            let filtered = allItineraries;
            if (searchTerm) {
                filtered = allItineraries.filter(itinerary =>
                    itinerary.destination.toLowerCase().includes(searchTerm)
                );
            }

            // Sort itineraries
            filtered.sort((a, b) => {
                switch (sortOption) {
                    case 'date-desc':
                        return new Date(b.savedDate) - new Date(a.savedDate);
                    case 'date-asc':
                        return new Date(a.savedDate) - new Date(b.savedDate);
                    case 'name-asc':
                        return a.destination.localeCompare(b.destination);
                    case 'name-desc':
                        return b.destination.localeCompare(a.destination);
                    case 'days-asc':
                        return a.days - b.days;
                    case 'days-desc':
                        return b.days - a.days;
                    default:
                        return 0;
                }
            });

            // Display filtered and sorted itineraries
            displayFilteredItineraries(filtered);
        }

        // Function to display filtered itineraries
        function displayFilteredItineraries(filteredItineraries) {
            itinerariesList.innerHTML = '';

            if (filteredItineraries.length === 0) {
                itinerariesList.innerHTML = '<p class="empty-state">No itineraries match your search criteria.</p>';
                return;
            }

            filteredItineraries.forEach(itinerary => {
                const itineraryItem = document.createElement('div');
                itineraryItem.classList.add('itinerary-item');

                // Format the date nicely
                const savedDate = itinerary.savedDate;

                // Add persons count if available
                const personsInfo = itinerary.persons ? ` for ${itinerary.persons} ${parseInt(itinerary.persons) === 1 ? 'person' : 'people'}` : '';

                itineraryItem.innerHTML = `
                    <div class="itinerary-header">
                        <h5>${itinerary.destination} (${itinerary.days} days${personsInfo})</h5>
                        <span class="itinerary-date">Saved on: ${savedDate}</span>
                    </div>
                    <p class="itinerary-summary">${itinerary.summary}</p>
                    <div class="itinerary-actions">
                        <button class="view-itinerary" data-id="${itinerary.id}">View Details</button>
                        <button class="delete-itinerary" data-id="${itinerary.id}">Delete</button>
                    </div>
                `;

                itinerariesList.appendChild(itineraryItem);
            });

            // Add event listeners to view and delete buttons
            document.querySelectorAll('.view-itinerary').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itineraryId = parseInt(this.getAttribute('data-id'));
                    viewItinerary(itineraryId);
                });
            });

            document.querySelectorAll('.delete-itinerary').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itineraryId = parseInt(this.getAttribute('data-id'));
                    deleteItinerary(itineraryId);
                });
            });
        }
    }

    // Function to load past trips
    function loadPastTrips(trips) {
        const tripsList = document.getElementById('past-trips-list');

        if (!tripsList) return;

        if (trips.length === 0) {
            tripsList.innerHTML = '<p class="empty-state">No past trips found. Start planning your first adventure!</p>';
            return;
        }

        tripsList.innerHTML = '';

        trips.forEach(trip => {
            const tripItem = document.createElement('div');
            tripItem.classList.add('trip-item');

            tripItem.innerHTML = `
                <div class="trip-header">
                    <h5>${trip.destination}</h5>
                    <span class="trip-date">${trip.date}</span>
                </div>
                <p class="trip-details">${trip.details}</p>
            `;

            tripsList.appendChild(tripItem);
        });
    }

    // Function to load feedback
    function loadFeedback(feedbackList) {
        const feedbackListElement = document.getElementById('feedback-list');

        if (!feedbackListElement) return;

        if (feedbackList.length === 0) {
            feedbackListElement.innerHTML = '<p class="empty-state">No feedback submitted yet.</p>';
            return;
        }

        feedbackListElement.innerHTML = '';

        feedbackList.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('feedback-item');

            // Create star rating display
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= feedback.rating) {
                    starsHtml += '<span class="star filled">★</span>';
                } else {
                    starsHtml += '<span class="star">☆</span>';
                }
            }

            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <h5>${feedback.destination}</h5>
                    <div class="star-rating">${starsHtml}</div>
                </div>
                <p class="feedback-date">Submitted on: ${feedback.date}</p>
                <p class="feedback-comment">${feedback.comment}</p>
            `;

            feedbackListElement.appendChild(feedbackItem);
        });
    }

    // Function to handle feedback submission using the userAuth module
    function handleFeedbackSubmission() {
        const destination = document.getElementById('feedback-destination').value.trim();
        const rating = parseInt(document.getElementById('feedback-rating').value);
        const comment = document.getElementById('feedback-comment').value.trim();

        if (!destination || !comment) {
            alert('Please enter both destination and comment');
            return;
        }

        // Check if user is logged in
        if (!window.userAuth || !window.userAuth.isLoggedIn()) {
            alert('You must be logged in to submit feedback');
            return;
        }

        // Create new feedback
        const newFeedback = {
            id: Date.now(),
            destination,
            rating,
            comment,
            date: new Date().toLocaleDateString()
        };

        // Add feedback using the userAuth module
        const result = window.userAuth.addFeedback(newFeedback);

        if (result.success) {
            // Clear input fields
            document.getElementById('feedback-destination').value = '';
            document.getElementById('feedback-comment').value = '';

            // Reload feedback
            const currentUser = window.userAuth.getCurrentUser();
            loadFeedback(currentUser.feedback || []);

            alert('Feedback submitted successfully!');
        } else {
            alert('Error submitting feedback: ' + result.message);
        }
    }

    // Function to view itinerary using the userAuth module
    function viewItinerary(itineraryId) {
        if (!window.userAuth || !window.userAuth.isLoggedIn()) return;

        const currentUser = window.userAuth.getCurrentUser();
        if (!currentUser || !currentUser.itineraries) return;

        const itinerary = currentUser.itineraries.find(i => i.id === itineraryId);

        if (!itinerary) {
            alert('Itinerary not found');
            return;
        }

        // Switch to trip planning tab
        const tripPlanningTab = document.querySelector('[data-tab="trip-planning"]');
        if (tripPlanningTab) {
            tripPlanningTab.click();
        }

        // Display itinerary
        const itineraryResult = document.getElementById('itinerary-result');
        if (itineraryResult) {
            // Add a banner to indicate this is a saved itinerary
            const viewBanner = document.createElement('div');
            viewBanner.className = 'saved-itinerary-banner';
            viewBanner.innerHTML = `
                <div class="banner-content">
                    <span class="banner-title">Viewing Saved Itinerary</span>
                    <span class="banner-info">Saved on: ${itinerary.savedDate}</span>
                </div>
                <div class="banner-actions">
                    <button id="back-to-saved" class="banner-button">Back to Saved Itineraries</button>
                    <button id="edit-itinerary" class="banner-button">Edit</button>
                </div>
            `;

            // Create a container for the itinerary content
            const contentContainer = document.createElement('div');
            contentContainer.className = 'itinerary-content';
            contentContainer.innerHTML = itinerary.content;

            // Clear the result area and add our elements
            itineraryResult.innerHTML = '';
            itineraryResult.appendChild(viewBanner);
            itineraryResult.appendChild(contentContainer);

            // Add event listeners to the banner buttons
            document.getElementById('back-to-saved').addEventListener('click', function() {
                // Go back to profile tab and saved itineraries
                const profileTabLink = document.querySelector('[data-tab="profile"]');
                if (profileTabLink) {
                    profileTabLink.click();

                    // Switch to saved itineraries tab
                    setTimeout(() => {
                        const savedItinerariesTab = document.querySelector('.profile-tab-btn[data-tab="saved-itineraries"]');
                        if (savedItinerariesTab) {
                            savedItinerariesTab.click();
                        }
                    }, 100);
                }
            });

            document.getElementById('edit-itinerary').addEventListener('click', function() {
                // For now, just show an alert since editing is not fully implemented
                alert('Editing functionality will be available in a future update.');
            });

            // Add CSS for the banner if it doesn't exist
            if (!document.getElementById('saved-itinerary-styles')) {
                const style = document.createElement('style');
                style.id = 'saved-itinerary-styles';
                style.textContent = `
                    .saved-itinerary-banner {
                        background-color: #f0f8ff;
                        border: 1px solid #b8daff;
                        border-radius: 8px;
                        padding: 12px 15px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .banner-content {
                        display: flex;
                        flex-direction: column;
                    }
                    .banner-title {
                        font-weight: bold;
                        color: #0056b3;
                        font-size: 16px;
                    }
                    .banner-info {
                        color: #666;
                        font-size: 14px;
                        margin-top: 4px;
                    }
                    .banner-actions {
                        display: flex;
                        gap: 10px;
                    }
                    .banner-button {
                        padding: 6px 12px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        background-color: #007bff;
                        color: white;
                        transition: background-color 0.2s;
                    }
                    .banner-button:hover {
                        background-color: #0056b3;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Function to delete itinerary using the userAuth module
    function deleteItinerary(itineraryId) {
        if (!confirm('Are you sure you want to delete this itinerary?')) {
            return;
        }

        if (!window.userAuth || !window.userAuth.isLoggedIn()) return;

        // Delete itinerary using the userAuth module
        const result = window.userAuth.deleteItinerary(itineraryId);

        if (result.success) {
            // Reload itineraries
            const currentUser = window.userAuth.getCurrentUser();
            loadSavedItineraries(currentUser.itineraries || []);

            alert('Itinerary deleted successfully!');
        } else {
            alert('Error deleting itinerary: ' + result.message);
        }
    }

    // Simple function to switch profile tabs
    function switchProfileTab(tabName) {
        console.log("Switching profile tab to:", tabName);

        // Hide all profile tab content
        document.querySelectorAll('.profile-tab-content').forEach(tab => {
            tab.style.display = 'none';
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.profile-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected tab button
        const selectedBtn = document.querySelector(`.profile-tab-btn[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Show selected tab content
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }
    }
} // End of initializeProfile function
