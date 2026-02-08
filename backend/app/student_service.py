import pandas as pd
import json
from datetime import datetime

STUDENT_DATA_PATH = "backend/data/student_dataset.csv"


def load_df():
    return pd.read_csv(STUDENT_DATA_PATH)


def save_df(df):
    df.to_csv(STUDENT_DATA_PATH, index=False)


def upsert_student(data: dict):
    df = load_df()

    data["skills"] = json.dumps(data["skills"])
    data["methodologies"] = ",".join(data["methodologies"])
    data["last_updated"] = datetime.utcnow().isoformat()

    if data["student_id"] in df["student_id"].values:
        df.loc[df["student_id"] == data["student_id"], :] = data
    else:
        df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)

    save_df(df)


def list_students():
    return load_df().to_dict(orient="records")


def get_student(student_id: str):
    df = load_df()
    student = df[df["student_id"] == student_id]
    if student.empty:
        return None
    
    res = student.iloc[0].replace({float('nan'): None}).to_dict()
    # Decode JSON skills if needed
    try:
        if isinstance(res["skills"], str) and res["skills"].startswith("["):
            res["skills"] = json.loads(res["skills"])
        elif isinstance(res["skills"], str):
             res["skills"] = [s.strip() for s in res["skills"].split(",") if s.strip()]
    except:
        res["skills"] = []
    
    return res


def search_students(query: str):
    df = load_df()
    q = query.lower()
    results = []

    for _, row in df.iterrows():
        student = row.to_dict()
        
        # Decode skills for search
        skills_raw = student.get("skills", "[]")
        try:
            skills = json.loads(skills_raw) if skills_raw.startswith("[") else [s.strip() for s in skills_raw.split(",") if s.strip()]
        except:
            skills = []
            
        student_text = (
            str(student.get("student_id", "")) + " " +
            str(student.get("academic_level", "")) + " " +
            str(student.get("interests", "")) + " " +
            " ".join(skills)
        ).lower()

        if q in student_text:
            student["skills"] = skills  # Use decoded skills
            results.append(student)

    return results
