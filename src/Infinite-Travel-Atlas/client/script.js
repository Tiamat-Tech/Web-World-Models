const FALLBACK_TRAVEL_POINTS = [
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Simien",
    "destination": "Historic Quarter",
    "prompt": "Climb through Historic Quarter in Simien at sunrise. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Oceania",
    "country": "Tonga",
    "city": "Nuku alofa",
    "destination": "Lakeside Park",
    "prompt": "Hike through Lakeside Park in Nuku alofa after sunset. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Guadalajara",
    "destination": "Harbor Front",
    "prompt": "Gaze through Harbor Front in Guadalajara on a misty morning. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "Cuba",
    "city": "Havana",
    "destination": "Sky Tower",
    "prompt": "Kayak through Sky Tower in Havana at dusk. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Simien",
    "destination": "Lakeside Park",
    "prompt": "Wander through Lakeside Park in Simien at golden hour. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "Vanuatu",
    "city": "Tanna Island",
    "destination": "Fortress Ruins",
    "prompt": "Pause through Fortress Ruins in Tanna Island on a misty morning. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "Panama",
    "city": "Panama City",
    "destination": "Panoramic Lookout",
    "prompt": "Cruise through Panoramic Lookout in Panama City at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Oceania",
    "country": "Vanuatu",
    "city": "Tanna Island",
    "destination": "Canyon Overlook",
    "prompt": "Cruise through Canyon Overlook in Tanna Island at sunrise. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "France",
    "city": "Nice",
    "destination": "Riverside Promenade",
    "prompt": "Savor through Riverside Promenade in Nice under starry skies. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Reykjavik",
    "destination": "Rock Formations Bay Overlook",
    "prompt": "Hike through Rock Formations Bay Overlook in Reykjavik at midday. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "Guam (USA)",
    "city": "Tumon",
    "destination": "Grand Cathedral",
    "prompt": "Kayak through Grand Cathedral in Tumon after sunset. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Europe",
    "country": "Portugal",
    "city": "Lisbon",
    "destination": "Archaeological Site",
    "prompt": "Pause through Archaeological Site in Lisbon on a breezy afternoon. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Simien",
    "destination": "Waterfront Boardwalk",
    "prompt": "Cruise through Waterfront Boardwalk in Simien on a misty morning. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "El Calafate",
    "destination": "Cliffside Monastery Bay Overlook",
    "prompt": "Wander through Cliffside Monastery Bay Overlook in El Calafate under starry skies. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Punta Arenas",
    "destination": "Night Bazaar",
    "prompt": "Explore through Night Bazaar in Punta Arenas at sunrise. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Punta Cana",
    "destination": "National Park",
    "prompt": "Cruise through National Park in Punta Cana on a breezy afternoon. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Asia",
    "country": "Malaysia",
    "city": "Penang",
    "destination": "Ancient Temple",
    "prompt": "Savor through Ancient Temple in Penang at sunrise. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Beijing",
    "destination": "Grand Cathedral Canal Walk",
    "prompt": "Pause through Grand Cathedral Canal Walk in Beijing in soft winter light. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Queenstown",
    "destination": "National Park",
    "prompt": "Cruise through National Park in Queenstown beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Rotorua",
    "destination": "Botanical Garden",
    "prompt": "Listen through Botanical Garden in Rotorua under starry skies. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Sossusvlei",
    "destination": "Botanical Garden",
    "prompt": "Listen through Botanical Garden in Sossusvlei at sunrise. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "San Pedro de Atacama",
    "destination": "Art District",
    "prompt": "Hike through Art District in San Pedro de Atacama on a breezy afternoon. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Mauritius",
    "city": "Chamarel",
    "destination": "Old Town",
    "prompt": "Cycle through Old Town in Chamarel at dusk. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Asia",
    "country": "India",
    "city": "Delhi",
    "destination": "Sand Dunes",
    "prompt": "Listen through Sand Dunes in Delhi on a breezy afternoon. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Cairns",
    "destination": "Panoramic Lookout",
    "prompt": "Wander through Panoramic Lookout in Cairns at midday. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Oceania",
    "country": "Tonga",
    "city": "Vavaʻu",
    "destination": "City Walls",
    "prompt": "Photograph through City Walls in Vavaʻu at sunrise. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Addis Ababa",
    "destination": "Archaeological Site",
    "prompt": "Stroll through Archaeological Site in Addis Ababa beneath a bright summer sky. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Chefchaouen",
    "destination": "Lakeside Park Sunset Point",
    "prompt": "Stroll through Lakeside Park Sunset Point in Chefchaouen at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Salvador",
    "destination": "Ancient Temple",
    "prompt": "Cycle through Ancient Temple in Salvador beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Asia",
    "country": "Indonesia",
    "city": "Bali",
    "destination": "Art District",
    "prompt": "Listen through Art District in Bali beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Addis Ababa",
    "destination": "Riverside Promenade Heritage Trail",
    "prompt": "Cruise through Riverside Promenade Heritage Trail in Addis Ababa under starry skies. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "Nepal",
    "city": "Kathmandu",
    "destination": "Botanical Garden",
    "prompt": "Gaze through Botanical Garden in Kathmandu at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Athens",
    "destination": "Old Town",
    "prompt": "Photograph through Old Town in Athens on a misty morning. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Etosha",
    "destination": "Coral Beach",
    "prompt": "Admire through Coral Beach in Etosha on a breezy afternoon. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Santo Domingo",
    "destination": "Art District",
    "prompt": "Stroll through Art District in Santo Domingo beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "Vanuatu",
    "city": "Port Vila",
    "destination": "Art District",
    "prompt": "Pause through Art District in Port Vila at dusk. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Zhangjiajie",
    "destination": "Panoramic Lookout Sunset Point",
    "prompt": "Savor through Panoramic Lookout Sunset Point in Zhangjiajie beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "Poland",
    "city": "Kraków",
    "destination": "Sky Tower",
    "prompt": "Wander through Sky Tower in Kraków on a breezy afternoon. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Guatemala",
    "city": "Flores",
    "destination": "Sky Tower",
    "prompt": "Wander through Sky Tower in Flores on a misty morning. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Africa",
    "country": "Madagascar",
    "city": "Antananarivo",
    "destination": "Thermal Springs Viewpoint",
    "prompt": "Stroll through Thermal Springs Viewpoint in Antananarivo in soft winter light. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Asia",
    "country": "Vietnam",
    "city": "Ho Chi Minh City",
    "destination": "Archaeological Site",
    "prompt": "Savor through Archaeological Site in Ho Chi Minh City at sunrise. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Asia",
    "country": "Indonesia",
    "city": "Bali",
    "destination": "Sea Cliffs",
    "prompt": "Climb through Sea Cliffs in Bali at golden hour. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Miami",
    "destination": "Panoramic Lookout",
    "prompt": "Admire through Panoramic Lookout in Miami at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Marrakech",
    "destination": "National Park",
    "prompt": "Pause through National Park in Marrakech on a misty morning. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Cairns",
    "destination": "Canyon Overlook",
    "prompt": "Wander through Canyon Overlook in Cairns under starry skies. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "Indonesia",
    "city": "Jakarta",
    "destination": "Coral Beach",
    "prompt": "Admire through Coral Beach in Jakarta under starry skies. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "Costa Rica",
    "city": "San José",
    "destination": "Rock Formations",
    "prompt": "Explore through Rock Formations in San José under starry skies. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Vik",
    "destination": "Sea Cliffs",
    "prompt": "Pause through Sea Cliffs in Vik at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Asia",
    "country": "Vietnam",
    "city": "Hoi An",
    "destination": "Botanical Garden River Park",
    "prompt": "Cruise through Botanical Garden River Park in Hoi An under starry skies. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Botswana",
    "city": "Maun",
    "destination": "Sand Dunes",
    "prompt": "Wander through Sand Dunes in Maun beneath a bright summer sky. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Chichén Itzá",
    "destination": "Thermal Springs",
    "prompt": "Hike through Thermal Springs in Chichén Itzá at golden hour. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "Bariloche",
    "destination": "Central Market",
    "prompt": "Photograph through Central Market in Bariloche on a misty morning. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Akureyri",
    "destination": "Riverside Promenade Hilltop",
    "prompt": "Gaze through Riverside Promenade Hilltop in Akureyri on a misty morning. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Bogotá",
    "destination": "Central Market Canal Walk",
    "prompt": "Wander through Central Market Canal Walk in Bogotá in soft winter light. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Oceania",
    "country": "Tonga",
    "city": "Nukuʻalofa",
    "destination": "Cliffside Monastery",
    "prompt": "Climb through Cliffside Monastery in Nukuʻalofa on a misty morning. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Kenya",
    "city": "Diani",
    "destination": "Ancient Temple",
    "prompt": "Listen through Ancient Temple in Diani under starry skies. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Santo Domingo",
    "destination": "Sky Tower Bay Overlook",
    "prompt": "Climb through Sky Tower Bay Overlook in Santo Domingo at golden hour. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Rotorua",
    "destination": "City Walls Viewpoint",
    "prompt": "Listen through City Walls Viewpoint in Rotorua under starry skies. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Los Angeles",
    "destination": "Archaeological Site",
    "prompt": "Wander through Archaeological Site in Los Angeles at sunrise. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "Malaysia",
    "city": "Kuala Lumpur",
    "destination": "National Museum",
    "prompt": "Climb through National Museum in Kuala Lumpur beneath a bright summer sky. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Asia",
    "country": "Thailand",
    "city": "Chiang Mai",
    "destination": "Blue Lagoon",
    "prompt": "Hike through Blue Lagoon in Chiang Mai at midday. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Ecuador",
    "city": "Cuenca",
    "destination": "Tea House Street",
    "prompt": "Photograph through Tea House Street in Cuenca at sunrise. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Asia",
    "country": "Nepal",
    "city": "Kathmandu",
    "destination": "National Museum",
    "prompt": "Glide through National Museum in Kathmandu under starry skies. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Punta Cana",
    "destination": "Central Market",
    "prompt": "Hike through Central Market in Punta Cana beneath a bright summer sky. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "São Paulo",
    "destination": "Historic Quarter River Park",
    "prompt": "Pause through Historic Quarter River Park in São Paulo on a misty morning. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Paraguay",
    "city": "Asunción",
    "destination": "Archaeological Site",
    "prompt": "Pause through Archaeological Site in Asunción under starry skies. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Africa",
    "country": "Botswana",
    "city": "Okavango Delta",
    "destination": "City Walls",
    "prompt": "Glide through City Walls in Okavango Delta after sunset. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "El Calafate",
    "destination": "Tea House Street",
    "prompt": "Cruise through Tea House Street in El Calafate beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Boston",
    "destination": "Central Market",
    "prompt": "Explore through Central Market in Boston on a breezy afternoon. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "South America",
    "country": "Peru",
    "city": "Cusco",
    "destination": "Rock Formations",
    "prompt": "Photograph through Rock Formations in Cusco beneath a bright summer sky. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Punta Cana",
    "destination": "Riverside Promenade",
    "prompt": "Explore through Riverside Promenade in Punta Cana under starry skies. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Venice",
    "destination": "Sand Dunes",
    "prompt": "Wander through Sand Dunes in Venice on a misty morning. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Athens",
    "destination": "Thermal Springs",
    "prompt": "Listen through Thermal Springs in Athens at dusk. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Merzouga",
    "destination": "Rock Formations Hilltop",
    "prompt": "Climb through Rock Formations Hilltop in Merzouga on a misty morning. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "Costa Rica",
    "city": "La Fortuna",
    "destination": "National Museum",
    "prompt": "Cruise through National Museum in La Fortuna in soft winter light. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Melbourne",
    "destination": "Lakeside Park",
    "prompt": "Kayak through Lakeside Park in Melbourne at sunrise. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Sydney",
    "destination": "National Park",
    "prompt": "Wander through National Park in Sydney on a misty morning. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "Philippines",
    "city": "El Nido",
    "destination": "Coral Beach",
    "prompt": "Stroll through Coral Beach in El Nido at golden hour. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Auckland",
    "destination": "Central Market",
    "prompt": "Gaze through Central Market in Auckland beneath a bright summer sky. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Melbourne",
    "destination": "Thermal Springs",
    "prompt": "Cruise through Thermal Springs in Melbourne in soft winter light. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "France",
    "city": "Lyon",
    "destination": "Waterfront Boardwalk",
    "prompt": "Cycle through Waterfront Boardwalk in Lyon beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Guadalajara",
    "destination": "Old Town",
    "prompt": "Pause through Old Town in Guadalajara on a misty morning. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Montreal",
    "destination": "Sand Dunes",
    "prompt": "Wander through Sand Dunes in Montreal on a breezy afternoon. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Swakopmund",
    "destination": "Sea Cliffs",
    "prompt": "Savor through Sea Cliffs in Swakopmund in soft winter light. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "Japan",
    "city": "Sapporo",
    "destination": "Cliffside Monastery",
    "prompt": "Glide through Cliffside Monastery in Sapporo after sunset. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Chichén Itzá",
    "destination": "Panoramic Lookout River Park",
    "prompt": "Explore through Panoramic Lookout River Park in Chichén Itzá after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Africa",
    "country": "Mauritius",
    "city": "Chamarel",
    "destination": "Night Bazaar",
    "prompt": "Pause through Night Bazaar in Chamarel after sunset. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Manaus",
    "destination": "Rock Formations",
    "prompt": "Gaze through Rock Formations in Manaus in soft winter light. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Bogotá",
    "destination": "City Walls",
    "prompt": "Savor through City Walls in Bogotá on a misty morning. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "Uyuni",
    "destination": "Mountain Viewpoint",
    "prompt": "Admire through Mountain Viewpoint in Uyuni under starry skies. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Santiago",
    "destination": "Royal Palace",
    "prompt": "Admire through Royal Palace in Santiago after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Asia",
    "country": "Malaysia",
    "city": "Penang",
    "destination": "Tea House Street",
    "prompt": "Hike through Tea House Street in Penang at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "North America",
    "country": "Cuba",
    "city": "Trinidad",
    "destination": "Harbor Front",
    "prompt": "Photograph through Harbor Front in Trinidad after sunset. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Canaima",
    "destination": "National Park",
    "prompt": "Cycle through National Park in Canaima at sunrise. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Mexico City",
    "destination": "National Park",
    "prompt": "Listen through National Park in Mexico City at midday. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "Croatia",
    "city": "Zagreb",
    "destination": "Riverside Promenade Canal Walk",
    "prompt": "Climb through Riverside Promenade Canal Walk in Zagreb on a misty morning. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Austin",
    "destination": "Thermal Springs",
    "prompt": "Admire through Thermal Springs in Austin on a misty morning. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Europe",
    "country": "Poland",
    "city": "Warsaw",
    "destination": "Panoramic Lookout Canal Walk",
    "prompt": "Listen through Panoramic Lookout Canal Walk in Warsaw on a misty morning. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Oceania",
    "country": "Papua New Guinea",
    "city": "Port Moresby",
    "destination": "Tea House Street",
    "prompt": "Climb through Tea House Street in Port Moresby after sunset. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Bogotá",
    "destination": "Rock Formations Bay Overlook",
    "prompt": "Cycle through Rock Formations Bay Overlook in Bogotá beneath a bright summer sky. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Coral Coast",
    "destination": "Lakeside Park",
    "prompt": "Glide through Lakeside Park in Coral Coast under starry skies. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "New York City",
    "destination": "Panoramic Lookout Hilltop",
    "prompt": "Climb through Panoramic Lookout Hilltop in New York City at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Asia",
    "country": "Jordan",
    "city": "Petra",
    "destination": "Tea House Street",
    "prompt": "Gaze through Tea House Street in Petra at dusk. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Asia",
    "country": "Philippines",
    "city": "Siargao",
    "destination": "Historic Quarter",
    "prompt": "Kayak through Historic Quarter in Siargao at dusk. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Tanzania",
    "city": "Serengeti",
    "destination": "Panoramic Lookout",
    "prompt": "Gaze through Panoramic Lookout in Serengeti at golden hour. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Asia",
    "country": "Jordan",
    "city": "Wadi Rum",
    "destination": "Cliffside Monastery",
    "prompt": "Listen through Cliffside Monastery in Wadi Rum on a breezy afternoon. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "South Africa",
    "city": "Cape Town",
    "destination": "Grand Cathedral",
    "prompt": "Stroll through Grand Cathedral in Cape Town after sunset. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "North America",
    "country": "Bahamas",
    "city": "Nassau",
    "destination": "Botanical Garden",
    "prompt": "Pause through Botanical Garden in Nassau beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "Switzerland",
    "city": "Zermatt",
    "destination": "Rock Formations",
    "prompt": "Photograph through Rock Formations in Zermatt under starry skies. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Banff",
    "destination": "Grand Cathedral",
    "prompt": "Listen through Grand Cathedral in Banff under starry skies. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Asia",
    "country": "Nepal",
    "city": "Kathmandu",
    "destination": "Old Town",
    "prompt": "Cycle through Old Town in Kathmandu at midday. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Africa",
    "country": "Kenya",
    "city": "Diani",
    "destination": "Historic Quarter Sunset Point",
    "prompt": "Gaze through Historic Quarter Sunset Point in Diani in soft winter light. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Santiago",
    "destination": "National Museum",
    "prompt": "Stroll through National Museum in Santiago in soft winter light. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Peru",
    "city": "Lima",
    "destination": "Sea Cliffs",
    "prompt": "Hike through Sea Cliffs in Lima beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Montreal",
    "destination": "Thermal Springs",
    "prompt": "Photograph through Thermal Springs in Montreal on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "Sucre",
    "destination": "Archaeological Site",
    "prompt": "Pause through Archaeological Site in Sucre under starry skies. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "United Kingdom",
    "city": "Bath",
    "destination": "Mountain Viewpoint",
    "prompt": "Gaze through Mountain Viewpoint in Bath at dusk. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "South Africa",
    "city": "Johannesburg",
    "destination": "Royal Palace",
    "prompt": "Wander through Royal Palace in Johannesburg at midday. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Queenstown",
    "destination": "Panoramic Lookout",
    "prompt": "Savor through Panoramic Lookout in Queenstown at golden hour. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Sossusvlei",
    "destination": "Cliffside Monastery Bay Overlook",
    "prompt": "Glide through Cliffside Monastery Bay Overlook in Sossusvlei in soft winter light. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Izmir",
    "destination": "Canyon Overlook",
    "prompt": "Glide through Canyon Overlook in Izmir beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Uluru",
    "destination": "Archaeological Site",
    "prompt": "Explore through Archaeological Site in Uluru beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Montreal",
    "destination": "Waterfront Boardwalk",
    "prompt": "Savor through Waterfront Boardwalk in Montreal beneath a bright summer sky. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Asia",
    "country": "Malaysia",
    "city": "Kuala Lumpur",
    "destination": "City Walls Bay Overlook",
    "prompt": "Photograph through City Walls Bay Overlook in Kuala Lumpur at sunrise. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Moorea",
    "destination": "Rock Formations",
    "prompt": "Savor through Rock Formations in Moorea beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "La Digue",
    "destination": "Ancient Temple",
    "prompt": "Gaze through Ancient Temple in La Digue in soft winter light. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Cartagena",
    "destination": "Waterfront Boardwalk",
    "prompt": "Hike through Waterfront Boardwalk in Cartagena in soft winter light. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Santiago",
    "destination": "Sand Dunes",
    "prompt": "Glide through Sand Dunes in Santiago at dusk. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Paraguay",
    "city": "Encarnación",
    "destination": "Cliffside Monastery",
    "prompt": "Admire through Cliffside Monastery in Encarnación in soft winter light. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Night Bazaar",
    "prompt": "Wander through Night Bazaar in Nadi after sunset. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "Singapore",
    "city": "Singapore",
    "destination": "Central Market",
    "prompt": "Savor through Central Market in Singapore beneath a bright summer sky. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "Mahé",
    "destination": "Tea House Street Hilltop",
    "prompt": "Photograph through Tea House Street Hilltop in Mahé at midday. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Mauritius",
    "city": "Port Louis",
    "destination": "Archaeological Site",
    "prompt": "Savor through Archaeological Site in Port Louis in soft winter light. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "New York City",
    "destination": "Thermal Springs",
    "prompt": "Gaze through Thermal Springs in New York City on a breezy afternoon. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Xi'an",
    "destination": "Thermal Springs",
    "prompt": "Wander through Thermal Springs in Xi'an on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Athens",
    "destination": "Cliffside Monastery River Park",
    "prompt": "Pause through Cliffside Monastery River Park in Athens after sunset. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Peru",
    "city": "Lima",
    "destination": "Fortress Ruins",
    "prompt": "Stroll through Fortress Ruins in Lima at sunrise. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "Buenos Aires",
    "destination": "City Walls",
    "prompt": "Cycle through City Walls in Buenos Aires beneath a bright summer sky. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Samoa",
    "city": "Apia",
    "destination": "Sea Cliffs",
    "prompt": "Gaze through Sea Cliffs in Apia at sunrise. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Royal Palace",
    "prompt": "Wander through Royal Palace in Nadi at dusk. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Asia",
    "country": "United Arab Emirates",
    "city": "Dubai",
    "destination": "Fortress Ruins",
    "prompt": "Explore through Fortress Ruins in Dubai in soft winter light. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Chengdu",
    "destination": "Mountain Viewpoint",
    "prompt": "Photograph through Mountain Viewpoint in Chengdu at sunrise. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Banff",
    "destination": "Central Market",
    "prompt": "Stroll through Central Market in Banff under starry skies. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Moorea",
    "destination": "Archaeological Site",
    "prompt": "Admire through Archaeological Site in Moorea on a misty morning. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Central Market Bay Overlook",
    "prompt": "Hike through Central Market Bay Overlook in Nadi at midday. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Izmir",
    "destination": "Botanical Garden",
    "prompt": "Stroll through Botanical Garden in Izmir at sunrise. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Jamaica",
    "city": "Ocho Rios",
    "destination": "Art District Lookout",
    "prompt": "Cruise through Art District Lookout in Ocho Rios on a breezy afternoon. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Jamaica",
    "city": "Kingston",
    "destination": "Fortress Ruins",
    "prompt": "Cruise through Fortress Ruins in Kingston on a breezy afternoon. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Giza",
    "destination": "Central Market",
    "prompt": "Kayak through Central Market in Giza on a misty morning. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Asia",
    "country": "Japan",
    "city": "Tokyo",
    "destination": "Riverside Promenade",
    "prompt": "Pause through Riverside Promenade in Tokyo at golden hour. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Honolulu",
    "destination": "Blue Lagoon",
    "prompt": "Pause through Blue Lagoon in Honolulu in soft winter light. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "La Paz",
    "destination": "Coral Beach",
    "prompt": "Wander through Coral Beach in La Paz at dusk. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Cairo",
    "destination": "Sand Dunes",
    "prompt": "Pause through Sand Dunes in Cairo at sunrise. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Merzouga",
    "destination": "Rock Formations",
    "prompt": "Kayak through Rock Formations in Merzouga after sunset. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "Praslin",
    "destination": "Old Town Hilltop",
    "prompt": "Pause through Old Town Hilltop in Praslin at sunrise. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Venice",
    "destination": "Mountain Viewpoint",
    "prompt": "Listen through Mountain Viewpoint in Venice at golden hour. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "Germany",
    "city": "Munich",
    "destination": "Riverside Promenade",
    "prompt": "Climb through Riverside Promenade in Munich on a breezy afternoon. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Antalya",
    "destination": "Cliffside Monastery",
    "prompt": "Cruise through Cliffside Monastery in Antalya after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Los Angeles",
    "destination": "Riverside Promenade",
    "prompt": "Climb through Riverside Promenade in Los Angeles on a breezy afternoon. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Paraguay",
    "city": "Encarnación",
    "destination": "Blue Lagoon",
    "prompt": "Pause through Blue Lagoon in Encarnación at sunrise. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "Croatia",
    "city": "Dubrovnik",
    "destination": "Central Market",
    "prompt": "Wander through Central Market in Dubrovnik on a misty morning. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Siwa",
    "destination": "Sand Dunes",
    "prompt": "Gaze through Sand Dunes in Siwa on a breezy afternoon. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Europe",
    "country": "Austria",
    "city": "Salzburg",
    "destination": "Tea House Street",
    "prompt": "Admire through Tea House Street in Salzburg beneath a bright summer sky. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Addis Ababa",
    "destination": "Ancient Temple",
    "prompt": "Admire through Ancient Temple in Addis Ababa under starry skies. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Santorini",
    "destination": "Coral Beach River Park",
    "prompt": "Gaze through Coral Beach River Park in Santorini on a breezy afternoon. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Rotorua",
    "destination": "Sea Cliffs Canal Walk",
    "prompt": "Glide through Sea Cliffs Canal Walk in Rotorua at dusk. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Tonga",
    "city": "Nukuʻalofa",
    "destination": "Sea Cliffs",
    "prompt": "Savor through Sea Cliffs in Nukuʻalofa after sunset. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "Mendoza",
    "destination": "Fortress Ruins",
    "prompt": "Kayak through Fortress Ruins in Mendoza at golden hour. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Miami",
    "destination": "Historic Quarter",
    "prompt": "Kayak through Historic Quarter in Miami in soft winter light. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "United Arab Emirates",
    "city": "Abu Dhabi",
    "destination": "Central Market",
    "prompt": "Admire through Central Market in Abu Dhabi in soft winter light. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Asia",
    "country": "India",
    "city": "Jaipur",
    "destination": "Thermal Springs",
    "prompt": "Cruise through Thermal Springs in Jaipur at golden hour. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Oceania",
    "country": "Palau",
    "city": "Koror",
    "destination": "Art District",
    "prompt": "Glide through Art District in Koror after sunset. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "Philippines",
    "city": "Cebu",
    "destination": "Royal Palace",
    "prompt": "Cruise through Royal Palace in Cebu at dusk. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Sossusvlei",
    "destination": "Sea Cliffs",
    "prompt": "Listen through Sea Cliffs in Sossusvlei in soft winter light. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Moorea",
    "destination": "National Park",
    "prompt": "Savor through National Park in Moorea in soft winter light. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "Tonga",
    "city": "Nukuʻalofa",
    "destination": "Mountain Viewpoint Viewpoint",
    "prompt": "Glide through Mountain Viewpoint Viewpoint in Nukuʻalofa at dusk. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Caracas",
    "destination": "Night Bazaar Canal Walk",
    "prompt": "Pause through Night Bazaar Canal Walk in Caracas at dusk. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Santorini",
    "destination": "National Park",
    "prompt": "Glide through National Park in Santorini at dusk. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Cairns",
    "destination": "Old Town",
    "prompt": "Glide through Old Town in Cairns beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "South America",
    "country": "Uruguay",
    "city": "Montevideo",
    "destination": "Lakeside Park Hilltop",
    "prompt": "Glide through Lakeside Park Hilltop in Montevideo under starry skies. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Asia",
    "country": "India",
    "city": "Varanasi",
    "destination": "Blue Lagoon",
    "prompt": "Kayak through Blue Lagoon in Varanasi at dusk. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Bahamas",
    "city": "Nassau",
    "destination": "Ancient Temple Heritage Trail",
    "prompt": "Wander through Ancient Temple Heritage Trail in Nassau under starry skies. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Punta Arenas",
    "destination": "Historic Quarter",
    "prompt": "Admire through Historic Quarter in Punta Arenas beneath a bright summer sky. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Vanuatu",
    "city": "Tanna Island",
    "destination": "Canyon Overlook Viewpoint",
    "prompt": "Glide through Canyon Overlook Viewpoint in Tanna Island at golden hour. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Europe",
    "country": "Sweden",
    "city": "Kiruna",
    "destination": "Cliffside Monastery",
    "prompt": "Gaze through Cliffside Monastery in Kiruna at dusk. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "Philippines",
    "city": "Siargao",
    "destination": "Coral Beach",
    "prompt": "Cycle through Coral Beach in Siargao in soft winter light. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Asia",
    "country": "Indonesia",
    "city": "Komodo",
    "destination": "Waterfront Boardwalk Heritage Trail",
    "prompt": "Admire through Waterfront Boardwalk Heritage Trail in Komodo at dusk. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Salvador",
    "destination": "Archaeological Site",
    "prompt": "Admire through Archaeological Site in Salvador after sunset. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Moorea",
    "destination": "Waterfront Boardwalk Bay Overlook",
    "prompt": "Kayak through Waterfront Boardwalk Bay Overlook in Moorea on a misty morning. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "Indonesia",
    "city": "Bali",
    "destination": "Rock Formations",
    "prompt": "Photograph through Rock Formations in Bali in soft winter light. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Caracas",
    "destination": "Rock Formations",
    "prompt": "Hike through Rock Formations in Caracas at golden hour. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Ecuador",
    "city": "Quito",
    "destination": "Archaeological Site Sunset Point",
    "prompt": "Cruise through Archaeological Site Sunset Point in Quito on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Akureyri",
    "destination": "Tea House Street",
    "prompt": "Pause through Tea House Street in Akureyri at dusk. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Asia",
    "country": "India",
    "city": "Varanasi",
    "destination": "Ancient Temple",
    "prompt": "Pause through Ancient Temple in Varanasi at dusk. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "Costa Rica",
    "city": "San José",
    "destination": "Sand Dunes",
    "prompt": "Stroll through Sand Dunes in San José on a misty morning. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "North America",
    "country": "Panama",
    "city": "Panama City",
    "destination": "Waterfront Boardwalk River Park",
    "prompt": "Cycle through Waterfront Boardwalk River Park in Panama City on a misty morning. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Istanbul",
    "destination": "Ancient Temple",
    "prompt": "Glide through Ancient Temple in Istanbul at midday. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "Switzerland",
    "city": "Geneva",
    "destination": "Sand Dunes Viewpoint",
    "prompt": "Cruise through Sand Dunes Viewpoint in Geneva at dusk. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Lalibela",
    "destination": "Coral Beach Hilltop",
    "prompt": "Explore through Coral Beach Hilltop in Lalibela in soft winter light. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Istanbul",
    "destination": "Central Market",
    "prompt": "Climb through Central Market in Istanbul at golden hour. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Aswan",
    "destination": "Botanical Garden",
    "prompt": "Photograph through Botanical Garden in Aswan under starry skies. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Medellín",
    "destination": "National Museum Lookout",
    "prompt": "Hike through National Museum Lookout in Medellín after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Asia",
    "country": "India",
    "city": "Varanasi",
    "destination": "Fortress Ruins",
    "prompt": "Cycle through Fortress Ruins in Varanasi at midday. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "Guam (USA)",
    "city": "Tumon",
    "destination": "Sea Cliffs Canal Walk",
    "prompt": "Admire through Sea Cliffs Canal Walk in Tumon after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Oceania",
    "country": "Guam (USA)",
    "city": "Tumon",
    "destination": "Archaeological Site",
    "prompt": "Explore through Archaeological Site in Tumon at dusk. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Asia",
    "country": "Malaysia",
    "city": "Kota Kinabalu",
    "destination": "Rock Formations Heritage Trail",
    "prompt": "Hike through Rock Formations Heritage Trail in Kota Kinabalu under starry skies. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Europe",
    "country": "Sweden",
    "city": "Kiruna",
    "destination": "Historic Quarter",
    "prompt": "Wander through Historic Quarter in Kiruna at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Germany",
    "city": "Berlin",
    "destination": "Rock Formations Canal Walk",
    "prompt": "Explore through Rock Formations Canal Walk in Berlin after sunset. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Coral Coast",
    "destination": "Art District Lookout",
    "prompt": "Cycle through Art District Lookout in Coral Coast on a breezy afternoon. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "United Kingdom",
    "city": "Bath",
    "destination": "Central Market Lookout",
    "prompt": "Savor through Central Market Lookout in Bath after sunset. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Chichén Itzá",
    "destination": "Royal Palace River Park",
    "prompt": "Gaze through Royal Palace River Park in Chichén Itzá under starry skies. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Botanical Garden",
    "prompt": "Admire through Botanical Garden in Nadi beneath a bright summer sky. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Asia",
    "country": "Philippines",
    "city": "Siargao",
    "destination": "Archaeological Site",
    "prompt": "Savor through Archaeological Site in Siargao on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Africa",
    "country": "Kenya",
    "city": "Diani",
    "destination": "Sky Tower",
    "prompt": "Admire through Sky Tower in Diani after sunset. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "Czech Republic",
    "city": "Český Krumlov",
    "destination": "Canyon Overlook",
    "prompt": "Listen through Canyon Overlook in Český Krumlov at dusk. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "India",
    "city": "Agra",
    "destination": "National Museum",
    "prompt": "Pause through National Museum in Agra on a misty morning. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Oceania",
    "country": "Samoa",
    "city": "Apia",
    "destination": "City Walls",
    "prompt": "Cycle through City Walls in Apia under starry skies. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Bora Bora",
    "destination": "Lakeside Park",
    "prompt": "Admire through Lakeside Park in Bora Bora under starry skies. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "San Pedro de Atacama",
    "destination": "Lakeside Park",
    "prompt": "Gaze through Lakeside Park in San Pedro de Atacama at midday. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Banff",
    "destination": "Riverside Promenade",
    "prompt": "Wander through Riverside Promenade in Banff under starry skies. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Canaima",
    "destination": "Central Market",
    "prompt": "Stroll through Central Market in Canaima at midday. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "Iran",
    "city": "Yazd",
    "destination": "Riverside Promenade",
    "prompt": "Explore through Riverside Promenade in Yazd beneath a bright summer sky. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Punta Cana",
    "destination": "Rock Formations",
    "prompt": "Glide through Rock Formations in Punta Cana at golden hour. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Switzerland",
    "city": "Lucerne",
    "destination": "City Walls",
    "prompt": "Kayak through City Walls in Lucerne at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Vik",
    "destination": "Lakeside Park",
    "prompt": "Savor through Lakeside Park in Vik under starry skies. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Cairns",
    "destination": "Thermal Springs",
    "prompt": "Cycle through Thermal Springs in Cairns at midday. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Blue Lagoon",
    "prompt": "Listen through Blue Lagoon in Nadi at sunrise. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Europe",
    "country": "Switzerland",
    "city": "Zurich",
    "destination": "Harbor Front",
    "prompt": "Admire through Harbor Front in Zurich on a misty morning. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Asia",
    "country": "Philippines",
    "city": "Cebu",
    "destination": "Night Bazaar",
    "prompt": "Pause through Night Bazaar in Cebu at dusk. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Peru",
    "city": "Puno",
    "destination": "Lakeside Park",
    "prompt": "Cycle through Lakeside Park in Puno on a breezy afternoon. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "Philippines",
    "city": "Cebu",
    "destination": "Old Town",
    "prompt": "Explore through Old Town in Cebu on a misty morning. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "Japan",
    "city": "Tokyo",
    "destination": "Sea Cliffs",
    "prompt": "Explore through Sea Cliffs in Tokyo beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Poland",
    "city": "Gdańsk",
    "destination": "Lakeside Park",
    "prompt": "Hike through Lakeside Park in Gdańsk under starry skies. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Miami",
    "destination": "Canyon Overlook Canal Walk",
    "prompt": "Listen through Canyon Overlook Canal Walk in Miami beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "Praslin",
    "destination": "Canyon Overlook",
    "prompt": "Glide through Canyon Overlook in Praslin after sunset. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Africa",
    "country": "Mauritius",
    "city": "Port Louis",
    "destination": "Royal Palace",
    "prompt": "Stroll through Royal Palace in Port Louis on a breezy afternoon. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "South America",
    "country": "Ecuador",
    "city": "Quito",
    "destination": "Archaeological Site Hilltop",
    "prompt": "Cruise through Archaeological Site Hilltop in Quito beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Coral Coast",
    "destination": "Panoramic Lookout",
    "prompt": "Gaze through Panoramic Lookout in Coral Coast at sunrise. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Europe",
    "country": "United Kingdom",
    "city": "York",
    "destination": "National Museum",
    "prompt": "Hike through National Museum in York on a breezy afternoon. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Portugal",
    "city": "Porto",
    "destination": "Night Bazaar",
    "prompt": "Wander through Night Bazaar in Porto on a breezy afternoon. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "Poland",
    "city": "Kraków",
    "destination": "City Walls Viewpoint",
    "prompt": "Climb through City Walls Viewpoint in Kraków on a misty morning. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "Costa Rica",
    "city": "La Fortuna",
    "destination": "Waterfront Boardwalk",
    "prompt": "Admire through Waterfront Boardwalk in La Fortuna at dusk. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "Vietnam",
    "city": "Hoi An",
    "destination": "Cliffside Monastery",
    "prompt": "Climb through Cliffside Monastery in Hoi An on a breezy afternoon. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Rome",
    "destination": "Archaeological Site",
    "prompt": "Pause through Archaeological Site in Rome under starry skies. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Florence",
    "destination": "Rock Formations",
    "prompt": "Photograph through Rock Formations in Florence in soft winter light. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Oceania",
    "country": "Samoa",
    "city": "Apia",
    "destination": "Tea House Street Heritage Trail",
    "prompt": "Hike through Tea House Street Heritage Trail in Apia on a breezy afternoon. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Sossusvlei",
    "destination": "Lakeside Park",
    "prompt": "Cycle through Lakeside Park in Sossusvlei in soft winter light. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Oceania",
    "country": "Tonga",
    "city": "Vavaʻu",
    "destination": "Panoramic Lookout",
    "prompt": "Gaze through Panoramic Lookout in Vavaʻu after sunset. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Giza",
    "destination": "Canyon Overlook",
    "prompt": "Listen through Canyon Overlook in Giza at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "South Africa",
    "city": "Johannesburg",
    "destination": "Canyon Overlook Canal Walk",
    "prompt": "Wander through Canyon Overlook Canal Walk in Johannesburg under starry skies. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Cairns",
    "destination": "Blue Lagoon",
    "prompt": "Cycle through Blue Lagoon in Cairns at midday. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Quebec City",
    "destination": "Tea House Street",
    "prompt": "Glide through Tea House Street in Quebec City on a breezy afternoon. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Cappadocia",
    "destination": "Art District Hilltop",
    "prompt": "Wander through Art District Hilltop in Cappadocia after sunset. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Cairo",
    "destination": "Coral Beach",
    "prompt": "Gaze through Coral Beach in Cairo after sunset. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Guatemala",
    "city": "Flores",
    "destination": "Royal Palace",
    "prompt": "Admire through Royal Palace in Flores in soft winter light. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Boston",
    "destination": "National Park Lookout",
    "prompt": "Explore through National Park Lookout in Boston under starry skies. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Auckland",
    "destination": "Archaeological Site",
    "prompt": "Cruise through Archaeological Site in Auckland at dusk. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Uluru",
    "destination": "Canyon Overlook Hilltop",
    "prompt": "Explore through Canyon Overlook Hilltop in Uluru under starry skies. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Fes",
    "destination": "Canyon Overlook",
    "prompt": "Photograph through Canyon Overlook in Fes beneath a bright summer sky. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Asia",
    "country": "Saudi Arabia",
    "city": "Riyadh",
    "destination": "National Park",
    "prompt": "Photograph through National Park in Riyadh at sunrise. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "Oman",
    "city": "Muscat",
    "destination": "Tea House Street",
    "prompt": "Pause through Tea House Street in Muscat under starry skies. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Austria",
    "city": "Graz",
    "destination": "Tea House Street",
    "prompt": "Explore through Tea House Street in Graz on a breezy afternoon. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Africa",
    "country": "South Africa",
    "city": "Cape Town",
    "destination": "Sea Cliffs Canal Walk",
    "prompt": "Glide through Sea Cliffs Canal Walk in Cape Town at sunrise. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Europe",
    "country": "Spain",
    "city": "Barcelona",
    "destination": "Archaeological Site",
    "prompt": "Listen through Archaeological Site in Barcelona on a misty morning. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Mexico City",
    "destination": "Lakeside Park",
    "prompt": "Savor through Lakeside Park in Mexico City beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Valparaíso",
    "destination": "Cliffside Monastery Lookout",
    "prompt": "Pause through Cliffside Monastery Lookout in Valparaíso on a breezy afternoon. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "Mahé",
    "destination": "Blue Lagoon",
    "prompt": "Photograph through Blue Lagoon in Mahé on a breezy afternoon. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Chefchaouen",
    "destination": "Sand Dunes",
    "prompt": "Listen through Sand Dunes in Chefchaouen in soft winter light. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "Vanuatu",
    "city": "Tanna Island",
    "destination": "Sea Cliffs",
    "prompt": "Glide through Sea Cliffs in Tanna Island after sunset. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Oaxaca",
    "destination": "Botanical Garden",
    "prompt": "Cruise through Botanical Garden in Oaxaca at golden hour. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Guam (USA)",
    "city": "Tumon",
    "destination": "Lakeside Park Bay Overlook",
    "prompt": "Hike through Lakeside Park Bay Overlook in Tumon at golden hour. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Lalibela",
    "destination": "Coral Beach Viewpoint",
    "prompt": "Pause through Coral Beach Viewpoint in Lalibela at golden hour. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Germany",
    "city": "Cologne",
    "destination": "Old Town Sunset Point",
    "prompt": "Listen through Old Town Sunset Point in Cologne on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Africa",
    "country": "Kenya",
    "city": "Maasai Mara",
    "destination": "Night Bazaar",
    "prompt": "Glide through Night Bazaar in Maasai Mara at midday. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Marrakech",
    "destination": "Cliffside Monastery Canal Walk",
    "prompt": "Gaze through Cliffside Monastery Canal Walk in Marrakech beneath a bright summer sky. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Mexico City",
    "destination": "Waterfront Boardwalk",
    "prompt": "Photograph through Waterfront Boardwalk in Mexico City in soft winter light. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Mexico City",
    "destination": "Sea Cliffs",
    "prompt": "Pause through Sea Cliffs in Mexico City on a misty morning. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "Papua New Guinea",
    "city": "Port Moresby",
    "destination": "National Museum Sunset Point",
    "prompt": "Glide through National Museum Sunset Point in Port Moresby after sunset. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Uluru",
    "destination": "Tea House Street",
    "prompt": "Wander through Tea House Street in Uluru in soft winter light. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Honolulu",
    "destination": "Old Town",
    "prompt": "Cruise through Old Town in Honolulu on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Caracas",
    "destination": "Fortress Ruins",
    "prompt": "Climb through Fortress Ruins in Caracas at golden hour. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Asia",
    "country": "Thailand",
    "city": "Krabi",
    "destination": "Night Bazaar Canal Walk",
    "prompt": "Gaze through Night Bazaar Canal Walk in Krabi on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "Panama",
    "city": "Panama City",
    "destination": "Cliffside Monastery",
    "prompt": "Cruise through Cliffside Monastery in Panama City at golden hour. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "El Calafate",
    "destination": "Central Market",
    "prompt": "Stroll through Central Market in El Calafate at dusk. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "Bhutan",
    "city": "Thimphu",
    "destination": "Waterfront Boardwalk Lookout",
    "prompt": "Listen through Waterfront Boardwalk Lookout in Thimphu at dusk. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "Austria",
    "city": "Vienna",
    "destination": "Sky Tower Canal Walk",
    "prompt": "Explore through Sky Tower Canal Walk in Vienna at golden hour. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Asia",
    "country": "Indonesia",
    "city": "Bali",
    "destination": "Archaeological Site Viewpoint",
    "prompt": "Stroll through Archaeological Site Viewpoint in Bali at midday. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Paraguay",
    "city": "Encarnación",
    "destination": "Night Bazaar",
    "prompt": "Cruise through Night Bazaar in Encarnación at midday. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Oceania",
    "country": "Guam (USA)",
    "city": "Tumon",
    "destination": "Sky Tower Bay Overlook",
    "prompt": "Hike through Sky Tower Bay Overlook in Tumon at midday. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Los Angeles",
    "destination": "Mountain Viewpoint",
    "prompt": "Climb through Mountain Viewpoint in Los Angeles in soft winter light. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "South America",
    "country": "Ecuador",
    "city": "Cuenca",
    "destination": "Riverside Promenade",
    "prompt": "Cruise through Riverside Promenade in Cuenca at dusk. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Marrakech",
    "destination": "Ancient Temple Heritage Trail",
    "prompt": "Stroll through Ancient Temple Heritage Trail in Marrakech beneath a bright summer sky. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Madagascar",
    "city": "Nosy Be",
    "destination": "Panoramic Lookout",
    "prompt": "Cruise through Panoramic Lookout in Nosy Be after sunset. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Punta Cana",
    "destination": "Sky Tower",
    "prompt": "Kayak through Sky Tower in Punta Cana at midday. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "Mendoza",
    "destination": "Royal Palace",
    "prompt": "Listen through Royal Palace in Mendoza under starry skies. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "La Digue",
    "destination": "Sea Cliffs",
    "prompt": "Pause through Sea Cliffs in La Digue at dusk. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Luxor",
    "destination": "Blue Lagoon Bay Overlook",
    "prompt": "Explore through Blue Lagoon Bay Overlook in Luxor at golden hour. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Sweden",
    "city": "Gothenburg",
    "destination": "Mountain Viewpoint",
    "prompt": "Wander through Mountain Viewpoint in Gothenburg on a misty morning. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "Sucre",
    "destination": "Lakeside Park",
    "prompt": "Climb through Lakeside Park in Sucre at golden hour. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Boston",
    "destination": "Tea House Street",
    "prompt": "Savor through Tea House Street in Boston under starry skies. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Tanzania",
    "city": "Arusha",
    "destination": "Grand Cathedral Heritage Trail",
    "prompt": "Gaze through Grand Cathedral Heritage Trail in Arusha beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Moorea",
    "destination": "Harbor Front",
    "prompt": "Explore through Harbor Front in Moorea on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Asia",
    "country": "South Korea",
    "city": "Seoul",
    "destination": "Riverside Promenade",
    "prompt": "Wander through Riverside Promenade in Seoul under starry skies. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "North America",
    "country": "Cuba",
    "city": "Havana",
    "destination": "Thermal Springs",
    "prompt": "Photograph through Thermal Springs in Havana beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Marrakech",
    "destination": "Night Bazaar",
    "prompt": "Savor through Night Bazaar in Marrakech beneath a bright summer sky. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Guadalajara",
    "destination": "Art District",
    "prompt": "Explore through Art District in Guadalajara at sunrise. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Xi'an",
    "destination": "Blue Lagoon",
    "prompt": "Savor through Blue Lagoon in Xi'an beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "São Paulo",
    "destination": "National Museum",
    "prompt": "Admire through National Museum in São Paulo at sunrise. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "United Arab Emirates",
    "city": "Dubai",
    "destination": "Blue Lagoon River Park",
    "prompt": "Wander through Blue Lagoon River Park in Dubai under starry skies. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Africa",
    "country": "Madagascar",
    "city": "Morondava",
    "destination": "Cliffside Monastery",
    "prompt": "Gaze through Cliffside Monastery in Morondava after sunset. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Europe",
    "country": "Norway",
    "city": "Oslo",
    "destination": "Night Bazaar",
    "prompt": "Wander through Night Bazaar in Oslo at dusk. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "Jordan",
    "city": "Wadi Rum",
    "destination": "Canyon Overlook Heritage Trail",
    "prompt": "Wander through Canyon Overlook Heritage Trail in Wadi Rum at sunrise. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Kenya",
    "city": "Nairobi",
    "destination": "Panoramic Lookout",
    "prompt": "Cruise through Panoramic Lookout in Nairobi on a misty morning. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Venice",
    "destination": "Botanical Garden",
    "prompt": "Climb through Botanical Garden in Venice in soft winter light. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Giza",
    "destination": "Art District",
    "prompt": "Glide through Art District in Giza at golden hour. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Valparaíso",
    "destination": "Ancient Temple Viewpoint",
    "prompt": "Cruise through Ancient Temple Viewpoint in Valparaíso under starry skies. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Moorea",
    "destination": "Sea Cliffs",
    "prompt": "Admire through Sea Cliffs in Moorea on a misty morning. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Asia",
    "country": "Iran",
    "city": "Shiraz",
    "destination": "Waterfront Boardwalk Hilltop",
    "prompt": "Explore through Waterfront Boardwalk Hilltop in Shiraz in soft winter light. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Asia",
    "country": "Japan",
    "city": "Sapporo",
    "destination": "Blue Lagoon River Park",
    "prompt": "Pause through Blue Lagoon River Park in Sapporo at midday. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Asia",
    "country": "Vietnam",
    "city": "Da Nang",
    "destination": "Mountain Viewpoint",
    "prompt": "Cruise through Mountain Viewpoint in Da Nang at sunrise. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "Mendoza",
    "destination": "Coral Beach",
    "prompt": "Admire through Coral Beach in Mendoza at midday. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Coral Coast",
    "destination": "Central Market",
    "prompt": "Admire through Central Market in Coral Coast at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Coral Coast",
    "destination": "Historic Quarter",
    "prompt": "Cruise through Historic Quarter in Coral Coast on a misty morning. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "Portugal",
    "city": "Lisbon",
    "destination": "Riverside Promenade",
    "prompt": "Cruise through Riverside Promenade in Lisbon in soft winter light. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Giza",
    "destination": "National Park",
    "prompt": "Cycle through National Park in Giza on a breezy afternoon. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Chicago",
    "destination": "Central Market",
    "prompt": "Cruise through Central Market in Chicago after sunset. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "Vietnam",
    "city": "Hoi An",
    "destination": "City Walls Heritage Trail",
    "prompt": "Listen through City Walls Heritage Trail in Hoi An on a breezy afternoon. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Rio de Janeiro",
    "destination": "Royal Palace",
    "prompt": "Glide through Royal Palace in Rio de Janeiro at dusk. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Auckland",
    "destination": "City Walls",
    "prompt": "Listen through City Walls in Auckland on a misty morning. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Punta Arenas",
    "destination": "Canyon Overlook Viewpoint",
    "prompt": "Listen through Canyon Overlook Viewpoint in Punta Arenas at golden hour. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Lalibela",
    "destination": "Royal Palace Lookout",
    "prompt": "Cycle through Royal Palace Lookout in Lalibela beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Asia",
    "country": "Malaysia",
    "city": "Kota Kinabalu",
    "destination": "Botanical Garden",
    "prompt": "Admire through Botanical Garden in Kota Kinabalu under starry skies. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Fes",
    "destination": "Historic Quarter",
    "prompt": "Pause through Historic Quarter in Fes in soft winter light. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Melbourne",
    "destination": "National Park Canal Walk",
    "prompt": "Cruise through National Park Canal Walk in Melbourne beneath a bright summer sky. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Miami",
    "destination": "Grand Cathedral Heritage Trail",
    "prompt": "Photograph through Grand Cathedral Heritage Trail in Miami beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "La Paz",
    "destination": "Tea House Street Lookout",
    "prompt": "Glide through Tea House Street Lookout in La Paz beneath a bright summer sky. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Uruguay",
    "city": "Colonia del Sacramento",
    "destination": "Archaeological Site",
    "prompt": "Climb through Archaeological Site in Colonia del Sacramento at dusk. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "South Africa",
    "city": "Knysna",
    "destination": "Canyon Overlook",
    "prompt": "Cruise through Canyon Overlook in Knysna beneath a bright summer sky. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "Sucre",
    "destination": "Historic Quarter Sunset Point",
    "prompt": "Cycle through Historic Quarter Sunset Point in Sucre in soft winter light. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Bogotá",
    "destination": "Blue Lagoon",
    "prompt": "Cruise through Blue Lagoon in Bogotá at midday. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Chicago",
    "destination": "City Walls",
    "prompt": "Stroll through City Walls in Chicago at golden hour. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Manaus",
    "destination": "Ancient Temple",
    "prompt": "Wander through Ancient Temple in Manaus at sunrise. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Africa",
    "country": "Kenya",
    "city": "Maasai Mara",
    "destination": "Harbor Front Viewpoint",
    "prompt": "Cruise through Harbor Front Viewpoint in Maasai Mara at golden hour. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Asia",
    "country": "United Arab Emirates",
    "city": "Dubai",
    "destination": "City Walls Viewpoint",
    "prompt": "Savor through City Walls Viewpoint in Dubai at sunrise. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Paraguay",
    "city": "Encarnación",
    "destination": "Sky Tower",
    "prompt": "Explore through Sky Tower in Encarnación at dusk. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Cairns",
    "destination": "Historic Quarter",
    "prompt": "Cycle through Historic Quarter in Cairns at golden hour. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "Guam (USA)",
    "city": "Tumon",
    "destination": "Historic Quarter",
    "prompt": "Climb through Historic Quarter in Tumon at golden hour. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Austria",
    "city": "Salzburg",
    "destination": "Botanical Garden",
    "prompt": "Glide through Botanical Garden in Salzburg in soft winter light. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Switzerland",
    "city": "Zermatt",
    "destination": "Ancient Temple",
    "prompt": "Admire through Ancient Temple in Zermatt at sunrise. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Africa",
    "country": "Kenya",
    "city": "Diani",
    "destination": "Night Bazaar",
    "prompt": "Listen through Night Bazaar in Diani at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "North America",
    "country": "Guatemala",
    "city": "Flores",
    "destination": "Botanical Garden",
    "prompt": "Listen through Botanical Garden in Flores at golden hour. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Africa",
    "country": "Botswana",
    "city": "Okavango Delta",
    "destination": "Grand Cathedral River Park",
    "prompt": "Climb through Grand Cathedral River Park in Okavango Delta at midday. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Palau",
    "city": "Koror",
    "destination": "Rock Formations",
    "prompt": "Gaze through Rock Formations in Koror on a breezy afternoon. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Mexico City",
    "destination": "Sand Dunes",
    "prompt": "Cruise through Sand Dunes in Mexico City under starry skies. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Asia",
    "country": "South Korea",
    "city": "Jeju City",
    "destination": "Cliffside Monastery",
    "prompt": "Cruise through Cliffside Monastery in Jeju City at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Uruguay",
    "city": "Montevideo",
    "destination": "Archaeological Site",
    "prompt": "Pause through Archaeological Site in Montevideo at golden hour. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "North America",
    "country": "Guatemala",
    "city": "Flores",
    "destination": "Blue Lagoon",
    "prompt": "Cruise through Blue Lagoon in Flores beneath a bright summer sky. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "La Paz",
    "destination": "Old Town",
    "prompt": "Savor through Old Town in La Paz beneath a bright summer sky. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "Praslin",
    "destination": "National Park",
    "prompt": "Savor through National Park in Praslin at midday. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "Netherlands",
    "city": "Rotterdam",
    "destination": "Central Market Viewpoint",
    "prompt": "Glide through Central Market Viewpoint in Rotterdam at golden hour. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "South America",
    "country": "Uruguay",
    "city": "Montevideo",
    "destination": "Archaeological Site Lookout",
    "prompt": "Gaze through Archaeological Site Lookout in Montevideo after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Africa",
    "country": "Ethiopia",
    "city": "Simien",
    "destination": "Panoramic Lookout",
    "prompt": "Pause through Panoramic Lookout in Simien at sunrise. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Asia",
    "country": "Vietnam",
    "city": "Ho Chi Minh City",
    "destination": "Sand Dunes Lookout",
    "prompt": "Hike through Sand Dunes Lookout in Ho Chi Minh City on a misty morning. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Oaxaca",
    "destination": "Cliffside Monastery",
    "prompt": "Climb through Cliffside Monastery in Oaxaca at sunrise. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Medellín",
    "destination": "Fortress Ruins",
    "prompt": "Listen through Fortress Ruins in Medellín at dusk. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Europe",
    "country": "United Kingdom",
    "city": "Bath",
    "destination": "National Park",
    "prompt": "Cycle through National Park in Bath after sunset. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "Austria",
    "city": "Innsbruck",
    "destination": "National Park",
    "prompt": "Kayak through National Park in Innsbruck on a misty morning. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Florence",
    "destination": "Grand Cathedral",
    "prompt": "Cruise through Grand Cathedral in Florence at sunrise. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "United Arab Emirates",
    "city": "Dubai",
    "destination": "Sea Cliffs",
    "prompt": "Kayak through Sea Cliffs in Dubai beneath a bright summer sky. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "Thailand",
    "city": "Bangkok",
    "destination": "Grand Cathedral",
    "prompt": "Cruise through Grand Cathedral in Bangkok at midday. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Aswan",
    "destination": "National Park",
    "prompt": "Kayak through National Park in Aswan at dusk. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Asia",
    "country": "Japan",
    "city": "Kyoto",
    "destination": "Royal Palace",
    "prompt": "Wander through Royal Palace in Kyoto on a breezy afternoon. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Miami",
    "destination": "Sea Cliffs",
    "prompt": "Listen through Sea Cliffs in Miami after sunset. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Punta Cana",
    "destination": "Grand Cathedral Sunset Point",
    "prompt": "Cruise through Grand Cathedral Sunset Point in Punta Cana at golden hour. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Miami",
    "destination": "National Museum",
    "prompt": "Admire through National Museum in Miami at golden hour. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "North America",
    "country": "Guatemala",
    "city": "Flores",
    "destination": "Panoramic Lookout",
    "prompt": "Wander through Panoramic Lookout in Flores at golden hour. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Canaima",
    "destination": "Mountain Viewpoint",
    "prompt": "Photograph through Mountain Viewpoint in Canaima after sunset. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Seattle",
    "destination": "Central Market",
    "prompt": "Pause through Central Market in Seattle at dusk. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Chicago",
    "destination": "Old Town",
    "prompt": "Hike through Old Town in Chicago at sunrise. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Beijing",
    "destination": "Canyon Overlook",
    "prompt": "Pause through Canyon Overlook in Beijing at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "North America",
    "country": "Jamaica",
    "city": "Kingston",
    "destination": "Art District Canal Walk",
    "prompt": "Admire through Art District Canal Walk in Kingston at golden hour. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "South America",
    "country": "Ecuador",
    "city": "Cuenca",
    "destination": "Sky Tower Sunset Point",
    "prompt": "Glide through Sky Tower Sunset Point in Cuenca at sunrise. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Tanzania",
    "city": "Arusha",
    "destination": "Lakeside Park",
    "prompt": "Savor through Lakeside Park in Arusha under starry skies. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "South America",
    "country": "Ecuador",
    "city": "Cuenca",
    "destination": "Cliffside Monastery",
    "prompt": "Stroll through Cliffside Monastery in Cuenca after sunset. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Rio de Janeiro",
    "destination": "National Park",
    "prompt": "Listen through National Park in Rio de Janeiro at dusk. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Europe",
    "country": "Norway",
    "city": "Tromsø",
    "destination": "Rock Formations",
    "prompt": "Cycle through Rock Formations in Tromsø under starry skies. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Chengdu",
    "destination": "Coral Beach",
    "prompt": "Cycle through Coral Beach in Chengdu under starry skies. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Venice",
    "destination": "Central Market",
    "prompt": "Kayak through Central Market in Venice on a misty morning. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Istanbul",
    "destination": "National Museum Viewpoint",
    "prompt": "Cruise through National Museum Viewpoint in Istanbul on a misty morning. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Queenstown",
    "destination": "Coral Beach",
    "prompt": "Kayak through Coral Beach in Queenstown under starry skies. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Sand Dunes",
    "prompt": "Climb through Sand Dunes in Nadi in soft winter light. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Crete",
    "destination": "Panoramic Lookout Heritage Trail",
    "prompt": "Cycle through Panoramic Lookout Heritage Trail in Crete on a breezy afternoon. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Oceania",
    "country": "Guam (USA)",
    "city": "Tumon",
    "destination": "Sky Tower Viewpoint",
    "prompt": "Glide through Sky Tower Viewpoint in Tumon at golden hour. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Paraguay",
    "city": "Asunción",
    "destination": "Old Town",
    "prompt": "Hike through Old Town in Asunción after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Sydney",
    "destination": "Harbor Front Lookout",
    "prompt": "Wander through Harbor Front Lookout in Sydney at golden hour. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Oceania",
    "country": "Vanuatu",
    "city": "Tanna Island",
    "destination": "Riverside Promenade River Park",
    "prompt": "Cruise through Riverside Promenade River Park in Tanna Island under starry skies. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Asia",
    "country": "Indonesia",
    "city": "Yogyakarta",
    "destination": "Panoramic Lookout",
    "prompt": "Admire through Panoramic Lookout in Yogyakarta at golden hour. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Oaxaca",
    "destination": "Blue Lagoon Lookout",
    "prompt": "Glide through Blue Lagoon Lookout in Oaxaca on a misty morning. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "North America",
    "country": "Panama",
    "city": "Panama City",
    "destination": "Night Bazaar Canal Walk",
    "prompt": "Kayak through Night Bazaar Canal Walk in Panama City at midday. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Botswana",
    "city": "Okavango Delta",
    "destination": "National Museum",
    "prompt": "Kayak through National Museum in Okavango Delta on a breezy afternoon. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Old Town",
    "prompt": "Listen through Old Town in Nadi on a misty morning. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Uluru",
    "destination": "Thermal Springs",
    "prompt": "Glide through Thermal Springs in Uluru on a breezy afternoon. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Valparaíso",
    "destination": "Central Market",
    "prompt": "Cycle through Central Market in Valparaíso on a misty morning. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "Saudi Arabia",
    "city": "Riyadh",
    "destination": "Old Town Hilltop",
    "prompt": "Cruise through Old Town Hilltop in Riyadh on a misty morning. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Cancún",
    "destination": "National Museum",
    "prompt": "Hike through National Museum in Cancún on a misty morning. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Athens",
    "destination": "Blue Lagoon",
    "prompt": "Photograph through Blue Lagoon in Athens at golden hour. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "San Pedro de Atacama",
    "destination": "City Walls",
    "prompt": "Climb through City Walls in San Pedro de Atacama on a breezy afternoon. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Asia",
    "country": "Saudi Arabia",
    "city": "Riyadh",
    "destination": "City Walls Canal Walk",
    "prompt": "Listen through City Walls Canal Walk in Riyadh beneath a bright summer sky. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "Thailand",
    "city": "Bangkok",
    "destination": "Historic Quarter",
    "prompt": "Cycle through Historic Quarter in Bangkok at dusk. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Xi'an",
    "destination": "Mountain Viewpoint",
    "prompt": "Cruise through Mountain Viewpoint in Xi'an in soft winter light. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Asia",
    "country": "Oman",
    "city": "Wahiba Sands",
    "destination": "Blue Lagoon",
    "prompt": "Photograph through Blue Lagoon in Wahiba Sands at dusk. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Bora Bora",
    "destination": "Cliffside Monastery",
    "prompt": "Gaze through Cliffside Monastery in Bora Bora under starry skies. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Uruguay",
    "city": "Montevideo",
    "destination": "Waterfront Boardwalk",
    "prompt": "Hike through Waterfront Boardwalk in Montevideo at golden hour. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Africa",
    "country": "Tanzania",
    "city": "Arusha",
    "destination": "Sky Tower",
    "prompt": "Wander through Sky Tower in Arusha in soft winter light. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "Switzerland",
    "city": "Zermatt",
    "destination": "Sand Dunes",
    "prompt": "Listen through Sand Dunes in Zermatt at sunrise. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Asia",
    "country": "Iran",
    "city": "Yazd",
    "destination": "Botanical Garden",
    "prompt": "Wander through Botanical Garden in Yazd at sunrise. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Bora Bora",
    "destination": "Old Town",
    "prompt": "Listen through Old Town in Bora Bora at dusk. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Mérida",
    "destination": "Art District",
    "prompt": "Savor through Art District in Mérida at golden hour. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Punta Arenas",
    "destination": "Archaeological Site",
    "prompt": "Savor through Archaeological Site in Punta Arenas at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "Thailand",
    "city": "Krabi",
    "destination": "Lakeside Park",
    "prompt": "Savor through Lakeside Park in Krabi at golden hour. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Medellín",
    "destination": "Art District Lookout",
    "prompt": "Cruise through Art District Lookout in Medellín on a misty morning. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Banff",
    "destination": "Night Bazaar",
    "prompt": "Stroll through Night Bazaar in Banff at golden hour. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Africa",
    "country": "Tanzania",
    "city": "Serengeti",
    "destination": "Lakeside Park",
    "prompt": "Stroll through Lakeside Park in Serengeti at midday. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "South Korea",
    "city": "Jeju City",
    "destination": "Ancient Temple",
    "prompt": "Kayak through Ancient Temple in Jeju City under starry skies. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Asia",
    "country": "Japan",
    "city": "Nara",
    "destination": "Art District",
    "prompt": "Cycle through Art District in Nara on a breezy afternoon. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Oceania",
    "country": "Tonga",
    "city": "Vavaʻu",
    "destination": "National Park Viewpoint",
    "prompt": "Admire through National Park Viewpoint in Vavaʻu after sunset. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Spain",
    "city": "Barcelona",
    "destination": "Botanical Garden Sunset Point",
    "prompt": "Savor through Botanical Garden Sunset Point in Barcelona after sunset. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Queenstown",
    "destination": "Central Market Sunset Point",
    "prompt": "Climb through Central Market Sunset Point in Queenstown at golden hour. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Europe",
    "country": "Portugal",
    "city": "Porto",
    "destination": "Lakeside Park",
    "prompt": "Pause through Lakeside Park in Porto beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Netherlands",
    "city": "The Hague",
    "destination": "Old Town",
    "prompt": "Cruise through Old Town in The Hague beneath a bright summer sky. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Night Bazaar Lookout",
    "prompt": "Listen through Night Bazaar Lookout in Nadi after sunset. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Cartagena",
    "destination": "Historic Quarter",
    "prompt": "Wander through Historic Quarter in Cartagena on a misty morning. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Africa",
    "country": "Botswana",
    "city": "Maun",
    "destination": "Sky Tower",
    "prompt": "Cruise through Sky Tower in Maun in soft winter light. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Luxor",
    "destination": "Panoramic Lookout",
    "prompt": "Climb through Panoramic Lookout in Luxor on a breezy afternoon. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Asia",
    "country": "Taiwan",
    "city": "Taichung",
    "destination": "Ancient Temple",
    "prompt": "Stroll through Ancient Temple in Taichung at sunrise. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Africa",
    "country": "Morocco",
    "city": "Chefchaouen",
    "destination": "Canyon Overlook",
    "prompt": "Kayak through Canyon Overlook in Chefchaouen at golden hour. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Asia",
    "country": "Japan",
    "city": "Tokyo",
    "destination": "Harbor Front Heritage Trail",
    "prompt": "Climb through Harbor Front Heritage Trail in Tokyo under starry skies. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Vik",
    "destination": "Old Town Hilltop",
    "prompt": "Stroll through Old Town Hilltop in Vik in soft winter light. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Europe",
    "country": "United Kingdom",
    "city": "York",
    "destination": "Sky Tower",
    "prompt": "Admire through Sky Tower in York after sunset. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "North America",
    "country": "Panama",
    "city": "Panama City",
    "destination": "Waterfront Boardwalk",
    "prompt": "Savor through Waterfront Boardwalk in Panama City at sunrise. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "Canada",
    "city": "Montreal",
    "destination": "Archaeological Site Heritage Trail",
    "prompt": "Wander through Archaeological Site Heritage Trail in Montreal at midday. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Manaus",
    "destination": "Harbor Front",
    "prompt": "Admire through Harbor Front in Manaus at midday. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Chicago",
    "destination": "Blue Lagoon Bay Overlook",
    "prompt": "Listen through Blue Lagoon Bay Overlook in Chicago at dusk. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Vik",
    "destination": "Art District",
    "prompt": "Kayak through Art District in Vik at dusk. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Europe",
    "country": "France",
    "city": "Lyon",
    "destination": "Royal Palace",
    "prompt": "Stroll through Royal Palace in Lyon at golden hour. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Bahamas",
    "city": "Exuma",
    "destination": "Riverside Promenade Sunset Point",
    "prompt": "Listen through Riverside Promenade Sunset Point in Exuma under starry skies. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Seattle",
    "destination": "National Museum",
    "prompt": "Glide through National Museum in Seattle on a breezy afternoon. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "South America",
    "country": "Argentina",
    "city": "El Calafate",
    "destination": "Archaeological Site",
    "prompt": "Savor through Archaeological Site in El Calafate at dusk. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Mérida",
    "destination": "Riverside Promenade",
    "prompt": "Cruise through Riverside Promenade in Mérida at sunrise. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Peru",
    "city": "Arequipa",
    "destination": "Sea Cliffs",
    "prompt": "Explore through Sea Cliffs in Arequipa on a breezy afternoon. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Africa",
    "country": "Madagascar",
    "city": "Morondava",
    "destination": "Central Market",
    "prompt": "Hike through Central Market in Morondava on a misty morning. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Sossusvlei",
    "destination": "Sand Dunes",
    "prompt": "Glide through Sand Dunes in Sossusvlei at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Botswana",
    "city": "Okavango Delta",
    "destination": "Fortress Ruins",
    "prompt": "Wander through Fortress Ruins in Okavango Delta after sunset. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Europe",
    "country": "Netherlands",
    "city": "Utrecht",
    "destination": "Lakeside Park",
    "prompt": "Stroll through Lakeside Park in Utrecht at dusk. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "North America",
    "country": "United States",
    "city": "Boston",
    "destination": "Tea House Street Lookout",
    "prompt": "Kayak through Tea House Street Lookout in Boston on a misty morning. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Asia",
    "country": "Oman",
    "city": "Wahiba Sands",
    "destination": "Mountain Viewpoint",
    "prompt": "Photograph through Mountain Viewpoint in Wahiba Sands at golden hour. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Oceania",
    "country": "Palau",
    "city": "Koror",
    "destination": "Coral Beach Sunset Point",
    "prompt": "Savor through Coral Beach Sunset Point in Koror at midday. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Asia",
    "country": "Bhutan",
    "city": "Thimphu",
    "destination": "Old Town Bay Overlook",
    "prompt": "Kayak through Old Town Bay Overlook in Thimphu beneath a bright summer sky. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "Europe",
    "country": "Netherlands",
    "city": "Amsterdam",
    "destination": "Art District",
    "prompt": "Admire through Art District in Amsterdam beneath a bright summer sky. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "South America",
    "country": "Ecuador",
    "city": "Quito",
    "destination": "Lakeside Park",
    "prompt": "Cruise through Lakeside Park in Quito at midday. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Asia",
    "country": "Jordan",
    "city": "Petra",
    "destination": "National Museum Canal Walk",
    "prompt": "Admire through National Museum Canal Walk in Petra at dusk. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Oceania",
    "country": "Vanuatu",
    "city": "Port Vila",
    "destination": "Blue Lagoon",
    "prompt": "Explore through Blue Lagoon in Port Vila after sunset. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Europe",
    "country": "Netherlands",
    "city": "Rotterdam",
    "destination": "Central Market",
    "prompt": "Cycle through Central Market in Rotterdam after sunset. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Africa",
    "country": "Mauritius",
    "city": "Chamarel",
    "destination": "Lakeside Park",
    "prompt": "Photograph through Lakeside Park in Chamarel under starry skies. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Aswan",
    "destination": "Art District",
    "prompt": "Pause through Art District in Aswan at golden hour. Capture the atmosphere with mountains rising in the distance."
  },
  {
    "continent": "Asia",
    "country": "United Arab Emirates",
    "city": "Abu Dhabi",
    "destination": "Lakeside Park Viewpoint",
    "prompt": "Admire through Lakeside Park Viewpoint in Abu Dhabi at midday. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Melbourne",
    "destination": "Rock Formations",
    "prompt": "Pause through Rock Formations in Melbourne on a breezy afternoon. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "Czech Republic",
    "city": "Český Krumlov",
    "destination": "Coral Beach",
    "prompt": "Gaze through Coral Beach in Český Krumlov in soft winter light. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Africa",
    "country": "Mauritius",
    "city": "Port Louis",
    "destination": "Ancient Temple",
    "prompt": "Gaze through Ancient Temple in Port Louis after sunset. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Izmir",
    "destination": "Mountain Viewpoint",
    "prompt": "Climb through Mountain Viewpoint in Izmir at midday. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Moorea",
    "destination": "Fortress Ruins",
    "prompt": "Cycle through Fortress Ruins in Moorea at golden hour. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Chichén Itzá",
    "destination": "Coral Beach Hilltop",
    "prompt": "Admire through Coral Beach Hilltop in Chichén Itzá on a breezy afternoon. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Europe",
    "country": "Czech Republic",
    "city": "Český Krumlov",
    "destination": "Old Town",
    "prompt": "Cruise through Old Town in Český Krumlov on a breezy afternoon. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "North America",
    "country": "Dominican Republic",
    "city": "Punta Cana",
    "destination": "National Museum",
    "prompt": "Pause through National Museum in Punta Cana after sunset. Capture the atmosphere with desert winds whispering."
  },
  {
    "continent": "Europe",
    "country": "Turkey",
    "city": "Izmir",
    "destination": "Cliffside Monastery",
    "prompt": "Stroll through Cliffside Monastery in Izmir beneath a bright summer sky. Capture the atmosphere with the scent of street food all around."
  },
  {
    "continent": "Europe",
    "country": "Italy",
    "city": "Rome",
    "destination": "Mountain Viewpoint",
    "prompt": "Glide through Mountain Viewpoint in Rome in soft winter light. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "New Zealand",
    "city": "Rotorua",
    "destination": "Sea Cliffs Hilltop",
    "prompt": "Cycle through Sea Cliffs Hilltop in Rotorua at sunrise. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Europe",
    "country": "Poland",
    "city": "Warsaw",
    "destination": "Archaeological Site",
    "prompt": "Cycle through Archaeological Site in Warsaw after sunset. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "South America",
    "country": "Brazil",
    "city": "Rio de Janeiro",
    "destination": "Mountain Viewpoint Bay Overlook",
    "prompt": "Listen through Mountain Viewpoint Bay Overlook in Rio de Janeiro on a misty morning. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "North America",
    "country": "Mexico",
    "city": "Oaxaca",
    "destination": "Night Bazaar Sunset Point",
    "prompt": "Climb through Night Bazaar Sunset Point in Oaxaca under starry skies. Capture the atmosphere beneath towering cliffs."
  },
  {
    "continent": "Europe",
    "country": "Portugal",
    "city": "Porto",
    "destination": "National Museum Lookout",
    "prompt": "Gaze through National Museum Lookout in Porto after sunset. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Asia",
    "country": "China",
    "city": "Shanghai",
    "destination": "Mountain Viewpoint",
    "prompt": "Climb through Mountain Viewpoint in Shanghai after sunset. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Oceania",
    "country": "French Polynesia",
    "city": "Bora Bora",
    "destination": "Mountain Viewpoint Lookout",
    "prompt": "Wander through Mountain Viewpoint Lookout in Bora Bora in soft winter light. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Africa",
    "country": "Egypt",
    "city": "Siwa",
    "destination": "Old Town Canal Walk",
    "prompt": "Gaze through Old Town Canal Walk in Siwa in soft winter light. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "Africa",
    "country": "Namibia",
    "city": "Etosha",
    "destination": "Thermal Springs",
    "prompt": "Kayak through Thermal Springs in Etosha on a misty morning. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "South America",
    "country": "Colombia",
    "city": "Bogotá",
    "destination": "Fortress Ruins",
    "prompt": "Admire through Fortress Ruins in Bogotá at midday. Capture the atmosphere beneath ancient stonework."
  },
  {
    "continent": "South America",
    "country": "Venezuela",
    "city": "Caracas",
    "destination": "Night Bazaar Hilltop",
    "prompt": "Cycle through Night Bazaar Hilltop in Caracas at golden hour. Capture the atmosphere as lanterns flicker to life."
  },
  {
    "continent": "Europe",
    "country": "Switzerland",
    "city": "Zurich",
    "destination": "Waterfront Boardwalk Hilltop",
    "prompt": "Stroll through Waterfront Boardwalk Hilltop in Zurich at sunrise. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "South America",
    "country": "Peru",
    "city": "Arequipa",
    "destination": "Rock Formations",
    "prompt": "Hike through Rock Formations in Arequipa at midday. Capture the atmosphere while waves lap the shore."
  },
  {
    "continent": "Europe",
    "country": "Iceland",
    "city": "Akureyri",
    "destination": "National Park",
    "prompt": "Cruise through National Park in Akureyri in soft winter light. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Asia",
    "country": "South Korea",
    "city": "Busan",
    "destination": "Sand Dunes",
    "prompt": "Cruise through Sand Dunes in Busan at golden hour. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Europe",
    "country": "Greece",
    "city": "Thessaloniki",
    "destination": "Mountain Viewpoint Canal Walk",
    "prompt": "Explore through Mountain Viewpoint Canal Walk in Thessaloniki beneath a bright summer sky. Capture the atmosphere as birds wheel overhead."
  },
  {
    "continent": "Oceania",
    "country": "Fiji",
    "city": "Nadi",
    "destination": "Sea Cliffs",
    "prompt": "Cycle through Sea Cliffs in Nadi at golden hour. Capture the atmosphere as the city sparkles below."
  },
  {
    "continent": "South America",
    "country": "Bolivia",
    "city": "La Paz",
    "destination": "Waterfront Boardwalk",
    "prompt": "Stroll through Waterfront Boardwalk in La Paz at golden hour. Capture the atmosphere as music drifts through the air."
  },
  {
    "continent": "Europe",
    "country": "Portugal",
    "city": "Faro",
    "destination": "National Park",
    "prompt": "Admire through National Park in Faro in soft winter light. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "South America",
    "country": "Chile",
    "city": "Punta Arenas",
    "destination": "Riverside Promenade",
    "prompt": "Pause through Riverside Promenade in Punta Arenas beneath a bright summer sky. Capture the atmosphere as clouds paint moving shadows."
  },
  {
    "continent": "Oceania",
    "country": "Papua New Guinea",
    "city": "Port Moresby",
    "destination": "Central Market Bay Overlook",
    "prompt": "Climb through Central Market Bay Overlook in Port Moresby on a misty morning. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "Oceania",
    "country": "Australia",
    "city": "Sydney",
    "destination": "Harbor Front",
    "prompt": "Pause through Harbor Front in Sydney beneath a bright summer sky. Capture the atmosphere while markets hum with life."
  },
  {
    "continent": "North America",
    "country": "Jamaica",
    "city": "Kingston",
    "destination": "Waterfront Boardwalk",
    "prompt": "Gaze through Waterfront Boardwalk in Kingston beneath a bright summer sky. Capture the atmosphere as river light shimmers."
  },
  {
    "continent": "Africa",
    "country": "Seychelles",
    "city": "La Digue",
    "destination": "Blue Lagoon Lookout",
    "prompt": "Admire through Blue Lagoon Lookout in La Digue on a misty morning. Capture the atmosphere beneath ancient stonework."
  }
];


const CONTINENT_COORDINATE_BOUNDS = {
  "north america": { lat: [5, 72], lng: [-165, -50] },
  "south america": { lat: [-55, 12], lng: [-82, -35] },
  europe: { lat: [35, 72], lng: [-25, 40] },
  africa: { lat: [-35, 35], lng: [-17, 50] },
  asia: { lat: [0, 70], lng: [35, 150] },
  oceania: { lat: [-50, 10], lng: [110, 180] },
  other: { lat: [-65, 75], lng: [-180, 180] }
};

const TRAVEL_DATA_CANDIDATES = [];
const DEFAULT_POINT_ALTITUDE = 0.02;
const FOCUSED_POINT_ALTITUDE = 0.06;
const DEFAULT_POINT_RADIUS = 0.45;
const FOCUSED_POINT_RADIUS = 0.9;
const GLOBE_FLY_DURATION_MS = 1500;
const AUTO_ROTATE_RESUME_DELAY = 2000;

const PROMPT_SNIPPET_FALLBACKS = [
  "late-night street food smoke",
  "salt air hanging above the docks",
  "quiet alleys waking up at sunrise",
  "lantern light shimmering down the promenade"
];

const DEFAULT_VIBE_THEME = "cultural";

const VIBE_THEMES = {
  coastal: {
    accent: "#7fd4ff",
    accentSoft: "rgba(127, 212, 255, 0.16)",
    bgCard: "radial-gradient(circle at top, #0b2435, #050816)"
  },
  desert: {
    accent: "#f6c472",
    accentSoft: "rgba(246, 196, 114, 0.18)",
    bgCard: "radial-gradient(circle at top, #3a2612, #090308)"
  },
  forest: {
    accent: "#7ad48b",
    accentSoft: "rgba(122, 212, 139, 0.18)",
    bgCard: "radial-gradient(circle at top, #062519, #050813)"
  },
  mountain: {
    accent: "#cfd9ff",
    accentSoft: "rgba(207, 217, 255, 0.18)",
    bgCard: "radial-gradient(circle at top, #101833, #05050d)"
  },
  urban: {
    accent: "#ff90e8",
    accentSoft: "rgba(255, 144, 232, 0.18)",
    bgCard: "radial-gradient(circle at top, #1a0f24, #05050a)"
  },
  tropical: {
    accent: "#ffbe7b",
    accentSoft: "rgba(255, 190, 123, 0.2)",
    bgCard: "radial-gradient(circle at top, #0c201b, #05070d)"
  },
  polar: {
    accent: "#a3e4ff",
    accentSoft: "rgba(163, 228, 255, 0.22)",
    bgCard: "radial-gradient(circle at top, #051526, #050610)"
  },
  cultural: {
    accent: "#f6a7ff",
    accentSoft: "rgba(246, 167, 255, 0.2)",
    bgCard: "radial-gradient(circle at top, #1a0c26, #05050d)"
  }
};

const VIBE_THEME_LABELS = {
  coastal: "Coastal drift",
  desert: "Desert bloom",
  forest: "Forest hush",
  mountain: "Mountain air",
  urban: "Urban pulse",
  tropical: "Tropical glow",
  polar: "Polar clarity",
  cultural: "Cultural tapestry"
};

/**
 * @typedef {Object} TravelPoint
 * @property {string} id
 * @property {string} continent
 * @property {string} country
 * @property {string} city
 * @property {string} destination
 * @property {string} prompt
 * @property {string} [promptIntro]
 * @property {string} [promptSnippet]
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} TravelGuidePlanDay
 * @property {number} day
 * @property {string} title
 * @property {string} morning
 * @property {string} afternoon
 * @property {string} evening
 */

/**
 * @typedef {Object} TravelGuidePlan
 * @property {{ continent: string; country: string; city?: string; area?: string }} location
 * @property {string} overview
 * @property {string} best_time_to_go
 * @property {string} ideal_for
 * @property {TravelGuidePlanDay[]} itinerary
 * @property {string[]} highlights
 * @property {string[]} food_and_drink
 * @property {string[]} local_culture
 * @property {string[]} practical_tips
 * @property {string[]} safety_notes
 */

/**
 * @typedef {"coastal" | "desert" | "forest" | "mountain" | "urban" | "tropical" | "polar" | "cultural"} VibeTheme
 */

const mapPlane = document.getElementById("atlas-map-plane");
const nowFocusedEl = document.getElementById("atlas-now-focused");
const pinCountEl = document.getElementById("atlas-pin-count");
const debugLabelEl = document.getElementById("atlas-debug-label");
const detailPanel = document.getElementById("atlas-detail-panel");
const detailTitleEl = document.getElementById("atlas-detail-title");
const detailMetaEl = document.getElementById("atlas-detail-meta");
const detailBodyEl = document.getElementById("atlas-detail-body");
const backHomeBtn = document.getElementById("atlas-back-home");

const travelPlanCache = new Map();
let preparedTravelPoints = [];
let currentTravelPoint = null;
let currentVibeTheme = DEFAULT_VIBE_THEME;
let tooltipEl = null;
let activeGuideRequestId = 0;
let globeInstance = null;
let focusedTravelPointId = null;
let hoveredTravelPointId = null;
let pointerPosition = { x: 0, y: 0 };
let autoRotateTimeoutId = null;

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shuffleInPlace(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function applyJitter(lat, lng, seed, amplitude = 1.5) {
  const fracA = seededFraction(`${seed}-lat-jitter`);
  const fracB = seededFraction(`${seed}-lng-jitter`);
  const latOffset = (fracA - 0.5) * amplitude;
  const lngOffset = (fracB - 0.5) * amplitude * 1.6;
  return {
    lat: clamp(lat + latOffset, -85, 85),
    lng: wrapLongitude(lng + lngOffset)
  };
}

function cleanPromptString(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function buildPromptIntro(prompt) {
  const cleaned = cleanPromptString(prompt);
  if (!cleaned) {
    return "You’ll wander wherever the lights pull you.";
  }
  const sentence = cleaned
    .split(/[.!?]/)
    .map((chunk) => chunk.trim())
    .find(Boolean);
  if (!sentence) {
    return "You’ll wander wherever the lights pull you.";
  }
  const trimmed = sentence.replace(/^you['’]?ll\s+/i, "").trim();
  const lowered = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  const result = `You’ll ${lowered}`.replace(/\s+/g, " ").trim();
  return result.endsWith(".") ? result : `${result}.`;
}

function buildPromptSnippet(prompt, maxLength = 80) {
  const cleaned = cleanPromptString(prompt);
  if (!cleaned) {
    return PROMPT_SNIPPET_FALLBACKS[0];
  }
  const parts = cleaned
    .split(/[.!?]/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  let snippet = parts[1] || parts[0] || cleaned;
  snippet = snippet
    .replace(/capture the atmosphere/gi, "")
    .replace(/capture the mood/gi, "")
    .replace(/calibrate .*?sensors/gi, "")
    .replace(/relay .*?hq/gi, "")
    .replace(/^while\s+/i, "")
    .replace(/^as\s+/i, "")
    .replace(/^with\s+/i, "")
    .replace(/^and\s+/i, "")
    .replace(/^collect\s+/i, "")
    .trim();
  if (!snippet) {
    const fallbackSeed = parts[0] || cleaned;
    const fallbackIndex = Math.floor(seededFraction(`${fallbackSeed}-snippet`) * PROMPT_SNIPPET_FALLBACKS.length);
    snippet = PROMPT_SNIPPET_FALLBACKS[fallbackIndex];
  }
  snippet = snippet.replace(/\.$/, "").trim();
  if (!snippet) {
    const fallbackIndex = Math.floor(seededFraction(`${cleaned}-fallback`) * PROMPT_SNIPPET_FALLBACKS.length);
    snippet = PROMPT_SNIPPET_FALLBACKS[fallbackIndex];
  }
  if (snippet.length > maxLength) {
    snippet = `${snippet.slice(0, maxLength - 1).trim()}…`;
  }
  const lowered = snippet.charAt(0).toLowerCase() + snippet.slice(1);
  return lowered;
}

function formatSnippetLine(text, { capitalize = false } = {}) {
  const base = cleanPromptString(text);
  if (!base) {
    return PROMPT_SNIPPET_FALLBACKS[1];
  }
  if (capitalize) {
    return base.charAt(0).toUpperCase() + base.slice(1);
  }
  return base.charAt(0).toLowerCase() + base.slice(1);
}

function inferVibeTheme(travelPoint) {
  const text = `${travelPoint.city || ""} ${travelPoint.destination || ""} ${travelPoint.prompt || ""}`.toLowerCase();
  if (/\b(beach|coast|coral|lagoon|island|harbor|harbour|bay)\b/.test(text)) {
    return "coastal";
  }
  if (/\b(desert|dunes|wadi|sands|sahara|merzouga)\b/.test(text)) {
    return "desert";
  }
  if (/\b(jungle|rainforest|forest|national park|safari)\b/.test(text)) {
    return "forest";
  }
  if (/\b(mountain|cliff|viewpoint|alps|andes|himalaya)\b/.test(text)) {
    return "mountain";
  }
  if (/\b(city|old town|historic quarter|market|bazaar|downtown)\b/.test(text)) {
    return "urban";
  }
  if (/\b(tropical|lagoon|palm|reef)\b/.test(text)) {
    return "tropical";
  }
  if (/\b(ice|glacier|fjord|aurora|arctic)\b/.test(text)) {
    return "polar";
  }
  return "cultural";
}

function applyVibeTheme(vibe) {
  const nextTheme = VIBE_THEMES[vibe] || VIBE_THEMES[DEFAULT_VIBE_THEME];
  const root = document.documentElement;
  if (!root || !nextTheme) {
    return;
  }
  root.style.setProperty("--vibe-accent", nextTheme.accent);
  root.style.setProperty("--vibe-accent-soft", nextTheme.accentSoft);
  root.style.setProperty("--vibe-card-bg", nextTheme.bgCard);
  if (mapPlane) {
    mapPlane.style.setProperty("--atlas-globe-tint", nextTheme.accentSoft);
  }
  updateGlobePointStyles();
}

function humanizeVibeTheme(vibe) {
  return (VIBE_THEME_LABELS[vibe] || VIBE_THEME_LABELS[DEFAULT_VIBE_THEME]).replace(/^\w/, (char) =>
    char.toUpperCase()
  );
}

function getCurrentAccentColor() {
  const theme = VIBE_THEMES[currentVibeTheme] || VIBE_THEMES[DEFAULT_VIBE_THEME];
  return theme.accent || "#ffffff";
}

function seededFraction(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function normalizeContinent(label) {
  const text = (label || "other").toLowerCase();
  if (text.includes("north") && text.includes("america")) return "north america";
  if (text.includes("south") && text.includes("america")) return "south america";
  if (text.includes("latin") && text.includes("america")) return "south america";
  if (text.includes("europe")) return "europe";
  if (text.includes("africa")) return "africa";
  if (text.includes("asia")) return "asia";
  if (text.includes("oceania") || text.includes("australia")) return "oceania";
  return "other";
}

function getContinentBounds(continentKey) {
  return CONTINENT_COORDINATE_BOUNDS[continentKey] || CONTINENT_COORDINATE_BOUNDS.other;
}

function normalizeCoordinateValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
}

function wrapLongitude(value) {
  if (!Number.isFinite(value)) return 0;
  let lng = value;
  while (lng > 180) {
    lng -= 360;
  }
  while (lng < -180) {
    lng += 360;
  }
  return lng;
}

function deriveCoordinates(point, index) {
  const latCandidate = normalizeCoordinateValue(point.lat ?? point.latitude);
  const lngCandidate = normalizeCoordinateValue(point.lng ?? point.longitude);
  const hasExact =
    typeof latCandidate === "number" && Number.isFinite(latCandidate) && typeof lngCandidate === "number" && Number.isFinite(lngCandidate);
  const baseLat = hasExact ? clamp(latCandidate, -90, 90) : null;
  const baseLng = hasExact ? wrapLongitude(lngCandidate) : null;
  if (hasExact && baseLat !== null && baseLng !== null) {
    return {
      lat: baseLat,
      lng: baseLng,
      inferred: false
    };
  }
  const continentKey = normalizeContinent(point.continent);
  const bounds = getContinentBounds(continentKey);
  const latSeed = seededFraction(`${point.city || "city"}-${point.country || "country"}-${index}-lat`);
  const lngSeed = seededFraction(`${point.destination || "destination"}-${index}-lng`);
  const latRange = bounds.lat[1] - bounds.lat[0];
  const lngRange = bounds.lng[1] - bounds.lng[0];
  const lat = bounds.lat[0] + latSeed * latRange;
  const lng = bounds.lng[0] + lngSeed * lngRange;
  return {
    lat: Number(lat.toFixed(4)),
    lng: Number(lng.toFixed(4)),
    inferred: true
  };
}

function augmentTravelPoint(point, index) {
  const continent = point.continent || "Other";
  const country = point.country || "Unknown";
  const destination = point.destination || "Unknown Destination";
  const city = point.city && point.city.trim() ? point.city.trim() : destination;
  const slug = slugify(`${country}-${city}-${destination}`) || `node-${index}`;
  const id = `${slug}-${index}`;
  const coords = deriveCoordinates(point, index);
  const jittered = coords.inferred ? applyJitter(coords.lat, coords.lng, `${id}-${index}`) : coords;
  const promptIntro = buildPromptIntro(point.prompt);
  const promptSnippet = buildPromptSnippet(point.prompt);
  return {
    ...point,
    continent,
    country,
    city,
    destination,
    id,
    lat: jittered.lat,
    lng: jittered.lng,
    promptIntro,
    promptSnippet
  };
}

async function loadTravelPointDataset() {
  const remotePoints = await tryFetchTravelPoints();
  if (remotePoints && remotePoints.length > 0) {
    return remotePoints;
  }
  console.warn("Falling back to baked-in travel stories.");
  return FALLBACK_TRAVEL_POINTS;
}

async function tryFetchTravelPoints() {
  if (typeof fetch !== "function") {
    return null;
  }
  for (const url of TRAVEL_DATA_CANDIDATES) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        return data;
      }
    } catch (error) {
      console.warn("Failed to fetch travel stories from", url, error);
    }
  }
  return null;
}

async function initAtlas() {
  setDebugStatus("Gathering the glowing paths…");
  const dataset = await loadTravelPointDataset();
  preparedTravelPoints = shuffleInPlace(dataset.map(augmentTravelPoint));
  if (pinCountEl) {
    pinCountEl.textContent = "Scattered across the globe";
  }
  initGlobe(preparedTravelPoints);
  if (!window.location.hash) {
    window.location.hash = "#/";
  } else {
    renderRoute();
  }
  setDebugStatus("Ready when you drift closer.");
}

function initGlobe(points) {
  if (!mapPlane) return;
  if (typeof Globe !== "function") {
    console.error("Globe library is missing. Ensure globe.gl is loaded before script.js.");
    return;
  }
  mapPlane.innerHTML = "";
  tooltipEl = null;
  hoveredTravelPointId = null;
  const width = mapPlane.clientWidth || mapPlane.offsetWidth || 600;
  const height = mapPlane.clientHeight || mapPlane.offsetHeight || 600;
  globeInstance = Globe()(mapPlane)
    .width(width)
    .height(height)
    .backgroundColor("rgba(0,0,0,0)")
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
    .pointLat((point) => point.lat)
    .pointLng((point) => point.lng)
    .pointAltitude((point) =>
      point.id === focusedTravelPointId ? FOCUSED_POINT_ALTITUDE : DEFAULT_POINT_ALTITUDE
    )
    .pointColor((point) => (point.id === focusedTravelPointId ? getCurrentAccentColor() : "#ffffff"))
    .pointRadius((point) => (point.id === focusedTravelPointId ? FOCUSED_POINT_RADIUS : DEFAULT_POINT_RADIUS))
    .pointResolution(8)
    .pointsData(points);

  const controls = globeInstance.controls();
  controls.enablePan = false;
  controls.minDistance = 160;
  controls.maxDistance = 480;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;
  controls.addEventListener("start", pauseAutoRotate);
  controls.addEventListener("end", resumeAutoRotateWithDelay);

  globeInstance.onPointHover((point) => {
    if (!point) {
      hoveredTravelPointId = null;
      hideTooltip();
      restoreDebugStatus();
      return;
    }
    hoveredTravelPointId = point.id;
    showTooltip(point);
    const hoverLocation = [point.city, point.country].filter(Boolean).join(", ");
    setDebugStatus(hoverLocation ? `Glimpsing ${hoverLocation}` : "Tracing a wandering glow");
  });

  globeInstance.onPointClick((point) => {
    if (!point) return;
    handleTravelPointSelection(point);
  });

  updateGlobePointStyles();
  updateGlobeTintOverlay();
  window.addEventListener("resize", updateGlobeDimensions);
}

function updateGlobeDimensions() {
  if (!globeInstance || !mapPlane) return;
  const width = mapPlane.clientWidth || mapPlane.offsetWidth || 600;
  const height = mapPlane.clientHeight || mapPlane.offsetHeight || 600;
  globeInstance.width(width);
  globeInstance.height(height);
}

function pauseAutoRotate() {
  if (!globeInstance) return;
  globeInstance.controls().autoRotate = false;
  if (autoRotateTimeoutId) {
    clearTimeout(autoRotateTimeoutId);
    autoRotateTimeoutId = null;
  }
}

function resumeAutoRotateWithDelay() {
  if (!globeInstance) return;
  if (autoRotateTimeoutId) {
    clearTimeout(autoRotateTimeoutId);
  }
  autoRotateTimeoutId = window.setTimeout(() => {
    if (!globeInstance) {
      return;
    }
    globeInstance.controls().autoRotate = true;
  }, AUTO_ROTATE_RESUME_DELAY);
}

function updateGlobePointStyles() {
  if (!globeInstance) return;
  const accentColor = getCurrentAccentColor();
  globeInstance
    .pointAltitude((point) => (point.id === focusedTravelPointId ? FOCUSED_POINT_ALTITUDE : DEFAULT_POINT_ALTITUDE))
    .pointRadius((point) => (point.id === focusedTravelPointId ? FOCUSED_POINT_RADIUS : DEFAULT_POINT_RADIUS))
    .pointColor((point) => (point.id === focusedTravelPointId ? accentColor : "#ffffff"));
}

function updateGlobeTintOverlay() {
  if (!mapPlane) return;
  const accentSoft = (VIBE_THEMES[currentVibeTheme] || VIBE_THEMES[DEFAULT_VIBE_THEME]).accentSoft;
  mapPlane.style.setProperty("--atlas-globe-tint", accentSoft);
}

function handleTravelPointSelection(point) {
  focusTravelPoint(point);
  flyToTravelPoint(point);
  openTravelPlan(point);
}

function focusTravelPoint(point) {
  currentTravelPoint = point;
  if (nowFocusedEl) {
    const cityCountryLabel = [point.city, point.country].filter(Boolean).join(", ");
    const focusLabel = [point.destination, cityCountryLabel].filter(Boolean).join(" · ") || "Following a wandering glow";
    nowFocusedEl.textContent = focusLabel;
  }
  const cityCountry = [point.city, point.country].filter(Boolean).join(", ");
  setDebugStatus(cityCountry ? `Last chosen: ${cityCountry}` : "Last chosen: Somewhere uncharted");
  highlightSelections(point.id);
}

function highlightSelections(pointId) {
  focusedTravelPointId = pointId;
  updateGlobePointStyles();
}

function flyToTravelPoint(point) {
  if (!globeInstance || !point) return;
  const pointOfView = {
    lat: point.lat,
    lng: point.lng,
    altitude: 1.5
  };
  globeInstance.pointOfView(pointOfView, GLOBE_FLY_DURATION_MS);
}

function ensureTooltip() {
  if (tooltipEl || !mapPlane) return;
  tooltipEl = document.createElement("div");
  tooltipEl.className = "atlas-tooltip";
  mapPlane.appendChild(tooltipEl);
}

function showTooltip(point) {
  ensureTooltip();
  if (!tooltipEl || !mapPlane) return;
  hoveredTravelPointId = point.id;
  const sensoryLine = formatSnippetLine(point.promptSnippet);
  tooltipEl.innerHTML = `
    <strong>${point.city}, ${point.country}</strong>
    <span>${point.destination} · ${sensoryLine}</span>
  `;
  updateTooltipPosition();
  tooltipEl.classList.add("visible");
}

function hideTooltip() {
  if (!tooltipEl) return;
  hoveredTravelPointId = null;
  tooltipEl.classList.remove("visible");
}

function updateTooltipPosition() {
  if (!tooltipEl || !mapPlane) return;
  const mapRect = mapPlane.getBoundingClientRect();
  const left = pointerPosition.x - mapRect.left;
  const top = pointerPosition.y - mapRect.top;
  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${Math.max(top - 12, 8)}px`;
}

function handlePointerMove(event) {
  pointerPosition = { x: event.clientX, y: event.clientY };
  if (tooltipEl && tooltipEl.classList.contains("visible")) {
    updateTooltipPosition();
  }
}

function setDebugStatus(message) {
  if (debugLabelEl) {
    debugLabelEl.textContent = message;
  }
}

function restoreDebugStatus() {
  if (currentTravelPoint) {
    const cityCountry = [currentTravelPoint.city, currentTravelPoint.country].filter(Boolean).join(", ");
    setDebugStatus(cityCountry ? `Last chosen: ${cityCountry}` : "Last chosen: Somewhere uncharted");
  } else {
    setDebugStatus("Waiting for your first leap");
  }
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash || hash === "/") {
    return { name: "home" };
  }
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "point" && parts[1]) {
    return { name: "detail", id: parts[1] };
  }
  return { name: "home" };
}

function renderRoute() {
  const route = parseRoute();
  if (route.name === "detail" && route.id) {
    const target = preparedTravelPoints.find((entry) => entry.id === route.id);
    if (target) {
      focusTravelPoint(target);
      flyToTravelPoint(target);
      showDetailPanel(target);
    } else {
      renderMissingDetail(route.id);
    }
  } else {
    renderHomeDetailPlaceholder();
  }
}

function renderHomeDetailPlaceholder() {
  if (detailPanel) {
    detailPanel.classList.add("is-idle");
  }
  if (detailTitleEl) {
    detailTitleEl.textContent = "Follow a glowing light to see the plan.";
  }
  if (detailMetaEl) {
    detailMetaEl.textContent = "Your travel studio fills in the moment a light catches your eye.";
  }
  if (detailBodyEl) {
    detailBodyEl.innerHTML = '<p class="atlas-detail-placeholder">Use the atlas map to choose a place and its story will unfurl here.</p>';
  }
}

function renderMissingDetail(id) {
  if (detailPanel) {
    detailPanel.classList.remove("is-idle");
  }
  if (detailTitleEl) {
    detailTitleEl.textContent = "Travel point not found";
  }
  if (detailMetaEl) {
    detailMetaEl.textContent = "That story isn't on this map yet.";
  }
  if (detailBodyEl) {
    detailBodyEl.innerHTML = '<p class="atlas-error">Try refreshing the map or picking another glow.</p>';
  }
}

function showDetailPanel(point) {
  if (detailPanel) {
    detailPanel.classList.remove("is-idle");
  }
  if (detailTitleEl) {
    detailTitleEl.textContent = `${point.city}, ${point.country}`;
  }
  if (detailMetaEl) {
    detailMetaEl.textContent = `${point.destination} · ${point.continent}`;
  }
  const vibe = inferVibeTheme(point);
  currentVibeTheme = vibe;
  applyVibeTheme(vibe);
  if (detailBodyEl) {
    const introLine = point.promptIntro || buildPromptIntro(point.prompt);
    const sensoryLine = formatSnippetLine(point.promptSnippet, { capitalize: true });
    detailBodyEl.innerHTML = `
      ${renderVisualOverviewSkeleton(vibe, point)}
      <section class="detail-section">
        <h3>Why this trip feels special</h3>
        <p>${introLine}</p>
        <p class="detail-section-note">${sensoryLine}</p>
      </section>
      <div class="atlas-detail-loading">Stitching together a field-ready plan…</div>
    `;
  }
  requestTravelPlan(point, vibe);
}

function buildTravelAgentPrompt(travelPoint) {
  const continent = travelPoint.continent || "Unknown continent";
  const country = travelPoint.country || "Unknown country";
  const city = travelPoint.city || travelPoint.destination || country;
  const area = travelPoint.destination || travelPoint.city || travelPoint.country || country;
  const prompt = travelPoint.prompt || "";
  return `
You are an expert travel planner and travel writer.

Create a rich, practical travel guide for a traveler considering a short trip to:

- Continent: ${continent}
- Country: ${country}
- Region / city: ${city}
- Specific area or highlight: ${area}

Use this sensory seed description as inspiration:
"${prompt}"

Write for a curious human traveler, not for a machine operator.

Your task:
- Turn this seed into a detailed 2–3 day travel plan and guide for a first-time visitor.
- Focus on real places to see, things to do, and how the trip feels on the ground.

Output JSON only, with this exact schema:

{
  "location": {
    "continent": "string",
    "country": "string",
    "city": "string",
    "area": "string"
  },
  "overview": "short paragraph (max ~120 words) explaining why this trip is special",
  "best_time_to_go": "sentence about seasons / months and weather",
  "ideal_for": "1–2 sentences about what type of traveler will love this (e.g. hikers, food-lovers, families)",
  "itinerary": [
    {
      "day": 1,
      "title": "short title",
      "morning": "what to do in the morning",
      "afternoon": "what to do in the afternoon",
      "evening": "what to do in the evening"
    },
    {
      "day": 2,
      "title": "short title",
      "morning": "...",
      "afternoon": "...",
      "evening": "..."
    }
  ],
  "highlights": [
    "3–6 must-experience places or moments with very short explanations"
  ],
  "food_and_drink": [
    "3–6 suggestions for local dishes, cafés, markets, or bars"
  ],
  "local_culture": [
    "2–5 notes about culture, etiquette, or how locals live here"
  ],
  "practical_tips": [
    "3–6 concrete, helpful tips (transport, money, safety, packing, etc.)"
  ],
  "safety_notes": [
    "1–3 realistic, non-alarmist safety or common-sense notes (if relevant)"
  ]
}

Important rules:
- DO NOT talk about 'agents', 'LLMs', 'APIs', 'sensors', or 'prompts'.
- DO NOT give instructions to developers or operators.
- Write as if you are speaking directly to the traveler.
- Use warm, vivid language but stay concise and helpful.
- If you are unsure about something, keep the advice generic and safe.
`;
}

function inferBestTimeWindow(prompt, cityLabel) {
  const place = cityLabel || "this destination";
  if (!prompt) {
    return `Follow the local forecast and ride the best weather windows around ${place}.`;
  }
  if (/\b(sunrise|dawn|first light)\b/i.test(prompt)) {
    return `Aim for dawn—${place} glows in the soft light just before sunrise.`;
  }
  if (/\b(sunset|golden hour|dusk|twilight)\b/i.test(prompt)) {
    return `Golden hour into sunset is magic; plan afternoon naps so you can roam as the sky warms.`;
  }
  if (/\b(night|midnight|starry|after dark)\b/i.test(prompt)) {
    return `After dark the streets hum—pack a layer and explore evenings when neon and lanterns flip on.`;
  }
  if (/\b(misty|rain|monsoon|storm)\b/i.test(prompt)) {
    return `Expect shifting clouds and light showers. Keep a lightweight shell handy for ${place}.`;
  }
  return `Weather moves quickly in ${place}; keep plans flexible and chase the clearest windows.`;
}

function inferIdealFor(prompt, cityLabel) {
  const place = cityLabel || "this trip";
  if (/\b(hike|climb|trek|trail|summit)\b/i.test(prompt)) {
    return "Hikers and ridge-chasers who crave early starts and dramatic overlooks.";
  }
  if (/\b(market|street food|cafe|bazaar)\b/i.test(prompt)) {
    return "Food lovers and cultural grazers who love market chatter and slow tasting sessions.";
  }
  if (/\b(kayak|harbor|shore|lagoon|coast|waterfront)\b/i.test(prompt)) {
    return "Waterfront wanderers who split time between shoreline strolls and calm paddles.";
  }
  if (/\b(temple|ruins|cathedral|historic|monastery)\b/i.test(prompt)) {
    return "History fans and photographers who savor layered heritage walks.";
  }
  return `Curious travelers who enjoy unstructured roaming, note-taking, and conversations in ${place}.`;
}

function buildFallbackTravelGuide(travelPoint) {
  const location = {
    continent: travelPoint.continent || "Unknown",
    country: travelPoint.country || "Unknown",
    city: travelPoint.city || "",
    area: travelPoint.destination || ""
  };
  const overview = travelPoint.promptIntro || buildPromptIntro(travelPoint.prompt);
  const sensorySentence = formatSnippetLine(travelPoint.promptSnippet, { capitalize: true });
  const sensoryLower = formatSnippetLine(travelPoint.promptSnippet);
  const cityLabel = location.city || location.country || "this destination";
  const areaLabel = location.area || cityLabel;
  const itinerary = [
    {
      day: 1,
      title: "Arrival & first light scouting",
      morning: `Wake early to wander ${cityLabel}'s quiet lanes toward ${areaLabel} while the city stretches awake.`,
      afternoon: `Follow local clues through markets and galleries, letting ${sensoryLower} inspire detours.`,
      evening: `Settle near ${areaLabel} for golden hour and trade notes with people lingering nearby.`
    },
    {
      day: 2,
      title: "Markets, viewpoints & twilight",
      morning: `Join a neighborhood walk or light hike to see how ${cityLabel} lives beyond the postcards.`,
      afternoon: `Reserve time for a cafe break and head for overlooks or waterfronts as shadows lengthen.`,
      evening: `Snack-hop through evening stalls and soak up the soundtrack as ${sensoryLower}.`
    }
  ];
  const highlights = [
    `Sunrise hush around ${areaLabel}`,
    `Slow market loops through ${cityLabel}`,
    `Blue-hour silhouettes over ${location.country}`
  ];
  const food_and_drink = [
    `Grab a street-side breakfast pastry near ${areaLabel} before the rush.`,
    `Order whatever sizzles loudest in ${cityLabel}'s markets for lunch.`,
    `Try a nightcap or tea stand beloved by ${location.country} locals.`
  ];
  const local_culture = [
    `Greet shopkeepers and elders respectfully—small nods go a long way in ${location.country}.`,
    `Dress with modesty near sacred or historic sites around ${areaLabel}.`,
    `Ask before photographing people or intimate scenes in ${cityLabel}.`
  ];
  const practical_tips = [
    `Carry small cash and a reusable bottle; kiosks in ${cityLabel} may be cash-only.`,
    `Pack layers for shifting temps and keep a light rain shell handy.`,
    `Download an offline map so you can roam beyond strong signal zones.`,
    `Share your plan if you head to remote overlooks—rides back can thin out after dark.`
  ];
  const safety_notes = [
    `Stick to well-lit streets after dark near ${areaLabel} and hail trusted rides for longer hops.`,
    `Keep valuables secured in markets or ferry terminals where crowds compress quickly.`
  ];
  return {
    location,
    overview,
    best_time_to_go: inferBestTimeWindow(travelPoint.prompt, cityLabel),
    ideal_for: inferIdealFor(travelPoint.prompt, cityLabel),
    itinerary,
    highlights,
    food_and_drink,
    local_culture,
    practical_tips,
    safety_notes
  };
}

function normalizeStringValue(value, fallback = "") {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return fallback;
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);
}

function withFallbackStringArray(value, fallback) {
  const normalized = normalizeStringArray(value);
  return normalized.length > 0 ? normalized : fallback.slice();
}

function normalizeLocation(location, fallback) {
  if (!location || typeof location !== "object") {
    return { ...fallback };
  }
  return {
    continent: normalizeStringValue(location.continent, fallback.continent),
    country: normalizeStringValue(location.country, fallback.country),
    city: normalizeStringValue(location.city, fallback.city),
    area: normalizeStringValue(location.area, fallback.area)
  };
}

function normalizeItineraryEntry(entry, index, fallbackDay) {
  const base = fallbackDay
    ? { ...fallbackDay }
    : {
        day: index + 1,
        title: `Day ${index + 1}`,
        morning: "",
        afternoon: "",
        evening: ""
      };
  if (!entry || typeof entry !== "object") {
    return base;
  }
  return {
    day: typeof entry.day === "number" && Number.isFinite(entry.day) ? entry.day : base.day,
    title: normalizeStringValue(entry.title, base.title),
    morning: normalizeStringValue(entry.morning, base.morning),
    afternoon: normalizeStringValue(entry.afternoon, base.afternoon),
    evening: normalizeStringValue(entry.evening, base.evening)
  };
}

function normalizeAgentItinerary(entries, fallbackItinerary) {
  if (!Array.isArray(entries)) {
    return fallbackItinerary.map((day) => ({ ...day }));
  }
  const normalized = entries
    .map((entry, index) => normalizeItineraryEntry(entry, index, fallbackItinerary[index]))
    .filter(Boolean);
  return normalized.length > 0 ? normalized : fallbackItinerary.map((day) => ({ ...day }));
}

function normalizeAgentPlan(agentPayload, travelPoint) {
  const fallbackPlan = buildFallbackTravelGuide(travelPoint);
  const plan = {
    location: { ...fallbackPlan.location },
    overview: fallbackPlan.overview,
    best_time_to_go: fallbackPlan.best_time_to_go,
    ideal_for: fallbackPlan.ideal_for,
    itinerary: fallbackPlan.itinerary.map((day) => ({ ...day })),
    highlights: [...fallbackPlan.highlights],
    food_and_drink: [...fallbackPlan.food_and_drink],
    local_culture: [...fallbackPlan.local_culture],
    practical_tips: [...fallbackPlan.practical_tips],
    safety_notes: [...fallbackPlan.safety_notes]
  };
  if (!agentPayload || typeof agentPayload !== "object") {
    return plan;
  }
  plan.location = normalizeLocation(agentPayload.location, fallbackPlan.location);
  plan.overview = normalizeStringValue(agentPayload.overview, plan.overview);
  plan.best_time_to_go = normalizeStringValue(agentPayload.best_time_to_go, plan.best_time_to_go);
  plan.ideal_for = normalizeStringValue(agentPayload.ideal_for, plan.ideal_for);
  plan.itinerary = normalizeAgentItinerary(agentPayload.itinerary, fallbackPlan.itinerary);
  plan.highlights = withFallbackStringArray(agentPayload.highlights, fallbackPlan.highlights);
  plan.food_and_drink = withFallbackStringArray(agentPayload.food_and_drink, fallbackPlan.food_and_drink);
  plan.local_culture = withFallbackStringArray(agentPayload.local_culture, fallbackPlan.local_culture);
  plan.practical_tips = withFallbackStringArray(agentPayload.practical_tips, fallbackPlan.practical_tips);
  plan.safety_notes = withFallbackStringArray(agentPayload.safety_notes, fallbackPlan.safety_notes);
  return plan;
}

function renderItineraryDay(day, index) {
  const segments = [
    { label: "Morning", value: day.morning },
    { label: "Afternoon", value: day.afternoon },
    { label: "Evening", value: day.evening }
  ].filter((segment) => Boolean(segment.value));
  const detailHtml =
    segments.length > 0
      ? segments
          .map(
            (segment) => `
        <div class="plan-day-block">
          <label>${segment.label}</label>
          <p>${segment.value}</p>
        </div>
      `
          )
          .join("\n")
      : `<div class="plan-day-block"><p>Follow your curiosity and jot down the textures you notice.</p></div>`;
  return `
    <div class="plan-card plan-card--day">
      <strong>Day ${String(day.day ?? index + 1).padStart(2, "0")}</strong>
      <span>${day.title || `Day ${index + 1}`}</span>
      <div class="plan-day-detail">
        ${detailHtml}
      </div>
    </div>
  `;
}

function renderListSection(title, items, placeholder) {
  if (!items || items.length === 0) {
    return `
      <section class="detail-section">
        <h3>${title}</h3>
        <p class="atlas-detail-placeholder">${placeholder}</p>
      </section>
    `;
  }
  return `
    <section class="detail-section">
      <h3>${title}</h3>
      <ul>${items.map((item) => `<li>${item}</li>`).join("\n")}</ul>
    </section>
  `;
}

function buildLocalVibeCopy(plan, point) {
  const highlight = Array.isArray(plan.highlights) && plan.highlights.length > 0 ? plan.highlights[0] : "";
  const cultureNotes = Array.isArray(plan.local_culture) ? plan.local_culture.slice(0, 2) : [];
  const pieces = [highlight, ...cultureNotes]
    .map((entry) => (entry || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((entry) => entry.replace(/\.$/, ""));
  if (pieces.length === 0) {
    const fallback =
      point.promptIntro ||
      buildPromptIntro(point.prompt) ||
      formatSnippetLine(point.promptSnippet, { capitalize: true }) ||
      "We’re sketching the vibe for you…";
    return fallback;
  }
  const combined = pieces.join(". ");
  const normalized = combined.charAt(0).toUpperCase() + combined.slice(1);
  return normalized.endsWith(".") ? normalized : `${normalized}.`;
}

function formatChipText(text, fallback = "Syncing vibe…") {
  const cleaned = cleanPromptString(text || "");
  const content = cleaned || fallback;
  if (content.length > 40) {
    return `${content.slice(0, 37)}…`;
  }
  return content;
}

function renderVisualOverviewSkeleton(vibe, point) {
  const vibeLabel = `${humanizeVibeTheme(vibe)} vibe`;
  const cityLabel = point.city || point.destination || point.country || "Postcard inbound";
  return `
    <section class="visual-overview" aria-live="polite">
      <div class="visual-overview__label">Visual overview</div>
      <div class="visual-overview-card">
        <div class="visual-overview-chips">
          <span class="vibe-chip">${vibeLabel}</span>
          <span class="vibe-chip">${formatChipText(cityLabel, "Sketching postcard…")}</span>
        </div>
        <div class="visual-overview-text">
          <p class="visual-overview-title">What it feels like to be here</p>
          <p>We’re sketching the vibe for you…</p>
        </div>
      </div>
    </section>
  `;
}

function renderPlanMarkup(plan, point, options = {}) {
  const vibe = options.vibe || currentVibeTheme || DEFAULT_VIBE_THEME;
  const vibeChip = `${humanizeVibeTheme(vibe)} vibe`;
  const localVibeCopy = buildLocalVibeCopy(plan, point);
  const windowLine = plan.best_time_to_go
    ? plan.best_time_to_go.split(/[.!]/).find(Boolean) || plan.best_time_to_go
    : `${point.city || point.destination || "Anywhere"} window`;
  const areaChip = plan.location.area || point.destination || plan.location.city || point.city;
  const chipSecondary = formatChipText(windowLine, "Window syncing…");
  const chipTertiary = formatChipText(areaChip || point.country, "Field sensing…");
  const visualSection = `
    <section class="visual-overview">
      <div class="visual-overview__label">Visual overview</div>
      <div class="visual-overview-card">
        <div class="visual-overview-chips">
          <span class="vibe-chip">${vibeChip}</span>
          <span class="vibe-chip">${chipSecondary}</span>
          <span class="vibe-chip">${chipTertiary}</span>
        </div>
        <div class="visual-overview-text">
          <p class="visual-overview-title">What it feels like to be here</p>
          <p>${localVibeCopy}</p>
        </div>
      </div>
    </section>
  `;
  const overview = plan.overview || point.promptIntro || buildPromptIntro(point.prompt);
  const sensoryLine = formatSnippetLine(point.promptSnippet, { capitalize: true });
  const locationLine = [plan.location.city || point.city, plan.location.country || point.country].filter(Boolean).join(", ");
  const areaLine = plan.location.area || point.destination;
  const metaCards = [];
  if (locationLine || areaLine) {
    metaCards.push({
      label: "Where you’ll land",
      value: locationLine && areaLine && !locationLine.includes(areaLine) ? `${locationLine} · ${areaLine}` : locationLine || areaLine
    });
  }
  if (plan.best_time_to_go) {
    metaCards.push({ label: "Best time to go", value: plan.best_time_to_go });
  }
  if (plan.ideal_for) {
    metaCards.push({ label: "Who this trip is for", value: plan.ideal_for });
  }
  const metaHtml =
    metaCards.length > 0
      ? `<div class="detail-meta-grid">
      ${metaCards
        .map(
          (card) => `
        <div class="detail-meta-card">
          <span>${card.label}</span>
          <p>${card.value}</p>
        </div>
      `
        )
        .join("\n")}
    </div>`
      : "";
  const itinerarySection = plan.itinerary.length
    ? `<div class="plan-grid">
        ${plan.itinerary.map((day, index) => renderItineraryDay(day, index)).join("\n")}
      </div>`
    : `<p class="atlas-detail-placeholder">Itinerary syncing…</p>`;

  return `
    ${visualSection}
    <section class="detail-section">
      <h3>Why this trip feels special</h3>
      <p>${overview}</p>
      ${metaHtml}
      ${sensoryLine ? `<p class="detail-section-note">${sensoryLine}</p>` : ""}
    </section>
    <section class="detail-section">
      <h3>Suggested rhythm for your days</h3>
      ${itinerarySection}
    </section>
    ${renderListSection("Don’t-miss moments", plan.highlights, "Highlights will appear once the agent check-ins finish.")}
    ${renderListSection("What to eat & drink", plan.food_and_drink, "Food intel warming up…")}
    ${renderListSection("Local culture & etiquette", plan.local_culture, "Culture notes en route…")}
    ${renderListSection("Practical tips", plan.practical_tips, "Practical tips syncing…")}
    ${renderListSection("Safety & common sense", plan.safety_notes, "Safety notes will post when the agent has them.")}
  `;
}

async function requestTravelPlan(point, vibe) {
  const requestId = ++activeGuideRequestId;
  try {
    const plan = await fetchTravelPlan(point);
    if (requestId !== activeGuideRequestId) {
      return;
    }
    if (detailBodyEl) {
      detailBodyEl.innerHTML = renderPlanMarkup(plan, point, { vibe });
    }
  } catch (error) {
    if (requestId !== activeGuideRequestId) {
      return;
    }
    if (detailBodyEl) {
      const message = error && error.message ? error.message : "";
      detailBodyEl.innerHTML = `<p class="atlas-error">Unable to synthesize plan. ${message}</p>`;
    }
  }
}

async function fetchTravelPlan(travelPoint) {
  if (travelPlanCache.has(travelPoint.id)) {
    return travelPlanCache.get(travelPoint.id);
  }
  let plan;
  try {
    const agentResponse = await requestAgentTravelPlan(travelPoint);
    plan = normalizeAgentPlan(agentResponse, travelPoint);
  } catch (error) {
    console.warn("Falling back to static travel plan", error);
    plan = buildFallbackTravelGuide(travelPoint);
  }
  travelPlanCache.set(travelPoint.id, plan);
  return plan;
}

async function requestAgentTravelPlan(travelPoint) {
  const payload = {
    prompt: buildTravelAgentPrompt(travelPoint),
    location: {
      continent: travelPoint.continent,
      country: travelPoint.country,
      city: travelPoint.city,
      area: travelPoint.destination
    },
    metadata: {
      travelPointId: travelPoint.id
    }
  };
  const response = await fetch("/api/agent/generateTravelPlan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const responseText = await response.text();
  let data = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      if (response.ok) {
        throw new Error("Invalid travel plan response");
      }
    }
  }
  if (!response.ok) {
    const message = data && typeof data.message === "string" ? data.message : "Failed to fetch travel plan";
    throw new Error(message);
  }
  if (!data) {
    throw new Error("Travel plan response missing");
  }
  return data;
}

function openTravelPlan(travelPoint) {
  console.log("Open travel plan for:", travelPoint);
  const targetHash = `#/point/${travelPoint.id}`;
  if (window.location.hash === targetHash) {
    renderRoute();
    return;
  }
  window.location.hash = targetHash;
}

if (backHomeBtn) {
  backHomeBtn.addEventListener("click", () => {
    window.location.hash = "#/";
  });
}

if (mapPlane) {
  mapPlane.addEventListener("pointermove", handlePointerMove);
  mapPlane.addEventListener("mouseleave", () => {
    hideTooltip();
    restoreDebugStatus();
  });
}

window.addEventListener("hashchange", renderRoute);

applyVibeTheme(currentVibeTheme);
initAtlas().catch((error) => {
  console.error("Failed to initialize atlas cockpit", error);
  setDebugStatus("The map can't load its stories right now.");
});
