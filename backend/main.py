from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
import os
import random

# Import the routers we just created
from backend.api import login, property_images, vision, upload

app = FastAPI(
    title="Real Estate AI API",
    description="Backend with 500 properties + AI features",
    version="2.0.0"
)

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(login.router, prefix="/api")
app.include_router(property_images.router, prefix="/api")
app.include_router(vision.router, prefix="/api")
app.include_router(upload.router, prefix="/api")

# ====================== LOAD 500 PROPERTIES ======================
PROPERTIES = []

def load_properties():
    global PROPERTIES
    csv_path = os.path.join(os.path.dirname(__file__), "properties_500.csv")
    
    if not os.path.exists(csv_path):
        print("⚠️ CSV file not found")
        PROPERTIES = []
        return

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                PROPERTIES.append({
                    "id": int(row["id"]),
                    "address": row["address"],
                    "city": row["city"],
                    "state": row["state"],
                    "price": int(float(row["price"])),
                    "bedrooms": int(row["bedrooms"]),
                    "bathrooms": float(row["bathrooms"]),
                    "sqft": int(row["sqft"]),
                    "year_built": int(row["year_built"]),
                    "lat": float(row["lat"]),
                    "lng": float(row["lng"]),
                    "description": row["description"],
                    "condition": row["condition"]
                })
            except Exception as e:
                print(f"Error loading row: {e}")
                continue

    print(f"✅ Loaded {len(PROPERTIES)} properties successfully!")

# Load data when the app starts
load_properties()

# ====================== MAIN ENDPOINTS ======================

@app.get("/")
def root():
    return {
        "message": "Real Estate AI API is running!",
        "total_properties": len(PROPERTIES),
        "status": "healthy",
        "version": "2.0.0"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "total_properties": len(PROPERTIES)
    }

@app.get("/api/properties")
def get_properties():
    return {"properties": PROPERTIES}

@app.get("/api/properties/{property_id}")
def get_property(property_id: int):
    for prop in PROPERTIES:
        if prop["id"] == property_id:
            return prop
    raise HTTPException(status_code=404, detail="Property not found")

@app.get("/api/market/stats")
def market_stats():
    if not PROPERTIES:
        return {"total_properties": 0, "average_price": 0}
    
    prices = [p["price"] for p in PROPERTIES]
    return {
        "total_properties": len(PROPERTIES),
        "average_price": int(sum(prices) / len(prices)),
        "min_price": min(prices),
        "max_price": max(prices)
    }

@app.get("/api/predict")
def predict(
    bedrooms: int = Query(3),
    bathrooms: float = Query(2),
    sqft: int = Query(1800),
    year_built: int = Query(2010),
    condition: str = Query("Good")
):
    base = 200000
    price = base + (bedrooms * 45000) + (bathrooms * 25000) + (sqft * 180)
    
    age = 2025 - year_built
    price -= age * 1500
    
    if condition.lower() == "excellent":
        price *= 1.15
    elif condition.lower() == "good":
        price *= 1.05
    elif condition.lower() == "fair":
        price *= 0.95
    else:
        price *= 0.85

    price = int(price * random.uniform(0.97, 1.03))

    return {
        "predicted_price": price,
        "currency": "USD",
        "confidence": "medium",
        "message": "Prediction successful"
    }
