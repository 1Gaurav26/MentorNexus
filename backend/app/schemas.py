from pydantic import BaseModel
from typing import Dict, List, Optional

class StudentInput(BaseModel):
    student_id: str
    research_interest: Optional[str] = None
    skills: List[str]                 
    methodologies: List[str]
    academic_level: str
    availability: int
    goal: str

class FacultyInput(BaseModel):
    faculty_id: str
    research_areas: str
    required_skills: List[str]        
    methodologies: List[str]
    publications: str                 
    urgency: str
    max_students: int

class FacultyUpsert(BaseModel):
    faculty_id: str
    name: str
    email: str
    research_areas: str
    required_skills: List[str]        
    methodologies: List[str]
    publications: str
    projects: List["FacultyProject"] = []   
    urgency: str
    max_students: int
    current_students: int
    academic_level: str
    availability: int
    is_visible: bool = True


class StudentUpsert(BaseModel):
    student_id: str
    skills: List[str]                 
    methodologies: List[str]
    academic_level: str
    availability: int
    interests: str

from typing import Literal

class FacultyProject(BaseModel):
    project_id: str
    title: str
    description: str
    required_skills: List[str]
    methodologies: List[str]
    max_students: int
    current_students: int
    status: Literal["open", "full"]
    is_visible: bool
    last_updated: str

class MentorshipRequest(BaseModel):
    request_id: Optional[str] = None
    student_id: str
    student_name: str
    faculty_id: str
    faculty_name: str
    message: str
    status: Literal["pending", "accepted", "declined"] = "pending"
    created_at: Optional[str] = None

class MentorshipStatusUpdate(BaseModel):
    request_id: str
    status: Literal["pending", "accepted", "declined"]
    note: Optional[str] = None
