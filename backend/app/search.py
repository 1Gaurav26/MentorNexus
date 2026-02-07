from backend.app.explanation_service import polish_explanation


def search_faculty(faculty_records, query: str):
    q = query.lower()
    results = []

    for f in faculty_records:
        if not f.get("is_visible", True):
            continue

        faculty_text = (
            f.get("name", "") + " " + f.get("research_areas", "") + " " + f.get("publications", "")
        ).lower()

        matched_projects = []

        for project in f.get("projects", []):
            project_text = (
                project.get("title", "") + " " + project.get("description", "")
            ).lower()

            if q in project_text:
                # Safe access to fields
                p_title = project.get("title", "Untitled Project")
                p_status = project.get("status", "unknown")
                curr_students = project.get("current_students", 0)
                max_students = project.get("max_students", 0)

                # raw, deterministic explanation
                raw_explanation = [
                    f"Project title matches the search query '{query}'.",
                    f"Project status is '{p_status}'.",
                    f"Current team size is {curr_students} "
                    f"out of {max_students} students."
                ]

                # Gemini-polished explanation (safe fallback)
                explanation = polish_explanation(
                    raw_explanation,
                    {
                        "project_title": p_title,
                        "student_skills": [],   # search has no student context
                        "faculty_id": f["faculty_id"]
                    }
                )

                matched_projects.append({
                    "project_id": project.get("project_id"),
                    "title": p_title,
                    "status": p_status,
                    "current_students": curr_students,
                    "max_students": max_students,
                    "explanation": explanation
                })

        # include faculty if query matches faculty OR any project
        if q in faculty_text or matched_projects:
            results.append({
                "faculty_id": f["faculty_id"],
                "name": f.get("name", ""),
                "email": f.get("email", ""),
                "research_areas": f.get("research_areas", ""),
                "publications": f.get("publications", ""),
                "urgency": f.get("urgency", "low"),
                "projects": matched_projects  # may be empty
            })

    return results
