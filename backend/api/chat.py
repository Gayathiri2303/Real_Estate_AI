from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

# We will load properties later from main
PROPERTIES = []

def set_properties(props):
    global PROPERTIES
    PROPERTIES = props

@router.post("/chat")
def chat(data: ChatRequest):
    msg = data.message.lower().strip()

    # === Greetings ===
    if any(word in msg for word in ["hi", "hello", "hey", "good morning", "good evening"]):
        return {
            "reply": "Hello! 👋 I'm your Real Estate AI assistant. I can help you find properties, estimate prices, check market trends, and more. What would you like to know?"
        }

    if any(word in msg for word in ["how are you", "how's it going", "how r u"]):
        return {
            "reply": "I'm doing great, thank you! Ready to help you find your dream property. 🏠 What are you looking for today?"
        }

    if any(word in msg for word in ["thank", "thanks", "thank you"]):
        return {
            "reply": "You're welcome! Feel free to ask me anything else about real estate. 😊"
        }

    # === Total properties ===
    if any(word in msg for word in ["how many properties", "total properties", "number of properties"]):
        return {
            "reply": f"We currently have **{len(PROPERTIES)} properties** available in our database."
        }

    # === Average price ===
    if any(word in msg for word in ["average price", "avg price", "mean price"]):
        if not PROPERTIES:
            return {"reply": "Sorry, no property data available right now."}
        avg = int(sum(p["price"] for p in PROPERTIES) / len(PROPERTIES))
        return {
            "reply": f"The average property price in our database is **${avg:,}**."
        }

    # === Search by city ===
    cities = ["new york", "los angeles", "chicago", "houston", "miami", "seattle", 
              "boston", "denver", "atlanta", "phoenix", "san diego", "dallas",
              "orlando", "portland", "austin", "san francisco", "nashville"]
    
    for city in cities:
        if city in msg:
            matched = [p for p in PROPERTIES if city in p["city"].lower()]
            if matched:
                sample = matched[:3]
                reply = f"I found **{len(matched)} properties** in {city.title()}.\n\nHere are a few:\n"
                for p in sample:
                    reply += f"• {p['address']} – ${p['price']:,} ({p['bedrooms']} bed, {p['bathrooms']} bath)\n"
                reply += "\nWould you like more details or filter by price/bedrooms?"
                return {"reply": reply}
            else:
                return {"reply": f"Sorry, I couldn't find any properties in {city.title()} right now."}

    # === Search by bedrooms ===
    for beds in [1, 2, 3, 4, 5]:
        if f"{beds} bedroom" in msg or f"{beds} bed" in msg or f"{beds}bhk" in msg:
            matched = [p for p in PROPERTIES if p["bedrooms"] == beds]
            if matched:
                avg_price = int(sum(p["price"] for p in matched) / len(matched))
                return {
                    "reply": f"I found **{len(matched)} properties** with {beds} bedrooms.\nAverage price: **${avg_price:,}**.\nWould you like me to show some examples?"
                }

    # === Price range ===
    if "under" in msg or "below" in msg or "less than" in msg:
        for price in [300000, 400000, 500000, 600000, 700000, 800000, 1000000]:
            if str(price) in msg or f"{price//1000}k" in msg:
                matched = [p for p in PROPERTIES if p["price"] < price]
                return {
                    "reply": f"I found **{len(matched)} properties** under ${price:,}."
                }

    # === Predict / Estimate ===
    if any(word in msg for word in ["predict", "estimate", "how much", "price of", "worth"]):
        return {
            "reply": "I can help estimate a property price! Please tell me:\n• Number of bedrooms\n• Number of bathrooms\n• Square footage (approx)\n• Year built (optional)\n• Condition (Excellent / Good / Fair)\n\nOr go to the **Predict** page for a full AI prediction."
        }

    # === Market / Trends ===
    if any(word in msg for word in ["market", "trend", "hot cities", "best cities"]):
        if not PROPERTIES:
            return {"reply": "No data available."}
        
        # Simple top cities by count
        from collections import Counter
        city_counts = Counter(p["city"] for p in PROPERTIES)
        top = city_counts.most_common(5)
        
        reply = "Here are the top cities in our database right now:\n\n"
        for city, count in top:
            reply += f"• {city}: {count} properties\n"
        return {"reply": reply}

    # === Default helpful reply ===
    return {
        "reply": "I can help you with:\n\n"
                 "• Search properties by city (e.g. \"Show me homes in Miami\")\n"
                 "• Filter by bedrooms (e.g. \"3 bedroom houses\")\n"
                 "• Check average prices\n"
                 "• Get price estimates\n"
                 "• Market trends\n\n"
                 "Just ask me anything related to real estate!"
    }
