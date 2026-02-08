import pandas as pd
import uuid
from datetime import datetime
import os

MENTORSHIP_DATA_PATH = "backend/data/mentorship_requests.csv"

def load_df():
    if not os.path.exists(MENTORSHIP_DATA_PATH):
        df = pd.DataFrame(columns=["request_id", "student_id", "student_name", "faculty_id", "faculty_name", "message", "status", "created_at"])
        df.to_csv(MENTORSHIP_DATA_PATH, index=False)
        return df
    return pd.read_csv(MENTORSHIP_DATA_PATH)

def save_df(df):
    df.to_csv(MENTORSHIP_DATA_PATH, index=False)

def create_request(data: dict):
    df = load_df()
    data["request_id"] = str(uuid.uuid4())
    data["created_at"] = datetime.utcnow().isoformat()
    data["status"] = "pending"
    
    new_req = pd.DataFrame([data])
    df = pd.concat([df, new_req], ignore_index=True)
    save_df(df)
    return data

def get_requests_for_student(student_id: str):
    df = load_df()
    subset = df[df["student_id"] == student_id].copy()
    subset = subset.replace({float('nan'): None})
    return subset.to_dict(orient="records")

def get_requests_for_faculty(faculty_id: str):
    df = load_df()
    subset = df[df["faculty_id"] == faculty_id].copy()
    subset = subset.replace({float('nan'): None})
    return subset.to_dict(orient="records")

def update_request_status(request_id: str, status: str, note: str = None):
    df = load_df()
    if "note" not in df.columns:
        df["note"] = ""
        
    if request_id in df["request_id"].values:
        idx = df.index[df["request_id"] == request_id][0]
        df.at[idx, "status"] = status
        if note:
             df.at[idx, "note"] = note
        save_df(df)
        return True
    return False
