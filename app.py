from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
import logging
import traceback
import sys
import webbrowser
import openai
import requests
import google.generativeai as genai

# OpenAI API key (kept for backward compatibility)
openai.api_key = "your_openai_api_key"

# Google Gemini API key - replace with your actual API key
# Note: For this demo, we'll use a fallback approach if the API key is invalid
GEMINI_API_KEY = "your_gemini_api_key"
try:
    genai.configure(api_key=GEMINI_API_KEY)
    print("Gemini API configured successfully")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

RAPIDAPI_KEY = "abc5d9fa4amsh6dd2515e6a1b71dp1568c3jsn238bb2bd9703"
RAPIDAPI_HOST = "irctc1.p.rapidapi.com"

headers = {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": RAPIDAPI_KEY
}

@app.route("/")
def home():
    return "TripGenie Backend is active and running!"

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"status": "success", "message": "Test endpoint is working!"})

@app.route("/api/trains", methods=["GET"])
def train_between_stations():
    from_station = request.args.get("from")
    to_station = request.args.get("to")

    if not from_station or not to_station:
        return jsonify({"error": "Missing from or to station code"}), 400

    url = f"https://{RAPIDAPI_HOST}/api/v3/trainBetweenStations?fromStationCode={from_station}&toStationCode={to_station}"
    response = requests.get(url, headers=headers)
    data = response.json()

    for train in data.get("data", []):
        train["booking_url"] = "https://www.irctc.co.in/nget/train-search"

    return jsonify(data)

@app.route("/api/fare", methods=["GET"])
def get_fare():
    train_no = request.args.get("trainNo")
    from_station = request.args.get("from")
    to_station = request.args.get("to")

    if not train_no or not from_station or not to_station:
        return jsonify({"error": "Missing parameters"}), 400

    url = f"https://{RAPIDAPI_HOST}/api/v2/getFare?trainNo={train_no}&fromStationCode={from_station}&toStationCode={to_station}"
    response = requests.get(url, headers=headers)
    data = response.json()

    return jsonify(data)

@app.route("/api/station-trains", methods=["GET"])
def trains_by_station():
    station_code = request.args.get("station")

    if not station_code:
        return jsonify({"error": "Missing station code"}), 400

    url = f"https://{RAPIDAPI_HOST}/api/v3/getTrainsByStation?stationCode={station_code}"
    response = requests.get(url, headers=headers)
    data = response.json()

    return jsonify(data)

@app.route("/api/live-status", methods=["GET"])
def live_train_status():
    train_no = request.args.get("trainNo")
    start_day = request.args.get("startDay", "1")

    if not train_no:
        return jsonify({"error": "Missing train number"}), 400

    url = f"https://{RAPIDAPI_HOST}/api/v1/liveTrainStatus?trainNo={train_no}&startDay={start_day}"
    response = requests.get(url, headers=headers)
    data = response.json()

    return jsonify(data)

@app.route('/book-train', methods=['GET'])
def redirect_to_irctc():
    train_number = request.args.get('train')
    from_station = request.args.get('from')
    to_station = request.args.get('to')

    irctc_url = "https://www.irctc.co.in/nget/train-search"

    print(f"Redirecting to IRCTC for train {train_number} from {from_station} to {to_station}")
    return redirect(irctc_url)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )
        reply = response["choices"][0]["message"]["content"]
        return jsonify({"response": reply})
    except Exception as e:
        print(f"LLM error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/gemini-plan", methods=["POST"])
def gemini_plan():
    print("Gemini plan endpoint called")
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        destination = data.get("destination", "")
        days = data.get("days", 3)
        preferences = data.get("preferences", [])

        print(f"Processing request for {destination} for {days} days with preferences: {preferences}")

        if not destination:
            print("Error: Destination is required")
            return jsonify({"error": "Destination is required"}), 400

        try:
            try:
                # Configure the model
                print("Configuring Gemini model")
                model = genai.GenerativeModel('gemini-pro')

                # Create the prompt
                prompt = f"""Create a detailed {days}-day travel itinerary for {destination}.

                Traveler preferences: {', '.join(preferences) if preferences else 'General sightseeing'}

                For each day, include:
                1. Morning activities with specific locations and timing
                2. Lunch recommendations (local cuisine options)
                3. Afternoon activities with specific locations and timing
                4. Evening activities and dinner recommendations
                5. Notable landmarks or attractions to visit

                Also include:
                - Transportation tips between locations
                - Cultural etiquette tips specific to the destination
                - Estimated costs for activities where applicable
                - Weather considerations for the destination

                Format the response in a clear, day-by-day structure.
                """

                print("Sending prompt to Gemini")
                # Generate the response
                response = model.generate_content(prompt)
                print("Received response from Gemini")

                # Return the formatted itinerary
                result = {
                    "itinerary": response.text,
                    "destination": destination,
                    "days": days
                }
                print(f"Returning result with {len(response.text)} characters")
                return jsonify(result)
            except Exception as e:
                print(f"Error using Gemini API: {e}")
                print("Using fallback itinerary generation")

                # Fallback itinerary for demo purposes
                fallback_itinerary = generate_fallback_itinerary(destination, days, preferences)

                result = {
                    "itinerary": fallback_itinerary,
                    "destination": destination,
                    "days": days,
                    "note": "This is a fallback itinerary generated without Gemini API. To use Gemini, please provide a valid API key."
                }
                return jsonify(result)


        except Exception as e:
            print(f"Gemini error: {e}")
            return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"General error in gemini_plan: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/open_trivago")
def open_trivago():
    destination = request.args.get("destination")
    if destination:
        url = f"https://www.trivago.in/en-IN/srl?search={destination}"
        webbrowser.open(url)
        return jsonify({"status": "success", "message": f"Opened Trivago for {destination}"})
    return jsonify({"status": "error", "message": "Destination not provided"}), 400

@app.route("/api/search/<destination>", methods=["GET"])
def search(destination):
    destinations = [
        {"id": 1, "name": "Kolkata", "description": "City of Joy"},
        {"id": 2, "name": "Mumbai", "description": "City of Dreams"},
        {"id": 3, "name": "Delhi", "description": "Capital City"},
        {"id": 4, "name": "Goa", "description": "Beach Paradise"},
        {"id": 5, "name": "Varanasi", "description": "Spiritual Capital"}
    ]
    filtered = [d for d in destinations if destination.lower() in d["name"].lower()]
    return jsonify(filtered)

@app.route("/destination/details")
def destination_details():
    name = request.args.get("name")
    mock_data = {
        "Kolkata": {
            "hotels": ["The Oberoi", "ITC Sonar"],
            "places": ["Victoria Memorial", "Howrah Bridge"],
            "food": ["Macher Jhol", "Rasgulla"]
        },
        "Mumbai": {
            "hotels": ["Taj Mahal Palace", "The St. Regis"],
            "places": ["Gateway of India", "Marine Drive"],
            "food": ["Vada Pav", "Bombay Sandwich"]
        }
    }
    return jsonify(mock_data.get(name, {}))

# Destination-specific recommendations database
destination_recommendations = {
    "kolkata": {
        "breakfast": {
            "vegetarian": ["Flurys for English breakfast and pastries", "Maharaja for South Indian vegetarian breakfast", "Teej for traditional Bengali vegetarian breakfast"],
            "non-vegetarian": ["Balwant Singh's Eating House for Punjabi breakfast with egg dishes", "Terreti Bazaar for Chinese breakfast", "Sharma Dhaba for North Indian breakfast with egg parathas"],
            "cafes": ["8th Day Cafe for continental breakfast", "The Bakery Cafe for fresh pastries", "Mrs. Magpie for English breakfast"],
            "street_food": ["Tiretti Bazaar for Chinese breakfast", "College Street for traditional Bengali breakfast", "Dacres Lane for quick breakfast options"]
        },
        "lunch": {
            "vegetarian": ["6 Ballygunge Place for vegetarian Bengali cuisine", "Banana Leaf for South Indian thali", "Khandani Rajdhani for vegetarian Rajasthani thali", "Haldiram's for North Indian vegetarian food"],
            "non-vegetarian": ["Arsalan for Mughlai and Biryani", "Oh! Calcutta for authentic Bengali fish and meat dishes", "Shiraz Golden Restaurant for Biryani and kebabs", "Aminia for Mughlai cuisine"],
            "cafes": ["Sienna Cafe for light lunch", "Paris Cafe for European lunch options", "Roastery Coffee House for cafe-style lunch"],
            "street_food": ["Vivekananda Park for rolls and chaat", "New Market area for variety of street foods", "Decker's Lane for quick lunch options"]
        },
        "dinner": {
            "vegetarian": ["Aaheli for traditional Bengali vegetarian thali", "Kewpie's Kitchen for home-style Bengali vegetarian", "Chowman for Indo-Chinese vegetarian options", "Barbeque Nation for vegetarian grill"],
            "non-vegetarian": ["Peter Cat for Chelo Kebabs", "Mocambo for Continental cuisine", "Shiraz Golden Restaurant for Biryani", "Bhojohori Manna for Bengali fish and meat dishes"],
            "cafes": ["The Bhoj Company for casual dinner", "Cafe Mezzuna for Mediterranean dinner", "The Bridge for fusion cuisine"],
            "street_food": ["Park Street for evening street food", "Esplanade for variety of evening snacks", "Lake Market for late night food options"]
        },
        "attractions": {
            "cultural": ["Victoria Memorial - colonial-era marble building and museum", "Indian Museum - the oldest and largest museum in India", "Marble Palace - 19th century mansion with art collections", "Academy of Fine Arts - art gallery and cultural center", "Tagore's House (Jorasanko Thakurbari) - ancestral home of Rabindranath Tagore", "Netaji Bhawan - Subhas Chandra Bose's house turned museum", "Kolkata Centre for Creativity - modern art and cultural space"],
            "religious": ["Dakshineswar Kali Temple - famous Hindu temple on the banks of Hooghly River", "Kalighat Temple - one of the 51 Shakti Peethas", "St. Paul's Cathedral - largest cathedral in Kolkata", "Nakhoda Mosque - largest mosque in the city", "Paresnath Jain Temple - ornate Jain temple with mirrors and colored stones", "ISKCON Temple Kolkata - modern Krishna temple", "Birla Mandir - Hindu temple made of white marble"],
            "nature": ["Botanical Gardens - home to the Great Banyan Tree", "Rabindra Sarobar Lake - large artificial lake with walking paths", "Eco Park - urban recreational area with eco-zones", "Alipore Zoo - India's oldest formally stated zoological park", "Millennium Park - riverfront park along the Hooghly", "Eden Gardens - famous cricket ground with gardens"],
            "beach": ["Digha Beach - nearest popular sea beach (180 km from Kolkata)", "Mandarmani Beach - less crowded beach with gentle waves (170 km from Kolkata)", "Tajpur Beach - pristine beach between Digha and Mandarmani", "Bakkhali Beach - serene beach with mangrove forests (125 km from Kolkata)", "Shankarpur Beach - fishing harbor beach near Digha", "Frazerganj Beach - quiet beach in the Sundarbans region"],
            "shopping": ["New Market - historic shopping destination with over 2000 stalls", "South City Mall - upscale shopping mall", "College Street (Boi Para) - world's largest second-hand book market", "Gariahat Market - traditional market for sarees and clothing", "Dakshinapan Shopping Centre - government emporium for handicrafts", "Hatibagan Market - traditional North Kolkata market"],
            "adventure": ["Sundarbans National Park - mangrove forest and tiger reserve (day trip)", "River cruise on the Hooghly - boat tours of the city's riverfront", "Science City - science museum with adventure activities", "Wet O Wild - water park with slides and rides", "Aquatica - largest water park in Eastern India", "Rajarhat Eco Tourism Park - adventure sports and activities"],
            "budget": ["College Street - book shopping and coffee", "Maidan - large urban park", "Millennium Park - riverfront walks", "Kumartuli (pottery village) - artist colony where idols are made", "Princep Ghat - historic monument and riverfront", "Eco Park - affordable entry with many attractions"],
            "luxury": ["Park Street shopping - upscale retail therapy", "Quest Mall - luxury shopping experience", "The Oberoi Grand experience - colonial-era luxury hotel", "ITC Sonar spa - luxury spa treatments", "Taj Bengal - fine dining and luxury experience", "CC2 (City Centre 2) - premium shopping mall"],
            "family": ["Science City - interactive science museum", "Nicco Park - amusement park with rides", "Aquatica Water Park - water slides and pools", "Eco Park - boating and recreational activities", "Mother's Wax Museum - wax statues of famous personalities", "Alipore Zoo - family-friendly animal viewing", "Snow Park - indoor snow experience"]
        },
        "transport": ["Kolkata Metro - the oldest metro in India", "Yellow Ambassador taxis - iconic to the city", "Auto-rickshaws for short distances", "Tram service - one of the last remaining in India", "App-based cabs like Uber and Ola", "Ferry services across the Hooghly River", "Cycle rickshaws in some areas"],
        "cultural_tips": ["Kolkata is known as the cultural capital of India", "People are passionate about literature, art, and politics", "Bengali is the main language, but English is widely understood", "Respect for elders is important in Bengali culture", "The city has a relaxed pace compared to other Indian metros", "Durga Puja (Sept-Oct) is the biggest festival", "Bengalis love their sweets, especially rosogolla and sandesh"],
        "budget_info": {
            "budget": {
                "accommodation": "₹1,000-2,500 per night for budget hotels",
                "meals": "₹150-300 per meal at local eateries",
                "attractions": "₹20-100 for most attractions",
                "transport": "₹5-20 for metro/bus, ₹100-300 for daily taxi use"
            },
            "mid_range": {
                "accommodation": "₹2,500-6,000 per night for mid-range hotels",
                "meals": "₹300-800 per meal at good restaurants",
                "attractions": "₹100-500 for attractions including guided tours",
                "transport": "₹300-700 for daily taxi/Uber use"
            },
            "luxury": {
                "accommodation": "₹6,000-15,000+ per night for luxury hotels",
                "meals": "₹800-2,500+ per meal at fine dining restaurants",
                "attractions": "₹500-2,000 for premium experiences and private tours",
                "transport": "₹1,000-3,000 for daily private car hire"
            }
        }
    },
    "mumbai": {
        "breakfast": ["Cafe Madras for South Indian", "Kyani & Co. for Parsi breakfast", "Pancham Puriwala for Puri Bhaji"],
        "lunch": ["Trishna for seafood", "Britannia & Co. for Parsi cuisine", "Khyber for North Indian", "Chetana for Gujarati Thali"],
        "dinner": ["The Table for international cuisine", "Mahesh Lunch Home for seafood", "Copper Chimney for North Indian", "Bastian for seafood"],
        "attractions": {
            "cultural": ["Gateway of India", "Chhatrapati Shivaji Terminus", "Kala Ghoda Arts District", "Jehangir Art Gallery", "Dr. Bhau Daji Lad Museum"],
            "religious": ["Siddhivinayak Temple", "Haji Ali Dargah", "ISKCON Temple", "Mahalakshmi Temple", "Mumbadevi Temple"],
            "nature": ["Marine Drive", "Sanjay Gandhi National Park", "Elephanta Caves", "Juhu Beach", "Versova Beach"],
            "shopping": ["Colaba Causeway", "Linking Road", "Fashion Street", "Crawford Market", "High Street Phoenix Mall"],
            "adventure": ["Sailing at Gateway of India", "Kanheri Caves trek", "EsselWorld and Water Kingdom"],
            "budget": ["Dharavi Slum Tour", "Juhu Beach", "Hanging Gardens", "Bandstand Promenade"],
            "luxury": ["Taj Mahal Palace Hotel experience", "Palladium Mall", "Nariman Point"],
            "family": ["Chowpatty Beach", "Taraporewala Aquarium", "Nehru Planetarium", "Kidzania", "Jijamata Udyaan Zoo"]
        },
        "transport": ["Mumbai Local Trains - the lifeline of the city", "BEST buses for connectivity", "Black and yellow taxis", "Auto-rickshaws in suburbs", "Metro for limited routes", "Ferry services to Alibaug and Elephanta"],
        "cultural_tips": ["Mumbai is India's financial and entertainment capital", "Home to Bollywood - the Hindi film industry", "Fast-paced city with a 'never stop' attitude", "Monsoon season (June-September) can disrupt travel plans", "Street food is a major part of Mumbai culture"]
    },
    "delhi": {
        "breakfast": ["Saravana Bhavan for South Indian", "Karim's for Nihari and Paya", "Paranthe Wali Gali for stuffed parathas"],
        "lunch": ["Bukhara for North Indian", "Dakshin for South Indian", "Andhra Bhavan for thali", "Khan Chacha for kebabs"],
        "dinner": ["Indian Accent for modern Indian", "Dum Pukht for Awadhi cuisine", "Moti Mahal for butter chicken", "Spice Route for Pan-Asian"],
        "attractions": {
            "cultural": ["Red Fort", "Humayun's Tomb", "National Museum", "Akshardham Temple", "India Gate"],
            "religious": ["Jama Masjid", "Lotus Temple", "Akshardham Temple", "Gurudwara Bangla Sahib", "ISKCON Temple"],
            "nature": ["Lodhi Gardens", "Deer Park", "Garden of Five Senses", "Yamuna Biodiversity Park", "Nehru Park"],
            "shopping": ["Connaught Place", "Khan Market", "Sarojini Nagar Market", "Dilli Haat", "Chandni Chowk"],
            "adventure": ["Adventure Island", "Delhi Ridge trek", "National Zoological Park"],
            "budget": ["Jantar Mantar", "Raj Ghat", "Agrasen ki Baoli", "Hauz Khas Village"],
            "luxury": ["DLF Emporio Mall", "The Oberoi experience", "Khan Market shopping"],
            "family": ["National Science Centre", "Children's Park at India Gate", "National Rail Museum", "Worlds of Wonder"]
        },
        "transport": ["Delhi Metro - extensive network covering most areas", "Auto-rickshaws for short distances", "Cycle rickshaws in Old Delhi", "App-based cabs like Uber and Ola", "DTC buses for budget travel"],
        "cultural_tips": ["Delhi is a blend of old and new India", "Extreme weather - very hot summers and cold winters", "Dress modestly, especially at religious sites", "Be cautious of scams targeting tourists", "English is widely spoken in tourist areas"]
    },
    "goa": {
        "breakfast": ["Infantaria for bakery items", "Cafe Bodega for continental breakfast", "Brittos for beachside breakfast"],
        "lunch": ["Gunpowder for South Indian", "Mum's Kitchen for authentic Goan", "Fisherman's Wharf for seafood", "Vinayak for seafood thali"],
        "dinner": ["Thalassa for Greek cuisine", "A Reverie for fine dining", "Martin's Corner for Goan cuisine", "Antares for Australian fusion"],
        "attractions": {
            "cultural": ["Basilica of Bom Jesus", "Se Cathedral", "Museum of Goa", "Ancestral Goa", "Fontainhas (Latin Quarter)"],
            "religious": ["Basilica of Bom Jesus", "Se Cathedral", "Mangeshi Temple", "Shantadurga Temple", "Mangueshi Temple"],
            "nature": ["Dudhsagar Falls", "Butterfly Beach", "Mollem National Park", "Salim Ali Bird Sanctuary", "Cotigao Wildlife Sanctuary"],
            "shopping": ["Anjuna Flea Market", "Mapusa Market", "Arpora Night Market", "Calangute Market Square", "Panjim Municipal Market"],
            "adventure": ["Water sports at Baga Beach", "Scuba diving at Grande Island", "White water rafting at Mhadei River", "Parasailing at Anjuna", "Dolphin watching tours"],
            "budget": ["Arambol Beach", "Palolem Beach", "Chapora Fort", "Dona Paula viewpoint"],
            "luxury": ["Casino cruises", "Private yacht tours", "Spa treatments at luxury resorts"],
            "family": ["Baga Beach", "Calangute Beach", "Splashdown Waterpark", "Goa Science Centre", "Bondla Wildlife Sanctuary"]
        },
        "transport": ["Rented scooters and motorcycles - most popular", "Rented cars for families", "Taxis for longer journeys", "Local buses for budget travel", "Ferry services between certain beaches"],
        "cultural_tips": ["Goa has a unique blend of Indian and Portuguese cultures", "Very relaxed and laid-back atmosphere", "Beach shacks offer great seafood at reasonable prices", "Peak season is November to February", "Respect the beach environment and local customs"]
    },
    "mumbai": {
        "budget_info": {
            "budget": {
                "accommodation": "₹1,500-3,500 per night for budget hotels",
                "meals": "₹200-400 per meal at local eateries",
                "attractions": "₹50-200 for most attractions",
                "transport": "₹10-30 for local trains, ₹200-500 for daily taxi use"
            },
            "mid_range": {
                "accommodation": "₹3,500-8,000 per night for mid-range hotels",
                "meals": "₹400-1,000 per meal at good restaurants",
                "attractions": "₹200-800 for attractions including guided tours",
                "transport": "₹500-1,000 for daily taxi/Uber use"
            },
            "luxury": {
                "accommodation": "₹8,000-25,000+ per night for luxury hotels",
                "meals": "₹1,000-4,000+ per meal at fine dining restaurants",
                "attractions": "₹800-3,000 for premium experiences and private tours",
                "transport": "₹1,500-4,000 for daily private car hire"
            }
        }
    },
    "delhi": {
        "budget_info": {
            "budget": {
                "accommodation": "₹1,000-3,000 per night for budget hotels",
                "meals": "₹150-350 per meal at local eateries",
                "attractions": "₹30-150 for most attractions",
                "transport": "₹10-30 for metro, ₹150-400 for daily auto-rickshaw use"
            },
            "mid_range": {
                "accommodation": "₹3,000-7,000 per night for mid-range hotels",
                "meals": "₹350-900 per meal at good restaurants",
                "attractions": "₹150-600 for attractions including guided tours",
                "transport": "₹400-800 for daily taxi/Uber use"
            },
            "luxury": {
                "accommodation": "₹7,000-20,000+ per night for luxury hotels",
                "meals": "₹900-3,500+ per meal at fine dining restaurants",
                "attractions": "₹600-2,500 for premium experiences and private tours",
                "transport": "₹1,200-3,500 for daily private car hire"
            }
        }
    },
    "goa": {
        "breakfast": ["Infantaria for bakery items", "Cafe Bodega for continental breakfast", "Brittos for beachside breakfast"],
        "lunch": ["Gunpowder for South Indian", "Mum's Kitchen for authentic Goan", "Fisherman's Wharf for seafood", "Vinayak for seafood thali"],
        "dinner": ["Thalassa for Greek cuisine", "A Reverie for fine dining", "Martin's Corner for Goan cuisine", "Antares for Australian fusion"],
        "attractions": {
            "cultural": ["Basilica of Bom Jesus", "Se Cathedral", "Museum of Goa", "Ancestral Goa", "Fontainhas (Latin Quarter)"],
            "religious": ["Basilica of Bom Jesus", "Se Cathedral", "Mangeshi Temple", "Shantadurga Temple", "Mangueshi Temple"],
            "nature": ["Dudhsagar Falls", "Butterfly Beach", "Mollem National Park", "Salim Ali Bird Sanctuary", "Cotigao Wildlife Sanctuary"],
            "shopping": ["Anjuna Flea Market", "Mapusa Market", "Arpora Night Market", "Calangute Market Square", "Panjim Municipal Market"],
            "adventure": ["Water sports at Baga Beach", "Scuba diving at Grande Island", "White water rafting at Mhadei River", "Parasailing at Anjuna", "Dolphin watching tours"],
            "budget": ["Arambol Beach", "Palolem Beach", "Chapora Fort", "Dona Paula viewpoint"],
            "luxury": ["Casino cruises", "Private yacht tours", "Spa treatments at luxury resorts"],
            "family": ["Baga Beach", "Calangute Beach", "Splashdown Waterpark", "Goa Science Centre", "Bondla Wildlife Sanctuary"],
            "beach": ["Baga Beach", "Calangute Beach", "Anjuna Beach", "Palolem Beach", "Vagator Beach", "Morjim Beach"]
        },
        "transport": ["Rented scooters and motorcycles - most popular", "Rented cars for families", "Taxis for longer journeys", "Local buses for budget travel", "Ferry services between certain beaches"],
        "cultural_tips": ["Goa has a unique blend of Indian and Portuguese cultures", "Very relaxed and laid-back atmosphere", "Beach shacks offer great seafood at reasonable prices", "Peak season is November to February", "Respect the beach environment and local customs"],
        "budget_info": {
            "budget": {
                "accommodation": "₹800-2,500 per night for budget hotels/hostels (higher in peak season)",
                "meals": "₹200-400 per meal at beach shacks and local eateries",
                "attractions": "₹Free-200 for most beaches and basic attractions",
                "transport": "₹300-600 for daily scooter rental, ₹500-1,000 for taxi rides"
            },
            "mid_range": {
                "accommodation": "₹2,500-7,000 per night for mid-range hotels/resorts",
                "meals": "₹400-1,000 per meal at good restaurants",
                "attractions": "₹200-1,000 for water sports and guided tours",
                "transport": "₹600-1,200 for daily car rental, ₹1,000-2,000 for taxi use"
            },
            "luxury": {
                "accommodation": "₹7,000-30,000+ per night for luxury resorts",
                "meals": "₹1,000-3,000+ per meal at fine dining and beach restaurants",
                "attractions": "₹1,000-5,000 for premium experiences, yacht tours, private guides",
                "transport": "₹2,000-5,000 for daily private car with driver"
            }
        }
    },
    "default": {
        "breakfast": ["Local breakfast cafe", "Hotel breakfast buffet", "Street food breakfast vendors"],
        "lunch": ["Popular local restaurant", "Authentic regional cuisine restaurant", "Tourist-friendly dining spot"],
        "dinner": ["Fine dining restaurant", "Traditional cuisine restaurant", "Popular local eatery"],
        "attractions": {
            "cultural": ["Main museum", "Historical site", "Cultural center", "Art gallery", "Heritage area"],
            "religious": ["Main temple", "Historic church", "Famous mosque", "Religious monument", "Spiritual center"],
            "nature": ["City park", "Nearby natural attraction", "Botanical garden", "Scenic viewpoint", "Waterfront area"],
            "shopping": ["Main market", "Shopping district", "Artisan shops", "Shopping mall", "Souvenir market"],
            "adventure": ["Nearby hiking trail", "Adventure sports center", "Outdoor activity area"],
            "budget": ["Free public attractions", "Public parks", "Walking tours", "Local markets"],
            "luxury": ["High-end shopping district", "Luxury hotel experience", "Exclusive tours"],
            "family": ["Family park", "Interactive museum", "Kid-friendly attraction", "Entertainment center"]
        },
        "transport": ["Public transportation", "Taxis and ride-sharing", "Walking in central areas", "Bicycle rentals", "Tourist buses"],
        "cultural_tips": ["Research local customs before visiting", "Learn a few phrases in the local language", "Dress appropriately for the culture", "Be respectful of local traditions", "Ask locals for recommendations"],
        "budget_info": {
            "budget": {
                "accommodation": "₹1,000-3,000 per night for budget hotels",
                "meals": "₹150-350 per meal at local eateries",
                "attractions": "₹50-200 for most attractions",
                "transport": "₹100-300 for daily public transport use"
            },
            "mid_range": {
                "accommodation": "₹3,000-7,000 per night for mid-range hotels",
                "meals": "₹350-800 per meal at good restaurants",
                "attractions": "₹200-600 for attractions including guided tours",
                "transport": "₹300-700 for daily taxi/transport use"
            },
            "luxury": {
                "accommodation": "₹7,000-20,000+ per night for luxury hotels",
                "meals": "₹800-3,000+ per meal at fine dining restaurants",
                "attractions": "₹600-2,000 for premium experiences and private tours",
                "transport": "₹1,000-3,000 for daily private transport"
            }
        }
    }
}

# Fallback itinerary generation function
def generate_fallback_itinerary(destination, days, preferences):
    preferences_str = ", ".join(preferences) if preferences else "General sightseeing"

    # Convert destination to lowercase for matching
    destination_lower = destination.lower()

    # Get destination-specific recommendations or use default
    dest_data = destination_recommendations.get(destination_lower, destination_recommendations["default"])

    # Map preferences to attraction types and special considerations
    preference_mapping = {
        "cultural": {"types": ["cultural"], "food_style": "local", "activity_level": "moderate"},
        "culture": {"types": ["cultural"], "food_style": "local", "activity_level": "moderate"},
        "historical": {"types": ["cultural"], "food_style": "traditional", "activity_level": "moderate"},
        "religious": {"types": ["religious"], "food_style": "vegetarian", "activity_level": "relaxed"},
        "spiritual": {"types": ["religious"], "food_style": "vegetarian", "activity_level": "relaxed"},
        "nature": {"types": ["nature"], "food_style": "casual", "activity_level": "active"},
        "outdoors": {"types": ["nature", "adventure"], "food_style": "casual", "activity_level": "active"},
        "shopping": {"types": ["shopping"], "food_style": "upscale", "activity_level": "moderate"},
        "adventure": {"types": ["adventure"], "food_style": "non-vegetarian", "activity_level": "very active"},
        "budget": {"types": ["budget"], "food_style": "street food", "activity_level": "moderate"},
        "budget-friendly": {"types": ["budget"], "food_style": "street food", "activity_level": "moderate"},
        "luxury": {"types": ["luxury"], "food_style": "fine dining", "activity_level": "relaxed"},
        "family": {"types": ["family"], "food_style": "family-friendly", "activity_level": "moderate"},
        "family-friendly": {"types": ["family"], "food_style": "family-friendly", "activity_level": "moderate"},
        "food": {"types": ["cultural"], "food_style": "foodie", "activity_level": "relaxed"},
        "cuisine": {"types": ["cultural"], "food_style": "foodie", "activity_level": "relaxed"},
        "foodie": {"types": ["cultural"], "food_style": "foodie", "activity_level": "relaxed"},
        "relaxed": {"types": ["nature"], "food_style": "casual", "activity_level": "relaxed"},
        "beach": {"types": ["beach"], "food_style": "seafood", "activity_level": "relaxed"},
        "nightlife": {"types": ["cultural"], "food_style": "trendy", "activity_level": "active"},
        "photography": {"types": ["cultural", "nature"], "food_style": "casual", "activity_level": "moderate"},
        "art": {"types": ["cultural"], "food_style": "trendy", "activity_level": "relaxed"},
        "history": {"types": ["cultural"], "food_style": "traditional", "activity_level": "moderate"},
        "vegetarian": {"types": ["cultural"], "food_style": "vegetarian", "activity_level": "moderate"},
        "non-vegetarian": {"types": ["cultural"], "food_style": "non-vegetarian", "activity_level": "moderate"},
    }

    # Process preferences
    attraction_types = []
    food_styles = []
    activity_level = "moderate"  # default

    # Process each preference
    for pref in preferences:
        pref_lower = pref.lower()
        if pref_lower in preference_mapping:
            # Add attraction types
            for attraction_type in preference_mapping[pref_lower]["types"]:
                if attraction_type not in attraction_types:
                    attraction_types.append(attraction_type)

            # Add food style
            food_style = preference_mapping[pref_lower]["food_style"]
            if food_style not in food_styles:
                food_styles.append(food_style)

            # Determine activity level (prioritize the most active)
            pref_activity = preference_mapping[pref_lower]["activity_level"]
            if pref_activity == "very active" or (pref_activity == "active" and activity_level != "very active"):
                activity_level = pref_activity
            elif pref_activity == "moderate" and activity_level == "relaxed":
                activity_level = pref_activity

    # If no specific preferences match, use a mix of cultural and nature
    if not attraction_types:
        attraction_types = ["cultural", "nature"]

    # If no food styles specified, use a mix
    if not food_styles:
        food_styles = ["local", "casual", "traditional"]

    # Basic template for a fallback itinerary
    itinerary = f"""# {days}-Day Itinerary for {destination}

This itinerary is customized for your preferences: {preferences_str}.

"""

    # Create lists to track used restaurants
    used_breakfast_places = []
    used_lunch_places = []
    used_dinner_places = []

    # Add food recommendations based on preferences
    def get_food_recommendation(meal_type, day_index, food_style_preference):
        # Get the appropriate used restaurants list
        if meal_type == "breakfast":
            used_places = used_breakfast_places
        elif meal_type == "lunch":
            used_places = used_lunch_places
        elif meal_type == "dinner":
            used_places = used_dinner_places
        else:
            used_places = []

        # Check if we have the new structured food data
        if isinstance(dest_data[meal_type], dict):
            # We have categorized food options

            # Map food style preferences to categories
            category_mapping = {
                "vegetarian": "vegetarian",
                "non-vegetarian": "non-vegetarian",
                "street food": "street_food",
                "foodie": None,  # Will rotate through all categories
                "fine dining": "non-vegetarian",  # Default to non-veg for fine dining
                "casual": "cafes",
                "family-friendly": "cafes",
                "local": None,  # Will rotate through all categories
                "traditional": None,  # Will rotate through all categories
                "upscale": "non-vegetarian",
                "trendy": "cafes",
                "seafood": "non-vegetarian"
            }

            # Get the appropriate category based on food style
            category = category_mapping.get(food_style_preference)

            # If we have a specific category, use it
            if category and category in dest_data[meal_type]:
                options = dest_data[meal_type][category]
                # Filter out used places
                available_options = [opt for opt in options if opt not in used_places]

                # If we have available options, use one
                if available_options:
                    selected_option = available_options[0]  # Take the first available
                    used_places.append(selected_option)  # Mark as used
                    return selected_option
                # If all options in this category are used, reset and start over
                elif options and day_index >= len(options):
                    selected_option = options[day_index % len(options)]
                    return selected_option

            # For foodies or when no specific category, try all categories
            if food_style_preference == "foodie" or not category:
                # Get all categories
                all_options = []
                for _, opts in dest_data[meal_type].items():
                    all_options.extend(opts)

                # Filter out used places
                available_options = [opt for opt in all_options if opt not in used_places]

                # If we have available options, use one
                if available_options:
                    selected_option = available_options[0]  # Take the first available
                    used_places.append(selected_option)  # Mark as used
                    return selected_option
                # If all options are used, reset and start over
                elif all_options:
                    selected_option = all_options[day_index % len(all_options)]
                    return selected_option

            # Fallback to any available category
            all_options = []
            for _, opts in dest_data[meal_type].items():
                all_options.extend(opts)

            # If we have any options at all, use them
            if all_options:
                # Try to find unused options first
                available_options = [opt for opt in all_options if opt not in used_places]
                if available_options:
                    selected_option = available_options[0]
                    used_places.append(selected_option)
                    return selected_option
                else:
                    # All options have been used, just cycle through them
                    selected_option = all_options[day_index % len(all_options)]
                    return selected_option

            # Ultimate fallback
            return f"a local {meal_type} spot"
        else:
            # We have the old format - flat list of options
            options = dest_data[meal_type]
            if not options:
                return f"a local {meal_type} spot"

            # Try to find unused options first
            available_options = [opt for opt in options if opt not in used_places]

            if available_options:
                selected_option = available_options[0]
                used_places.append(selected_option)

                # Apply food style formatting
                if food_style_preference == "street food":
                    return f"{selected_option} or try local street food vendors"
                elif food_style_preference == "fine dining":
                    return f"{selected_option} for an upscale dining experience"
                elif food_style_preference == "vegetarian":
                    return f"{selected_option} (ask for vegetarian options)"
                elif food_style_preference == "seafood" and destination_lower == "goa":
                    return f"{selected_option} for fresh seafood"
                else:
                    return selected_option
            else:
                # All options have been used, just cycle through them
                selected_option = options[day_index % len(options)]

                # Apply food style formatting
                if food_style_preference == "street food":
                    return f"{selected_option} or try local street food vendors"
                elif food_style_preference == "fine dining":
                    return f"{selected_option} for an upscale dining experience"
                elif food_style_preference == "vegetarian":
                    return f"{selected_option} (ask for vegetarian options)"
                elif food_style_preference == "seafood" and destination_lower == "goa":
                    return f"{selected_option} for fresh seafood"
                else:
                    return selected_option

    # Create a list to track all used attractions across all days
    used_attractions = []

    # Create a dictionary to store all attractions by type for easy access
    all_attractions_by_type = {}
    for attraction_type, attractions in dest_data["attractions"].items():
        all_attractions_by_type[attraction_type] = attractions.copy()  # Make a copy to avoid modifying the original

    # Add days to the itinerary
    for day in range(1, days + 1):
        # Select attractions for this day based on preferences
        day_attractions = []

        # Prioritize the first preference for the first day, second for second day, etc.
        priority_index = (day - 1) % len(attraction_types) if attraction_types else 0
        priority_type = attraction_types[priority_index] if attraction_types else "cultural"

        # Add the priority attraction type first
        available_priority_attractions = [a for a in all_attractions_by_type.get(priority_type, []) if a not in used_attractions]

        # If we've used all priority attractions, try to get any unused attraction
        if not available_priority_attractions:
            for attraction_type in attraction_types:
                available_priority_attractions = [a for a in all_attractions_by_type.get(attraction_type, []) if a not in used_attractions]
                if available_priority_attractions:
                    break

        # If we still have no available attractions, reset the used_attractions list
        if not available_priority_attractions and all_attractions_by_type.get(priority_type):
            if day > 3:  # Only reset after a few days to avoid immediate repetition
                used_attractions = []
                available_priority_attractions = all_attractions_by_type.get(priority_type, [])

        # Add a priority attraction if available
        if available_priority_attractions:
            # Choose the first unused attraction
            attraction = available_priority_attractions[0]
            day_attractions.append(attraction)
            used_attractions.append(attraction)

        # Add other attraction types
        for attraction_type in attraction_types:
            if attraction_type == priority_type:
                continue  # Skip the priority type as we've already added it

            if len(day_attractions) >= 3:  # Limit to 3 attractions per day
                break

            # Get attractions of this type that haven't been used yet
            available_attractions = [a for a in all_attractions_by_type.get(attraction_type, []) if a not in used_attractions]

            if available_attractions:
                # Choose the first unused attraction
                attraction = available_attractions[0]
                day_attractions.append(attraction)
                used_attractions.append(attraction)

        # If we still need more attractions, add from any category that hasn't been used
        all_remaining_attractions = []
        for attraction_list in all_attractions_by_type.values():
            for attraction in attraction_list:
                if attraction not in used_attractions and attraction not in day_attractions:
                    all_remaining_attractions.append(attraction)

        # If we've used all attractions, allow reusing some but prioritize least recently used
        if not all_remaining_attractions and len(day_attractions) < 3:
            # Get all attractions and sort by when they were last used (earlier in used_attractions = used longer ago)
            all_attractions = []
            for attraction_list in all_attractions_by_type.values():
                all_attractions.extend(attraction_list)

            # Sort by position in used_attractions (earlier = used longer ago)
            all_attractions.sort(key=lambda x: used_attractions.index(x) if x in used_attractions else -1)

            # Filter out attractions already in this day's plan
            all_attractions = [a for a in all_attractions if a not in day_attractions]

            # Use these as our remaining attractions
            all_remaining_attractions = all_attractions

        # Add remaining attractions until we have 3 or run out
        while len(day_attractions) < 3 and all_remaining_attractions:
            attraction = all_remaining_attractions.pop(0)  # Take the first available
            day_attractions.append(attraction)
            if attraction not in used_attractions:  # Only add to used if it's not already there
                used_attractions.append(attraction)

        # Select restaurants based on food preferences
        food_style = food_styles[day % len(food_styles)] if food_styles else "local"
        breakfast = get_food_recommendation("breakfast", day-1, food_style)
        lunch = get_food_recommendation("lunch", day-1, food_style)
        dinner = get_food_recommendation("dinner", day-1, food_style)

        # Adjust activities based on activity level
        morning_activity = """- Breakfast at {breakfast}\n- Visit {attraction}\n- Explore the surrounding area"""
        afternoon_activity = """- Lunch at {lunch}\n- Visit {attraction}\n- Take some time to relax or shop for souvenirs"""
        evening_activity = """- Dinner at {dinner}\n- Experience {attraction}\n- Return to accommodation"""

        if activity_level == "very active":
            morning_activity = """- Early breakfast at {breakfast}\n- Visit {attraction}\n- Explore the surrounding area with a walking tour"""
            afternoon_activity = """- Quick lunch at {lunch}\n- Visit {attraction}\n- Continue with an active exploration of the area"""
            evening_activity = """- Dinner at {dinner}\n- Experience {attraction}\n- Enjoy some local nightlife before returning to accommodation"""
        elif activity_level == "active":
            morning_activity = """- Breakfast at {breakfast}\n- Visit {attraction}\n- Take a guided tour of the area"""
            afternoon_activity = """- Lunch at {lunch}\n- Visit {attraction}\n- Participate in a local activity or workshop"""
            evening_activity = """- Dinner at {dinner}\n- Experience {attraction}\n- Explore the evening atmosphere before returning"""
        elif activity_level == "relaxed":
            morning_activity = """- Leisurely breakfast at {breakfast}\n- Visit {attraction} at a relaxed pace\n- Take time to soak in the atmosphere"""
            afternoon_activity = """- Relaxed lunch at {lunch}\n- Visit {attraction}\n- Find a nice spot to relax and people-watch"""
            evening_activity = """- Dinner at {dinner}\n- Experience {attraction}\n- Enjoy a calm evening before returning to accommodation"""

        # Helper function to add Google Maps links
        def add_map_link(place_name):
            # Extract the main name before any description
            main_name = place_name.split(' - ')[0].split(' for ')[0]
            # Create a Google Maps search URL
            map_url = f"https://www.google.com/maps/search/?api=1&query={main_name.replace(' ', '+')}+{destination.replace(' ', '+')}"
            # Return formatted link with map icon
            return f"[{place_name}]({map_url}) 🗺️"

        # Format the activities with actual attractions and map links
        breakfast_with_map = add_map_link(breakfast)
        attraction1 = day_attractions[0] if day_attractions else 'a local attraction'
        attraction1_with_map = add_map_link(attraction1) if attraction1 != 'a local attraction' else attraction1

        formatted_morning = morning_activity.format(
            breakfast=breakfast_with_map,
            attraction=attraction1_with_map
        )

        lunch_with_map = add_map_link(lunch)
        attraction2 = day_attractions[1] if len(day_attractions) > 1 else 'another interesting site'
        attraction2_with_map = add_map_link(attraction2) if attraction2 != 'another interesting site' else attraction2

        formatted_afternoon = afternoon_activity.format(
            lunch=lunch_with_map,
            attraction=attraction2_with_map
        )

        dinner_with_map = add_map_link(dinner)
        attraction3 = day_attractions[2] if len(day_attractions) > 2 else 'local entertainment'
        attraction3_with_map = add_map_link(attraction3) if attraction3 != 'local entertainment' else attraction3

        formatted_evening = evening_activity.format(
            dinner=dinner_with_map,
            attraction=attraction3_with_map
        )

        # Add the day's itinerary
        itinerary += f"""## Day {day}

### Morning
{formatted_morning}

### Afternoon
{formatted_afternoon}

### Evening
{formatted_evening}

"""

    # Add destination-specific travel tips
    transport_tips = "\n".join([f"- {tip}" for tip in dest_data["transport"][:3]])
    cultural_tips = "\n".join([f"- {tip}" for tip in dest_data["cultural_tips"][:3]])

    # Determine budget level based on preferences
    budget_level = "mid_range"  # default
    if "budget" in [p.lower() for p in preferences] or "budget-friendly" in [p.lower() for p in preferences]:
        budget_level = "budget"
    elif "luxury" in [p.lower() for p in preferences]:
        budget_level = "luxury"

    # Get budget information
    budget_info = {}
    if "budget_info" in dest_data and budget_level in dest_data["budget_info"]:
        budget_info = dest_data["budget_info"][budget_level]
    else:
        # Fallback to default budget info
        default_budget = {
            "budget": {
                "accommodation": "₹1,000-3,000 per night for budget hotels",
                "meals": "₹150-350 per meal at local eateries",
                "attractions": "₹50-200 for most attractions",
                "transport": "₹100-300 for daily public transport use"
            },
            "mid_range": {
                "accommodation": "₹3,000-7,000 per night for mid-range hotels",
                "meals": "₹350-800 per meal at good restaurants",
                "attractions": "₹200-600 for attractions including guided tours",
                "transport": "₹300-700 for daily taxi/transport use"
            },
            "luxury": {
                "accommodation": "₹7,000-20,000+ per night for luxury hotels",
                "meals": "₹800-3,000+ per meal at fine dining restaurants",
                "attractions": "₹600-2,000 for premium experiences and private tours",
                "transport": "₹1,000-3,000 for daily private transport"
            }
        }
        budget_info = default_budget.get(budget_level, default_budget["mid_range"])

    # Format budget information
    accommodation_cost = budget_info.get("accommodation", "₹3,000-7,000 per night for mid-range hotels")
    meals_cost = budget_info.get("meals", "₹350-800 per meal at good restaurants")
    attractions_cost = budget_info.get("attractions", "₹200-600 for attractions including guided tours")
    transport_cost = budget_info.get("transport", "₹300-700 for daily taxi/transport use")

    itinerary += f"""## Travel Tips for {destination}

### Transportation
{transport_tips}

### Cultural Etiquette
{cultural_tips}

### Weather Considerations
- Check the forecast before your trip
- Pack appropriate clothing for the season
- Be prepared for unexpected weather changes

### Estimated Costs ({budget_level.replace('_', ' ').title()} Budget)
- Accommodation: {accommodation_cost}
- Meals: {meals_cost}
- Attractions: {attractions_cost}
- Transportation: {transport_cost}
"""

    return itinerary

if __name__ == "__main__":
    app.run(debug=True)
