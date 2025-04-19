// Embedded city data to avoid loading issues
const manualCityData = {
  "Varanasi": {
    "image": "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTMx6jQGbwjZqL5BQahmV5yENHLQLKksILCgqapVioWrc_ub2qKrOXNYbn2Eypfk6ca976O3xjqXU3ygtUHuYk4z72PfrQXdI-UqrnwoQ",
    "places": [
      {
        "name": "Kashi Vishwanath Temple",
        "description": "One of the most famous Hindu temples dedicated to Lord Shiva.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Kashi_Vishwanath.jpg"
      },
      {
        "name": "Dashashwamedh Ghat",
        "description": "Famous for the Ganga Aarti held every evening on the banks of the Ganges.",
        "image": "https://www.varanasiguru.com/wp-content/uploads/2021/03/Dashashwamedh-Ghat.jpg"
      },
      {
        "name": "Sarnath",
        "description": "Sarnath is a town located eight kilometres northeast of Varanasi, near the confluence of the Ganges and the Varuna rivers",
        "image": "https://shrikashidham.com/wp-content/uploads/2023/09/sarnath-varanasi-e1693918484606.jpg"
      }
    ]
  },
  "Puri": {
    "image": "https://bhubaneswartourism.in/images/places-to-visit/headers/puri-beach-tourism-entry-fee-timings-holidays-reviews-header.jpg",
    "places": [
      {
        "name": "Jagannath Temple",
        "description": "Renowned temple and pilgrimage site dedicated to Lord Jagannath.",
        "image": "https://sanity-admin.rudraksha-ratna.com/static/images/blogs/Lord+Jagannath+2.jpg"
      },
      {
        "name": "Puri Beach",
        "description": "Golden sand beach popular for sunrise views and sea festivals.",
        "image": "https://puriholidayresort.com/blog/wp-content/uploads/2017/12/image4.jpg"
      }
    ]
  },
  "Deoghar": {
    "image": "https://www.pilgrimagetour.in/blog/wp-content/uploads/2023/11/Best-Time-to-Visit-Baba-Baidyanath-Temple.jpg",
    "places": [
      {
        "name": "Baidyanath Temple",
        "description": "One of the twelve Jyotirlingas, attracting pilgrims from all over India.",
        "image": "https://baidyanathnagri.com/wp-content/uploads/2022/01/baidyanath-nagri-6-1.jpg.webp"
      }
    ]
  },
  "Darjeeling": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Tea_Estate%2C_Darjeeling.jpg/1200px-Tea_Estate%2C_Darjeeling.jpg",
    "places": [
      {
        "name": "Tiger Hill",
        "description": "Famous for panoramic sunrise views of Mount Kanchenjunga.",
        "image": "https://www.elginhotels.com/wp-content/uploads/2020/03/tiger-hill-01.png.webp"
      },
      {
        "name": "Batasia Loop",
        "description": "A scenic railway loop with gardens and views of the Himalayas.",
        "image": "https://darjeelingyatra.com/images/batasia-loop/batasia-loop-500-400.webp"
      }
    ]
  },
  "Dehradun": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/09/Best-Places-to-Visit-in-Dehradun-Uttarakhand.jpg",
    "places": [
      {
        "name": "Robber's Cave",
        "description": "A popular picnic and tourist spot known for its natural cave formation.",
        "image": "https://d3sftlgbtusmnv.cloudfront.net/blog/wp-content/uploads/2024/12/Robbers-Caves-Cover-Photo-840x425.jpg"       
      },
      {
        "name": "Sahastradhara",
        "description": "Sulphur water spring and scenic natural beauty spot.",
        "image": "https://rajajijunglesafari.com/wp-content/uploads/sahastradhara-dehradun-4.jpg"
      }
    ]
  },
  "Manali": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Manali.jpg",
    "places": [
      {
        "name": "Hadimba Temple",
        "description": "An ancient cave temple surrounded by cedar forest.",
        "image": "https://spiceholiday.in/wp-content/uploads/2023/07/hadimba-himachal.jpg"
      },
      {
        "name": "Solang Valley",
        "description": "Famous for adventure sports and paragliding.",
        "image": "https://img.indiahighlight.com/1170x550/ih/uploads/1733894516.jpg"
      }
    ]
  },
  "Gangtok": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Gangtok-Sikkim.jpg",
    "places": [
      {
        "name": "Tsomgo Lake",
        "description": "Glacial lake surrounded by mountains, also called Changu Lake.",
        "image": "https://cdn.guidetour.in/wp-content/uploads/2023/04/Tsomgo-Lake-Travel-Guide.jpg.webp"
      },
      {
        "name": "Rumtek Monastery",
        "description": "Largest monastery in Sikkim, rich in Buddhist culture.",
        "image": "https://pyt-blogs.gumlet.io/2020/05/kinshuk-bose-oXHCpSjWSqs-unsplash-1-scaled.jpg?auto=format&ixlib=php-3.3.0"    
      }
    ]
  },
  "Kolkata": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Kolkata-West-Bengal.jpg",
    "places": [
      {
        "name": "Victoria Memorial",
        "description": "A large marble building dedicated to Queen Victoria, surrounded by gardens.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2019/05/Victoria-Memorial_600.jpg"
      },
      {
        "name": "Howrah Bridge",
        "description": "An engineering marvel spanning the Hooghly River.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Howrah_bridge_at_night.jpg/1200px-Howrah_bridge_at_night.jpg"
      },
      {
        "name": "Dakshineswar Kali Temple",
        "description": "One of the most famous Hindu temples dedicated to Goddess Kali.",
        "image": "https://meghasen.in/wp-content/uploads/2023/09/Dakshineswar_Temple1.jpg"
      }
    ]
  },
  "Delhi": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Delhi.jpg",
    "places": [
      {
        "name": "Red Fort",
        "description": "A historic fort that was the main residence of the emperors of the Mughal dynasty.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2019/02/Red-Fort.jpg"
      },
      {
        "name": "India Gate",
        "description": "A war memorial dedicated to the soldiers of the British Indian Army who died in the First World War.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2019/02/India-Gate.jpg"
      },
      {
        "name": "Qutub Minar",
        "description": "A UNESCO World Heritage Site, the Qutub Minar is a 73-meter tall minaret built in 1193.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2019/02/Qutub-Minar.jpg"
      }
    ]
  },
  "Mumbai": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Mumbai-Maharashtra.jpg",
    "places": [
      {
        "name": "Gateway of India",
        "description": "An arch monument built during the 20th century to commemorate the landing of King George V and Queen Mary.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/09/Gateway-of-India.jpg"
      },
      {
        "name": "Marine Drive",
        "description": "A 3.6-kilometer-long boulevard in South Mumbai that offers a panoramic view of the coastline.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/09/Marine-Drive.jpg"
      },
      {
        "name": "Elephanta Caves",
        "description": "A UNESCO World Heritage Site, these ancient cave temples are dedicated to Lord Shiva.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/09/Elephanta-Caves.jpg"
      }
    ]
  },
  "Jaipur": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Jaipur-Rajasthan.jpg",
    "places": [
      {
        "name": "Amber Fort",
        "description": "A majestic fort known for its artistic style elements, blending both Hindu and Muslim architecture.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/07/Amber-Fort-and-Palace.jpg"
      },
      {
        "name": "Hawa Mahal",
        "description": "A palace with a unique five-story exterior that resembles the honeycomb of a beehive with 953 small windows.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/07/Hawa-Mahal.jpg"
      },
      {
        "name": "City Palace",
        "description": "A palace complex that includes the Chandra Mahal and Mubarak Mahal palaces and other buildings.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/07/City-Palace.jpg"
      }
    ]
  },
  "Goa": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Goa.jpg",
    "places": [
      {
        "name": "Calangute Beach",
        "description": "Known as the 'Queen of Beaches', it is the largest beach in North Goa and one of the most popular.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2019/03/Calangute-Beach.jpg"
      },
      {
        "name": "Basilica of Bom Jesus",
        "description": "A UNESCO World Heritage Site, this basilica contains the mortal remains of St. Francis Xavier.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2019/03/Basilica-of-Bom-Jesus.jpg"
      },
      {
        "name": "Fort Aguada",
        "description": "A well-preserved 17th-century Portuguese fort standing on Sinquerim Beach overlooking the Arabian Sea.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2019/03/Fort-Aguada.jpg"
      }
    ]
  },
  "Agra": {
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2021/02/Best-Places-to-Visit-in-Agra-Uttar-Pradesh.jpg",
    "places": [
      {
        "name": "Taj Mahal",
        "description": "One of the seven wonders of the world, this ivory-white marble mausoleum was built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/09/Taj-Mahal.jpg"
      },
      {
        "name": "Agra Fort",
        "description": "A UNESCO World Heritage site, this red sandstone fort was the main residence of the emperors of the Mughal Dynasty.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/09/Agra-Fort.jpg"
      },
      {
        "name": "Fatehpur Sikri",
        "description": "A city founded in 1569 by Emperor Akbar, it served as the capital of the Mughal Empire from 1571 to 1585.",
        "image": "https://www.fabhotels.com/blog/wp-content/uploads/2018/09/Fatehpur-Sikri.jpg"
      }
    ]
  }
};

// Function to search destinations
function searchDestinations() {
    console.log('Search function called');
    const query = document.getElementById('search-bar').value.trim();
    if (!query) {
        alert('Please enter a city name to search');
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '<p>Searching...</p>';
    searchResults.style.display = 'block';
    
    // Hide destinations list if it's visible
    const destinationsList = document.getElementById('destinations-list');
    if (destinationsList) {
        destinationsList.style.display = 'none';
    }
    
    // Search for matching cities
    const matchingCities = [];
    for (const cityName in manualCityData) {
        if (cityName.toLowerCase().includes(query.toLowerCase())) {
            matchingCities.push({
                name: cityName,
                image: manualCityData[cityName].image || 
                       (manualCityData[cityName].places && manualCityData[cityName].places.length > 0 ? 
                        manualCityData[cityName].places[0].image : null)
            });
        }
    }
    
    // Display search results
    if (matchingCities.length === 0) {
        searchResults.innerHTML = '<p>No cities found matching your search.</p>';
        return;
    }
    
    let html = '<h3>Search Results</h3><div class="search-results-grid">';
    
    matchingCities.forEach(city => {
        const cityImage = city.image || 'https://via.placeholder.com/640x360?text=' + encodeURIComponent(city.name);
        
        html += `
            <div class="destination-card">
                <div class="destination-image">
                    <img src="${cityImage}" alt="${city.name}">
                </div>
                <div class="destination-info">
                    <h3>${city.name}</h3>
                    <p>Explore the beautiful city of ${city.name} and its famous attractions.</p>
                    <a href="destination_details.html?name=${encodeURIComponent(city.name)}" class="view-details-btn">View Details</a>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    searchResults.innerHTML = html;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Destinations.js loaded with embedded data');
    
    // Set up search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    
    if (searchBtn) {
        console.log('Search button found, adding event listener');
        searchBtn.addEventListener('click', searchDestinations);
    } else {
        console.error('Search button not found');
    }
    
    if (searchBar) {
        console.log('Search bar found, adding event listener');
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDestinations();
            }
        });
    } else {
        console.error('Search bar not found');
    }
    
    // Remove any existing reset button
    const resetBtn = document.getElementById('reset-search');
    if (resetBtn) {
        resetBtn.parentNode.removeChild(resetBtn);
    }
    
    // Clear the destinations list
    const destinationsList = document.getElementById('destinations-list');
    if (destinationsList) {
        destinationsList.innerHTML = '';
    } else {
        console.error('Destinations list not found');
    }
});
