// User Authentication and Profile Management for Trip Genie
// This file handles user registration, login, and profile data management

// User data structure
class UserManager {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Load current user from localStorage
    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log("Current user loaded:", this.currentUser.username);
                return true;
            }
        } catch (error) {
            console.error("Error loading current user:", error);
            localStorage.removeItem('currentUser');
        }
        return false;
    }

    // Get all users from localStorage
    getAllUsers() {
        try {
            const usersData = localStorage.getItem('users');
            return usersData ? JSON.parse(usersData) : [];
        } catch (error) {
            console.error("Error loading users:", error);
            return [];
        }
    }

    // Save all users to localStorage
    saveAllUsers(users) {
        try {
            localStorage.setItem('users', JSON.stringify(users));
            return true;
        } catch (error) {
            console.error("Error saving users:", error);
            return false;
        }
    }

    // Register a new user
    registerUser(username, password) {
        if (!username || !password) {
            return { success: false, message: "Username and password are required" };
        }

        // Get existing users
        const users = this.getAllUsers();

        // Check if username already exists
        if (users.some(u => u.username === username)) {
            return { success: false, message: "Username already exists" };
        }

        // Create new user object
        const newUser = {
            id: Date.now(),
            username,
            password, // In a real app, this should be hashed
            itineraries: [],
            trips: [],
            feedback: [],
            preferences: {},
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        // Add user to users array
        users.push(newUser);

        // Save updated users array
        if (!this.saveAllUsers(users)) {
            return { success: false, message: "Error saving user data" };
        }

        // Set as current user
        this.setCurrentUser(newUser);

        return { success: true, message: "Registration successful", user: newUser };
    }

    // Login a user
    loginUser(username, password) {
        if (!username || !password) {
            return { success: false, message: "Username and password are required" };
        }

        // Get all users
        const users = this.getAllUsers();

        // Find user with matching credentials
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return { success: false, message: "Invalid username or password" };
        }

        // Update last login time
        user.lastLogin = new Date().toISOString();

        // Update user in users array
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            this.saveAllUsers(users);
        }

        // Set as current user
        this.setCurrentUser(user);

        return { success: true, message: "Login successful", user };
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        } catch (error) {
            console.error("Error saving current user:", error);
            return false;
        }
    }

    // Logout current user
    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        return { success: true, message: "Logout successful" };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user data
    updateUserData(userData) {
        if (!this.currentUser) {
            return { success: false, message: "No user is logged in" };
        }

        // Get all users
        const users = this.getAllUsers();

        // Find user index
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: "User not found" };
        }

        // Update user data (preserving sensitive fields)
        const updatedUser = {
            ...this.currentUser,
            ...userData,
            // Preserve these fields
            id: this.currentUser.id,
            username: this.currentUser.username,
            password: this.currentUser.password,
            createdAt: this.currentUser.createdAt
        };

        // Update in users array
        users[userIndex] = updatedUser;

        // Save updated users array
        if (!this.saveAllUsers(users)) {
            return { success: false, message: "Error saving user data" };
        }

        // Update current user
        this.setCurrentUser(updatedUser);

        return { success: true, message: "User data updated successfully", user: updatedUser };
    }

    // Save itinerary for current user
    saveItinerary(itinerary) {
        if (!this.currentUser) {
            return { success: false, message: "No user is logged in" };
        }

        // Ensure itineraries array exists
        if (!this.currentUser.itineraries) {
            this.currentUser.itineraries = [];
        }

        // Add itinerary to user's itineraries
        this.currentUser.itineraries.push(itinerary);

        // Update user data
        return this.updateUserData({ itineraries: this.currentUser.itineraries });
    }

    // Delete itinerary for current user
    deleteItinerary(itineraryId) {
        if (!this.currentUser || !this.currentUser.itineraries) {
            return { success: false, message: "No user is logged in or no itineraries found" };
        }

        // Filter out the itinerary to delete
        const updatedItineraries = this.currentUser.itineraries.filter(i => i.id !== itineraryId);

        // Check if any itinerary was removed
        if (updatedItineraries.length === this.currentUser.itineraries.length) {
            return { success: false, message: "Itinerary not found" };
        }

        // Update user data
        return this.updateUserData({ itineraries: updatedItineraries });
    }

    // Add feedback for current user
    addFeedback(feedback) {
        if (!this.currentUser) {
            return { success: false, message: "No user is logged in" };
        }

        // Ensure feedback array exists
        if (!this.currentUser.feedback) {
            this.currentUser.feedback = [];
        }

        // Add feedback to user's feedback
        this.currentUser.feedback.push(feedback);

        // Update user data
        return this.updateUserData({ feedback: this.currentUser.feedback });
    }

    // Add trip for current user
    addTrip(trip) {
        if (!this.currentUser) {
            return { success: false, message: "No user is logged in" };
        }

        // Ensure trips array exists
        if (!this.currentUser.trips) {
            this.currentUser.trips = [];
        }

        // Add trip to user's trips
        this.currentUser.trips.push(trip);

        // Update user data
        return this.updateUserData({ trips: this.currentUser.trips });
    }
}

// Create global instance of UserManager
const userManager = new UserManager();

// Initialize user authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("User authentication initialized");
    
    // Check login status and update UI
    updateAuthUI();
    
    // Add event listeners to login/register forms if they exist
    setupAuthListeners();
});

// Update UI based on authentication status
function updateAuthUI() {
    const loginSection = document.getElementById('login-section');
    const userProfileSection = document.getElementById('user-profile');
    const profileUsername = document.getElementById('profile-username');
    
    if (!loginSection || !userProfileSection) {
        // Not on a page with auth UI
        return;
    }
    
    if (userManager.isLoggedIn()) {
        // User is logged in
        loginSection.style.display = 'none';
        userProfileSection.style.display = 'block';
        
        if (profileUsername) {
            profileUsername.textContent = userManager.getCurrentUser().username;
        }
        
        // Load user data
        const currentUser = userManager.getCurrentUser();
        loadUserData(currentUser);
    } else {
        // User is not logged in
        loginSection.style.display = 'block';
        userProfileSection.style.display = 'none';
    }
}

// Set up authentication listeners
function setupAuthListeners() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            const result = userManager.loginUser(username, password);
            
            if (result.success) {
                // Clear input fields
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                
                // Update UI
                updateAuthUI();
            } else {
                // Show error message
                alert(result.message);
            }
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            const result = userManager.registerUser(username, password);
            
            if (result.success) {
                // Clear input fields
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                
                // Update UI
                updateAuthUI();
                
                // Show success message
                alert(result.message);
            } else {
                // Show error message
                alert(result.message);
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            userManager.logoutUser();
            updateAuthUI();
        });
    }
}

// Load user data into profile
function loadUserData(user) {
    // Load saved itineraries
    if (typeof loadSavedItineraries === 'function' && user.itineraries) {
        loadSavedItineraries(user.itineraries);
    }
    
    // Load past trips
    if (typeof loadPastTrips === 'function' && user.trips) {
        loadPastTrips(user.trips);
    }
    
    // Load feedback
    if (typeof loadFeedback === 'function' && user.feedback) {
        loadFeedback(user.feedback);
    }
}

// Export functions for use in other files
window.userAuth = {
    isLoggedIn: () => userManager.isLoggedIn(),
    getCurrentUser: () => userManager.getCurrentUser(),
    login: (username, password) => userManager.loginUser(username, password),
    register: (username, password) => userManager.registerUser(username, password),
    logout: () => userManager.logoutUser(),
    saveItinerary: (itinerary) => userManager.saveItinerary(itinerary),
    deleteItinerary: (itineraryId) => userManager.deleteItinerary(itineraryId),
    addFeedback: (feedback) => userManager.addFeedback(feedback),
    addTrip: (trip) => userManager.addTrip(trip),
    updateUserData: (userData) => userManager.updateUserData(userData)
};
