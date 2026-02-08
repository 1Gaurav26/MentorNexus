import os

# 1. Fix faculty_dataset.csv (Remove duplicates of VIT141)
faculty_path = r'e:/Mentornexus-main/backend/data/faculty_dataset.csv'
if os.path.exists(faculty_path):
    with open(faculty_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    unique_lines = []
    seen_ids = set()
    for line in lines:
        parts = line.split(',')
        if not parts: continue
        fid = parts[0].strip()
        if fid in seen_ids and fid == 'VIT141':
            continue # Skip duplicate VIT141
        if fid == 'VIT141':
            seen_ids.add(fid)
        unique_lines.append(line)
    
    with open(faculty_path, 'w', encoding='utf-8') as f:
        f.writelines(unique_lines)
    print(f"Cleaned faculty_dataset.csv. Total lines: {len(unique_lines)}")

# 2. Add s-demo to student_dataset.csv if missing
student_path = r'e:/Mentornexus-main/backend/data/student_dataset.csv'
if os.path.exists(student_path):
    with open(student_path, 'r', encoding='utf-8') as f:
        s_lines = f.readlines()
    
    has_demo = any('s-demo' in line for line in s_lines)
    if not has_demo:
        with open(student_path, 'a', encoding='utf-8') as f:
            f.write('\ns-demo,"[\'Python\', \'Java\', \'React\']",,Undergraduate,10,"Artificial Intelligence, Web Development",2026-02-08T12:00:00')
        print("Added s-demo to student_dataset.csv")
    else:
        print("s-demo already exists in student_dataset.csv")
