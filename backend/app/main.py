from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.app.schemas import StudentInput, FacultyUpsert
from backend.app.normalize import normalize_student
from backend.app.schemas import StudentInput, FacultyUpsert
from backend.app.normalize import normalize_student
from backend.app.dataloader import load_faculty_dataset
import pandas as pd
import json
from backend.app.nlp import ResearchSimilarityEngine
from backend.app.faculty_service import upsert_faculty, list_faculty
from backend.app.ranking import compute_final_score
from backend.app.schemas import StudentUpsert
from backend.app.student_service import upsert_student
from backend.app.search import search_faculty
from backend.app.blockchain_service import commit_match
from backend.app.resume_parser import parse_resume_with_ai
from backend.app.chat import manager as chat_manager
from fastapi import UploadFile, File, WebSocket, WebSocketDisconnect
from backend.app import scheduler, auth
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- Routers ---
app.include_router(scheduler.router)
app.include_router(auth.router)

FACULTY_DATA_PATH = "backend/data/faculty_dataset.csv"

faculty_records, faculty_texts = load_faculty_dataset(FACULTY_DATA_PATH)

nlp_engine = ResearchSimilarityEngine()
if faculty_texts:
    nlp_engine.fit(faculty_texts)


@app.get("/")
def root():
    return {"status": "MentorNexus backend running"}


# ---------- FACULTY MANAGEMENT ----------
@app.post("/faculty/upsert")
def add_or_update_faculty(faculty: FacultyUpsert):
    upsert_faculty(faculty.dict())
    return {"status": "faculty added/updated"}


@app.get("/faculty")
def get_all_faculty():
    return list_faculty()


# ---------- RESEARCH MATCH ----------
@app.post("/match/research")
def research_match(student: StudentInput):
    student_n = normalize_student(student.dict())

    if not student_n.get("research_interest"):
        raise HTTPException(status_code=400, detail="Research interest required")

    scores = nlp_engine.compute(student_n["research_interest"])

    ranked = sorted(
        zip(faculty_records, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        {
            "faculty_id": f["faculty_id"],
            "name": f["name"],
            "research_similarity": round(score, 4)
        }
        for f, score in ranked
    ]

@app.post("/match/full")
def full_match(student: StudentInput):
    student_n = normalize_student(student.dict())

    if not faculty_records:
        raise HTTPException(status_code=500, detail="Faculty dataset unavailable")

    research_scores = (
        nlp_engine.compute(student_n["research_interest"])
        if student_n.get("research_interest")
        else [0.0] * len(faculty_records)
    )

    results = []

    for faculty, research_score in zip(faculty_records, research_scores):

        if not faculty.get("is_visible", True):
            continue

        for project in faculty.get("projects", []):

            # 🚫 Project capacity check
            # if project["status"] == "full":
            #     continue
            
            # Allow full projects but mark them clearly in UI
            is_full = project["status"] == "full" or project.get("current_students", 0) >= project.get("max_students", 100)
            
            # If full, we still compute score but might penalty or just show it.
            # For now, let's just proceed. The UI will handle the "Connect" button state.
            if is_full:
                 project["status"] = "full"

            final_score, mode, explanation = compute_final_score(
                student_n,
                faculty,
                project,
                research_score
            )

            match_id = commit_match(
                student_id=student_n["student_id"],
                faculty_id=faculty["faculty_id"],
                project_id=project["project_id"],
                final_score=final_score,
                match_mode=mode,
                explanation=explanation
            )

            results.append({
                "faculty_id": faculty["faculty_id"],
                "project_id": project["project_id"],
                "project_title": project["title"],
                "project_description": project.get("description", ""),
                "project_status": project.get("status", "open"),
                "name": faculty.get("name", ""),
                "email": faculty.get("email", ""),
                "research_areas": faculty.get("research_areas", ""),
                "publications": faculty.get("publications", ""),
                "final_score": round(final_score, 4),
                "research_similarity": round(research_score, 4),
                "urgency": faculty.get("urgency", "low"),
                "match_mode": mode,
                "explanation": explanation,
                "match_id": match_id
            })

    return sorted(results, key=lambda x: x["final_score"], reverse=True)

# ---------- STUDENT MANAGEMENT ----------
@app.post("/student/upsert")
def add_or_update_student(student: StudentUpsert):
    upsert_student(student.dict())
    return {"status": "student added/updated"}


@app.get("/student/{id}")
def get_student_profile(id: str):
    from backend.app.student_service import get_student
    student = get_student(id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.get("/faculty/profile/{faculty_id}")
def get_faculty_profile(faculty_id: str):
    from backend.app.faculty_service import get_faculty
    faculty = get_faculty(faculty_id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty


@app.post("/faculty/update")
def update_faculty_profile(data: dict):
    upsert_faculty(data)
    return {"status": "updated"}


# ---------- FACULTY SEARCH ----------
@app.get("/search/faculty")
def faculty_search(q: str):
    return search_faculty(faculty_records, q)


@app.get("/search/student")
def student_search(q: str):
    from backend.app.student_service import search_students
    return search_students(q)


# ---------- UTILITIES ----------
@app.post("/student/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    content = await file.read()
    data = parse_resume_with_ai(content)
    return data

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await chat_manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Simple broadcast for now, or echo
            # In a real app, parse `data` to find recipient
            await chat_manager.broadcast(f"User {user_id}: {data}")
    except WebSocketDisconnect:
        chat_manager.disconnect(user_id)
        await chat_manager.broadcast(f"User {user_id} left the chat")

# ---------- ANALYTICS ----------
@app.get("/analytics")
def get_analytics():
    try:
        # Load data with error handling for bad lines
        try:
            df_students = pd.read_csv("backend/data/student_dataset.csv", on_bad_lines='skip')
        except Exception as e:
             print(f"Error loading student CSV: {e}")
             df_students = pd.DataFrame(columns=["research_interest", "skills"])

        try:
            df_faculty = pd.read_csv("backend/data/faculty_dataset.csv", on_bad_lines='skip')
        except Exception as e:
             print(f"Error loading faculty CSV: {e}")
             df_faculty = pd.DataFrame(columns=["projects"])

        # 1. Top Research Interests
        all_interests = []
        # Handle potential nulls or different formats
        if "research_interest" in df_students.columns:
            for items in df_students["research_interest"].dropna():
                # primitive split by comma if string
                parts = [x.strip() for x in str(items).split(",")] 
                all_interests.extend(parts)
        
        top_interests = pd.Series(all_interests).value_counts().head(5).to_dict()

        # 2. Top Skills
        all_skills = []
        if "skills" in df_students.columns:
            for items in df_students["skills"].dropna():
                try:
                    # it might be stored as json string or just string
                    skills_list = json.loads(items) if str(items).strip().startswith("[") else str(items).split(",")
                    all_skills.extend([s.strip() for s in skills_list])
                except:
                    pass
        
        top_skills = pd.Series(all_skills).value_counts().head(5).to_dict()

        # 3. Demand vs Supply
        total_students = len(df_students)
        
        total_capacity = 0
        if "projects" in df_faculty.columns:
            for projects_json in df_faculty["projects"].dropna():
                try:
                    projects = json.loads(projects_json)
                    for p in projects:
                        total_capacity += int(p.get("max_students", 0))
                except:
                    pass

        return {
            "top_interests": [{"name": k, "count": v} for k, v in top_interests.items()],
            "top_skills": [{"name": k, "count": v} for k, v in top_skills.items()],
            "demand_supply": {
                "students": total_students,
                "capacity": total_capacity
            }
        }
    except Exception as e:
        print(f"Analytics Error: {e}")
        return {
            "top_interests": [],
            "top_skills": [],
            "demand_supply": {"students": 0, "capacity": 0}
        }

# ---------- MENTORSHIP WORKFLOW ----------
from backend.app.schemas import MentorshipRequest, MentorshipStatusUpdate
from backend.app.mentorship_service import create_request, get_requests_for_student, get_requests_for_faculty, update_request_status

@app.post("/mentorship/request")
def send_mentorship_request(req: MentorshipRequest):
    return create_request(req.dict())

@app.get("/mentorship/student/{id}")
def get_student_requests(id: str):
    return get_requests_for_student(id)

@app.get("/mentorship/faculty/{id}")
def get_faculty_requests(id: str):
    return get_requests_for_faculty(id)

@app.patch("/mentorship/status")
def update_status(update: MentorshipStatusUpdate):
    success = update_request_status(update.request_id, update.status, update.note)
    if not success:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"status": "updated"}

from backend.app.scheduler import router as scheduler_router
app.include_router(scheduler_router, prefix="/schedule", tags=["Scheduling"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Trigger Reload

# Trigger Reload

# Trigger Reload via student_service fix

# Trigger API Update

# Trigger API Update for mentorship fix

# Trigger API Update for projects parsing

# Trigger API Update for rejection notes

# Trigger API Update for syntax fix

# Trigger API Update for mentorship fix 2

# Trigger API Update for mentorship fix 3
