import pandas as pd
import json
from datetime import datetime

import uuid

def generate_project_id():
    return f"P-{uuid.uuid4().hex[:8]}"


FACULTY_DATA_PATH = "backend/data/faculty_dataset.csv"


def load_df():
    return pd.read_csv(FACULTY_DATA_PATH)


def save_df(df):
    df.to_csv(FACULTY_DATA_PATH, index=False)


def upsert_faculty(data: dict):
    df = load_df()

    if "required_skills" in data:
        data["required_skills"] = json.dumps(data["required_skills"])
    if "methodologies" in data:
        data["methodologies"] = ",".join(data["methodologies"])
    data["last_updated"] = datetime.utcnow().isoformat()

    if "projects" not in df.columns:
        df["projects"] = "[]"

    if data["faculty_id"] in df["faculty_id"].values:
        idx = df.index[df["faculty_id"] == data["faculty_id"]][0]

        existing_projects = df.at[idx, "projects"]

        df.loc[idx, data.keys()] = data.values()
        df.at[idx, "projects"] = existing_projects
    else:
        data["projects"] = "[]"
        df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)

    save_df(df)

def add_project_to_faculty(faculty_id: str, project_data: dict):
    df = load_df()

    if "projects" not in df.columns:
        df["projects"] = "[]"

    idx_list = df.index[df["faculty_id"] == faculty_id].tolist()
    if not idx_list:
        raise ValueError("Faculty not found")

    idx = idx_list[0]
    projects = json.loads(df.at[idx, "projects"])

    new_project = {
        "project_id": generate_project_id(),
        "title": project_data["title"],
        "description": project_data["description"],
        "required_skills": project_data["required_skills"],
        "methodologies": project_data["methodologies"],
        "max_students": project_data["max_students"],
        "current_students": 0,
        "status": "open",
        "is_visible": True,
        "last_updated": datetime.utcnow().isoformat()
    }

    projects.append(new_project)

    df.at[idx, "projects"] = json.dumps(projects)
    df.at[idx, "last_updated"] = datetime.utcnow().isoformat()

    save_df(df)
    return new_project


def list_faculty():
    df = load_df()
    return df.where(pd.notnull(df), None).to_dict(orient="records")


def get_faculty(faculty_id: str):
    df = load_df()
    faculty = df[df["faculty_id"] == faculty_id]
    if faculty.empty:
        return None
    
    # Robust NaN handling
    faculty = faculty.where(pd.notnull(faculty), None)
    res = faculty.iloc[0].to_dict()
    
    # helper to clean list/json fields
    def clean_list(val):
        if not val: return []
        if isinstance(val, str) and val.startswith("["):
            try: return json.loads(val)
            except: pass
        if isinstance(val, str):
            return [x.strip() for x in val.split(',') if x.strip()]
        return val

    # Clean known list fields
    res["required_skills"] = clean_list(res.get("required_skills"))
    res["projects"] = clean_list(res.get("projects"))
    
    return res
