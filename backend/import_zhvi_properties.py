import pandas as pd
import csv
import random
import re

def convert_zhvi_to_properties():
    """Convert ZHVI time series data to property listings"""
    
    print("📂 Reading ZHVI.csv...")
    df = pd.read_csv("datasets/ZHVI.csv")
    
    print(f"✅ Loaded {len(df)} rows with {len(df.columns)} columns")
    
    # Identify the first column (usually date or region name)
    first_col = df.columns[0]
    print(f"📋 First column is: '{first_col}'")
    
    # The other columns should be states
    state_cols = [col for col in df.columns if col != first_col]
    print(f"📋 Found {len(state_cols)} state columns")
    
    properties = []
    property_id = 1
    
    # For each row (usually a date)
    for idx, row in df.iterrows():
        # Skip if first column is a date (like '2000-01-01')
        first_value = row[first_col]
        
        # Check if this is a date
        if isinstance(first_value, str) and re.match(r'\d{4}-\d{2}-\d{2}', first_value):
            date_val = first_value
        else:
            date_val = f"Period_{idx}"
        
        # For each state, get the price
        for state in state_cols:
            price_val = row.get(state, 0)
            
            # Skip if price is missing or not a number
            if price_val == 0 or pd.isna(price_val):
                continue
            
            # Try to convert to float
            try:
                price = float(price_val)
            except (ValueError, TypeError):
                continue
            
            # Skip if price is too low or too high (outliers)
            if price < 10000 or price > 5000000:
                continue
            
            # Generate realistic property features
            bedrooms = random.randint(2, 5)
            bathrooms = random.choice([1, 1.5, 2, 2.5, 3, 3.5])
            sqft = random.randint(800, 4000)
            
            # Price based on ZHVI value with some variation
            final_price = int(price * random.uniform(0.85, 1.15))
            final_price = round(final_price / 1000) * 1000
            
            # Generate a realistic address
            streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 
                       'Cedar Ln', 'Birch Blvd', 'Sunset Dr', 'Park Ave', 'Lake Shore',
                       'Mountain View', 'Ocean Drive', 'Forest Lane', 'Meadow Ln']
            
            cities = {
                'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
                'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
                'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
                'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
                'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Olympia'],
                'Oregon': ['Portland', 'Salem', 'Eugene', 'Medford'],
                'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge'],
                'Illinois': ['Chicago', 'Naperville', 'Springfield', 'Peoria'],
                'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie'],
                'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo'],
                'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights'],
                'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah'],
                'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham'],
                'Virginia': ['Virginia Beach', 'Norfolk', 'Richmond', 'Arlington'],
                'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins'],
                'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler'],
                'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'],
                'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
                'Maryland': ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring'],
                'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha'],
                'Minnesota': ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth'],
                'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'],
                'Utah': ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan'],
                'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas'],
                'Connecticut': ['Bridgeport', 'New Haven', 'Stamford', 'Hartford']
            }
            
            # Get city list for this state
            city_list = cities.get(state, [f"{state} City"])
            city = random.choice(city_list) if city_list else f"{state} City"
            
            property_data = {
                "id": property_id,
                "address": f"{random.randint(100, 9999)} {random.choice(streets)}",
                "city": city,
                "state": state,
                "price": final_price,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "sqft": sqft,
                "sqft_lot": random.randint(2000, 10000),
                "floors": random.choice([1, 1.5, 2]),
                "view": random.randint(0, 4),
                "condition": random.randint(1, 5),
                "grade": random.randint(1, 10),
                "sqft_above": sqft - random.randint(0, 500),
                "sqft_basement": random.randint(0, 800),
                "year_built": random.randint(1950, 2024),
                "yr_renovated": random.randint(1950, 2024) if random.random() > 0.5 else 0,
                "lat": 0,
                "lng": 0
            }
            
            properties.append(property_data)
            property_id += 1
            
            # Limit to a manageable number
            if property_id > 500:
                break
        
        if property_id > 500:
            break
    
    print(f"✅ Generated {len(properties)} properties")
    
    # Save to CSV
    output_file = "datasets/real_properties.csv"
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=properties[0].keys())
        writer.writeheader()
        writer.writerows(properties)
    
    print(f"✅ Saved to {output_file}")
    
    # Show price statistics
    if properties:
        prices = [p['price'] for p in properties]
        print(f"\n📊 Price Statistics:")
        print(f"   Min: ${min(prices):,.2f}")
        print(f"   Max: ${max(prices):,.2f}")
        print(f"   Avg: ${sum(prices)/len(prices):,.2f}")
        print(f"   Total: {len(properties)} properties")
        
        # Show state distribution
        states_count = {}
        for p in properties:
            state = p['state']
            states_count[state] = states_count.get(state, 0) + 1
        
        print("\n📊 Top States:")
        for state, count in sorted(states_count.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   {state}: {count} properties")

if __name__ == "__main__":
    convert_zhvi_to_properties()