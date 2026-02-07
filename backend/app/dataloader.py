import pandas as pd
import json
import ast


def load_faculty_dataset(path: str):
    df = pd.read_csv(path)

    faculty_records = []
    faculty_texts = []

    for _, row in df.iterrows():
        # Robust parsing for skills
        try:
            skills = json.loads(row["required_skills"])
        except (json.JSONDecodeError, TypeError):
            try:
                skills = ast.literal_eval(row["required_skills"])
            except Exception:
                skills = []

        # Robust parsing for projects
        projects = []
        if "projects" in row and pd.notna(row["projects"]):
            try:
                projects = json.loads(row["projects"])
            except (json.JSONDecodeError, TypeError):
                try:
                    projects = ast.literal_eval(row["projects"])
                except Exception:
                    projects = []

        record = {
            "faculty_id": row["faculty_id"],
            "name": row["name"],
            "email": row["email"],
            "research_areas": row["research_areas"],
            "required_skills": skills,
            "methodologies": row["methodologies"].split(","),
            "publications": row["publications"],
            "urgency": row["urgency"],
            "max_students": row["max_students"],
            "current_students": row["current_students"],
            "academic_level": row["academic_level"],
            "availability": row["availability"],
            "projects": projects
        }

        faculty_records.append(record)

        combined_text = (
            row["research_areas"] + " " + row["publications"]
        )
        faculty_texts.append(combined_text)

    return faculty_records, faculty_texts
