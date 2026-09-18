from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import random

router = APIRouter()

class VisionResponse(BaseModel):
    condition: str
    estimated_score: int
    features: list
    message: str

@router.post("/vision")
async def analyze_image(file: UploadFile = File(...)):
    # Simple demo vision analysis (no real AI model for now)
    conditions = ["Excellent", "Good", "Fair", "Needs Repair"]
    features_list = [
        ["Modern kitchen", "Hardwood floors", "Large windows"],
        ["Updated bathroom", "Spacious living room", "Nice backyard"],
        ["Good natural light", "Clean interior", "Well maintained"],
        ["Needs painting", "Older appliances", "Basic condition"]
    ]

    condition = random.choice(conditions)
    features = random.choice(features_list)
    score = random.randint(65, 95)

    return {
        "condition": condition,
        "estimated_score": score,
        "features": features,
        "message": "Image analyzed successfully (demo mode)"
    }

@router.get("/vision/test")
def vision_test():
    return {
        "status": "ready",
        "message": "Vision endpoint is working"
    }
