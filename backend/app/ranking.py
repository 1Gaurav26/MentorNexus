
WEIGHTS = {
    "research_focused": {
        "research": 0.6,
        "skill": 0.2,
        "compatibility": 0.1,
        "availability": 0.1
    },
    "balanced": {
        "research": 0.4,
        "skill": 0.3,
        "compatibility": 0.2,
        "availability": 0.1
    },
    "skill_focused": {
        "research": 0.2,
        "skill": 0.5,
        "compatibility": 0.2,
        "availability": 0.1
    }
}

def decide_mode(research_score: float) -> str:
    if research_score > 0.7:
        return "research_focused"
    elif research_score < 0.3:
        return "skill_focused"
    return "balanced"

def skill_overlap_score(student_skills: dict, required_skills: object) -> float:
    # simple overlap logic
    if not required_skills:
        return 1.0
    
    match_count = 0
    total_weight = 0

    if isinstance(required_skills, list):
        # List format: ["python", "nlp"] -> treat all weights as 1
        for skill in required_skills:
            if isinstance(skill, str):
                total_weight += 1
                if skill.lower() in student_skills:
                    match_count += 1
        return match_count / total_weight if total_weight > 0 else 0.0
    
    if isinstance(required_skills, dict):
        # Dict format: {"python": 3, "nlp": 2}
        for skill, level in required_skills.items():
            total_weight += level
            if skill.lower() in student_skills:
                # check if student level is enough (simple logic: existing is good)
                match_count += level 
        return match_count / total_weight if total_weight > 0 else 0.0

    return 0.0

def compatibility_score(student: dict, faculty: dict) -> float:
    # 1. Academic Level Match (50%)
    level_score = 0.0
    if student.get("academic_level") == faculty.get("academic_level"):
        level_score = 1.0
    
    # 2. Methodology Overlap (50%)
    method_score = 0.0
    student_methods = set(student.get("methodologies", []))
    faculty_methods = set(faculty.get("methodologies", []))
    
    if faculty_methods:
        # Avoid division by zero
        overlap = len(student_methods.intersection(faculty_methods))
        # We cap it at 1.0 just in case, though overlap <= len(faculty_methods)
        method_score = overlap / len(faculty_methods)
        
    return (level_score * 0.5) + (method_score * 0.5)

def urgency_weight(urgency: str) -> float:
    urgency = urgency.lower()
    if urgency == "high":
        return 1.2
    elif urgency == "medium":
        return 1.0
    return 0.9

def availability_score(availability: int) -> float:
    # Normalize 0-40 hours to 0-1
    return min(1.0, availability / 40.0)


def compute_final_score(student, faculty, project, research_score):
    """
    Computes final score for a SINGLE (faculty, project) pair
    """

    mode = decide_mode(research_score)
    w = WEIGHTS[mode]

    # ✅ skill presence overlap (student ↔ project)
    # Fallback to faculty skills if project doesn't specify any
    req_skills = project.get("required_skills") or faculty.get("required_skills", [])
    
    skill_score = skill_overlap_score(
        student["skills"],
        req_skills
    )

    # faculty-level compatibility
    compat_score = compatibility_score(student, faculty)

    # urgency as multiplier
    urgency_factor = urgency_weight(faculty["urgency"])

    avail_score = availability_score(student["availability"])

    base_score = (
        w["research"] * research_score +
        w["skill"] * skill_score +
        w["compatibility"] * compat_score +
        w["availability"] * avail_score
    )

    final_score = base_score * urgency_factor

    explanation = [
        f"Matching mode: {mode.replace('_', ' ')}",
        f"Research similarity: {round(research_score, 3)}",
        f"Project skill overlap: {round(skill_score, 3)}",
        f"Faculty compatibility: {round(compat_score, 3)}",
        f"Faculty urgency: {faculty['urgency']}"
    ]

    return round(final_score, 4), mode, explanation
