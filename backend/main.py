from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

# ============ IMPORT ROUTERS ============
from backend.api import login, property_images, vision, upload

# ============ CREATE APP ============
app = FastAPI(
    title="🏠 USA Real Estate AI API",
    description="AI-powered property valuation and market analytics",
    version="2.0.0"
)

# ============ CORS CONFIGURATION ============
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://realestate.gayathiriportfolio.xyz",
        "http://realestate.gayathiriportfolio.xyz",
        "https://gayathiriportfolio.xyz",
        "http://localhost:3000",
        "http://localhost:3001",
        "*"  # For testing - remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ REGISTER ROUTERS ============
app.include_router(login.router, prefix="/api")
app.include_router(property_images.router, prefix="/api")
app.include_router(vision.router, prefix="/api")
app.include_router(upload.router, prefix="/api")

print("✅ All routers registered successfully!")

# ============ SAMPLE PROPERTIES ============
PROPERTIES = [
    {
        "id": 1,
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "price": 750000,
        "bedrooms": 3,
        "bathrooms": 2,
        "sqft": 1800,
        "year_built": 2010,
        "lat": 40.7128,
        "lng": -74.0060,
        "description": "Beautiful property in the heart of the city",
        "floors": 2,
        "sqft_lot": 2500,
        "condition": "Excellent"
    },
    {
        "id": 2,
        "address": "456 Oak Avenue",
        "city": "Los Angeles",
        "state": "CA",
        "price": 850000,
        "bedrooms": 4,
        "bathrooms": 3,
        "sqft": 2200,
        "year_built": 2015,
        "lat": 34.0522,
        "lng": -118.2437,
        "description": "Spacious home with modern amenities",
        "floors": 2,
        "sqft_lot": 3000,
        "condition": "Excellent"
    },
    {
        "id": 3,
        "address": "789 Pine Street",
        "city": "New York",
        "state": "NY",
        "price": 650000,
        "bedrooms": 3,
        "bathrooms": 2,
        "sqft": 1600,
        "year_built": 2008,
        "lat": 40.7580,
        "lng": -73.9855,
        "description": "Cozy apartment in a great neighborhood",
        "floors": 1,
        "sqft_lot": 1800,
        "condition": "Good"
    },
    {
        "id": 4,
        "address": "321 Elm Street",
        "city": "Chicago",
        "state": "IL",
        "price": 550000,
        "bedrooms": 3,
        "bathrooms": 2,
        "sqft": 1500,
        "year_built": 2005,
        "lat": 41.8781,
        "lng": -87.6298,
        "description": "Charming home in a quiet neighborhood",
        "floors": 1,
        "sqft_lot": 2000,
        "condition": "Good"
    },
    {
        "id": 5,
        "address": "654 Maple Drive",
        "city": "Los Angeles",
        "state": "CA",
        "price": 950000,
        "bedrooms": 4,
        "bathrooms": 3,
        "sqft": 2500,
        "year_built": 2018,
        "lat": 34.0522,
        "lng": -118.2437,
        "description": "Luxury home with stunning views",
        "floors": 2,
        "sqft_lot": 3500,
        "condition": "Excellent"
    }
]

# ============ ENDPOINTS ============

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "🏠 USA Real Estate AI API is running!",
        "endpoints": {
            "properties": "/properties",
            "property_images": "/api/property-images/{id}",
            "login": "/api/login",
            "test": "/api/test",
            "health": "/api/health"
        }
    }

@app.get("/properties")
async def get_properties():
    """Get all properties"""
    return {"properties": PROPERTIES}

@app.get("/properties/{property_id}")
async def get_property(property_id: int):
    """Get a single property by ID"""
    for prop in PROPERTIES:
        if prop["id"] == property_id:
            return prop
    raise HTTPException(status_code=404, detail="Property not found")

@app.get("/api/test")
def test():
    """Test endpoint to check if API is working"""
    return {
        "status": "success",
        "message": "API is working!",
        "registered_routers": ["login", "property_images", "vision", "upload"]
    }

@app.get("/api/health")
def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "FastAPI",
        "version": "2.0.0"
    }

# ============ IMAGE SERVING ============
@app.get("/uploads/{path:path}")
async def serve_uploads(path: str):
    """Serve uploaded images"""
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(BASE_DIR, "uploads", path)
    
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

print("✅ FastAPI application loaded successfully!")
print("📁 Available endpoints:")
print("   - /")
print("   - /properties")
print("   - /properties/{id}")
print("   - /api/login")
print("   - /api/test")
print("   - /api/health")
print("   - /uploads/{path}")