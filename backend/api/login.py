from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "email": data.email,
            "name": data.email.split("@")[0]
        },
        "token": "demo-token-12345"
    }

@router.post("/register")
def register(data: RegisterRequest):
    return {
        "success": True,
        "message": "Registration successful",
        "user": {
            "name": data.name,
            "email": data.email
        }
    }

@router.get("/users")
def get_users():
    return {
        "users": [
            {"id": 1, "name": "Demo User", "email": "demo@example.com"}
        ]
    }
