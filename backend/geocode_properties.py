import pandas as pd
import requests
import time
import csv
import random

# State coordinate centers (fallback if geocoding fails)
STATE_COORDS = {
    'California': {'lat': 36.7783, 'lng': -119.4179},
    'Texas': {'lat': 31.9686, 'lng': -99.9018},
    'New York': {'lat': 40.7128, 'lng': -74.0060},
    'Florida': {'lat': 27.6648, 'lng': -81.5158},
    'Washington': {'lat': 47.7511, 'lng': -120.7401},
    'Oregon': {'lat': 44.5726, 'lng': -122.0624},
    # Add more states as needed
}

def geocode_address(address, city, state):
    """Convert address to latitude/longitude using OpenStreetMap"""
    query = f"{address}, {city}, {state}, USA"
    url = "https://nominatim.openstreetmap.org/search"
    
    params = {
        'q': query,
        'format': 'json',
        'limit': 1
    }
    
    try:
        response = requests.get(url, params=params, headers={'User-Agent': 'RealEstateApp'})
        if response.status_code == 200:
            data = response.json()
            if data:
                return float(data[0]['lat']), float(data[0]['lon'])
    except Exception as e:
        print(f"Geocoding error for {query}: {e}")
    
    return None, None

def add_coordinates_to_properties():
    """Add lat/lng to all properties"""
    
    # Read existing properties
    df = pd.read_csv("datasets/real_properties.csv")
    properties = df.to_dict(orient='records')
    
    print(f"📊 Found {len(properties)} properties")
    
    updated = 0
    for i, prop in enumerate(properties):
        # Skip if already has valid coordinates
        if prop.get('lat', 0) != 0 and prop.get('lng', 0) != 0:
            continue
        
        # Try to geocode
        lat, lng = geocode_address(
            prop.get('address', ''),
            prop.get('city', ''),
            prop.get('state', '')
        )
        
        if lat and lng:
            prop['lat'] = lat
            prop['lng'] = lng
            updated += 1
            print(f"✅ Geocoded: {prop['address']}, {prop['city']} ({lat}, {lng})")
        else:
            # Use state center as fallback with random variation
            state = prop.get('state', '')
            coords = STATE_COORDS.get(state, {'lat': 39.8283, 'lng': -98.5795})
            lat = coords['lat'] + random.uniform(-2, 2)
            lng = coords['lng'] + random.uniform(-2, 2)
            prop['lat'] = round(lat, 6)
            prop['lng'] = round(lng, 6)
            print(f"⚠️ Using fallback for: {prop['address']}, {prop['city']}")
        
        # Rate limit to avoid being blocked
        if i % 10 == 0:
            time.sleep(1)
    
    print(f"✅ Updated {updated} properties with coordinates")
    
    # Save back to CSV
    with open("datasets/real_properties.csv", 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=properties[0].keys())
        writer.writeheader()
        writer.writerows(properties)
    
    print("✅ Saved to datasets/real_properties.csv")

if __name__ == "__main__":
    add_coordinates_to_properties()