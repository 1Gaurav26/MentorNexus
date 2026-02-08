from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

# --- Models ---
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str # 'student' or 'faculty'
    name: str

class User(BaseModel):
    id: str
    username: str
    name: str
    role: str
    token: str

# --- Mock Data ---
DEMO_USERS = {
    "student": {"password": "student123", "role": "student", "name": "Demo Student", "id": "s-demo"},
    "faculty": {"password": "faculty123", "role": "faculty", "name": "Dr. Demo Faculty", "id": "VIT141"},
    "demo.faculty@vit.ac.in": {"password": "faculty123", "role": "faculty", "name": "Dr. Demo Faculty", "id": "VIT141"}
}

# --- Endpoints ---
@router.post("/auth/login", response_model=User)
async def login(creds: LoginRequest):
    user_data = DEMO_USERS.get(creds.username)
    
    if not user_data or user_data["password"] != creds.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate a simple mock token
    token = f"mock-token-{uuid.uuid4()}"
    
    return {
        "id": user_data["id"],
        "username": creds.username,
        "name": user_data["name"],
        "role": user_data["role"],
        "token": token
    }

@router.post("/auth/register", response_model=User)
async def register(creds: RegisterRequest):
    if creds.username in DEMO_USERS:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # In a real app, we'd save to DB. Here we just mock success.
    new_id = f"{creds.role[0]}-{uuid.uuid4()}"
    token = f"mock-token-{uuid.uuid4()}"
    
    return {
        "id": new_id,
        "username": creds.username,
        "name": creds.name,
        "role": creds.role,
        "token": token
    }

@router.get("/auth/me")
async def get_current_user(token: str):
    # Mock validation
    if not token.startswith("mock-token-"):
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Return a generic user based on some logic or just the demo one
    # For MVP, let's just return the student demo if it looks like a token
    return {
        "id": "s-demo",
        "username": "student",
        "name": "Demo Student", 
        "role": "student"
    }
