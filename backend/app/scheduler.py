
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import uuid
from datetime import datetime

router = APIRouter()

# In-memory store for demonstration (replace with DB for production)
# Structure: { faculty_id: [ { slot_id, time, student_id, status } ] }
bookings_db: Dict[str, List[dict]] = {}

class BookingRequest(BaseModel):
    faculty_id: str
    student_id: str
    date_time: str # ISO format string

class BookingResponse(BaseModel):
    booking_id: str
    status: str
    message: str

@router.get("/slots/{faculty_id}")
def get_slots(faculty_id: str):
    """
    Get booked slots for a faculty to avoid double booking.
    In a real app, this would return *available* slots based on a calendar.
    For this MVP, we just return what's already taken.
    """
    return bookings_db.get(faculty_id, [])

@router.post("/book", response_model=BookingResponse)
def book_slot(request: BookingRequest):
    # Check if slot is already taken (simple check)
    faculty_bookings = bookings_db.get(request.faculty_id, [])
    
    for booking in faculty_bookings:
        if booking["date_time"] == request.date_time:
            raise HTTPException(status_code=400, detail="Slot already booked")

    # Create new booking
    new_booking = {
        "booking_id": str(uuid.uuid4()),
        "student_id": request.student_id,
        "date_time": request.date_time,
        "status": "confirmed",
        "created_at": datetime.utcnow().isoformat()
    }

    if request.faculty_id not in bookings_db:
        bookings_db[request.faculty_id] = []
    
    bookings_db[request.faculty_id].append(new_booking)

    return {
        "booking_id": new_booking["booking_id"],
        "status": "confirmed",
        "message": "Meeting scheduled successfully"
    }
