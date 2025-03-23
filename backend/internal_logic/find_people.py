from typing import List, Dict
import json
from dataclasses import asdict
from datetime import datetime
from models import Person
from peopledatalabs import PDLPY

CLIENT = PDLPY(api_key="ab5cf8243aa27d915bc40233997b1b5f852ec67d376699cfdc525f4b6bd510c3")

#Helper func
def build_sql_query(job_titles: List[str], location: str) -> str:
    title_conditions = " OR ".join([f"job_title='{title}'" for title in job_titles])
    query = f"""
    SELECT * FROM person
    WHERE location_name='{location}'
    AND ({title_conditions});
    """
    return query

#Helper func
def days_since(date_str: str) -> int:
    if not date_str:
        return None
    try:
        end_date = datetime.strptime(date_str, "%Y-%m-%d")
        return (datetime.now() - end_date).days
    except Exception:
        return None

def find_people(job_titles: List[str], location: str):
    sql_query = build_sql_query(job_titles, location)

    params = {
        'sql': sql_query,
        'size': 1,  #Change to increase number of results
        'pretty': True
    }

    response = CLIENT.person.search(**params).json()
    information = []
    persons = []

    if response.get("status") == 200 and "data" in response:
        for person in response["data"]:
            experience = person.get("experience", [])
            current_job = next((job for job in experience if job.get("is_primary")), None)

            relevant_past_jobs = []
            for job in experience:
                if job.get("is_primary", False):
                    continue
                days = days_since(job.get("end_date"))
                if days is not None and days <= 3650:
                    title = job.get("title", {}).get("name", "")
                    relevant_past_jobs.append((title, days))

            info = {
                "name": person.get("full_name", ""),
                "location": person.get("location_name", ""),
                "current_job_title": current_job.get("title", {}).get("name", "") if current_job else "",
                "company_name": current_job.get("company", {}).get("name", "") if current_job else "",
                "industry": current_job.get("company", {}).get("industry", "") if current_job else "",
                "skills": person.get("skills", []),
                "interests": person.get("interests", []),
                "summary": person.get("summary", ""),
                "emails": person.get("personal_emails", []),
                "phone_numbers": person.get("phone_numbers", []),
                "linkedin": f"https://linkedin.com/in/{person.get('linkedin_username', '')}",
                "past_job_title": relevant_past_jobs
            }

            persons.append(Person(**info))                


        #Optional: Save full raw data to file
        with open("raw_filtered.json", "w") as out:
            json.dump([asdict(p) for p in persons], out, indent=2)

    
        print(f"Successfully grabbed {len(response['data'])} records from PDL.")
        print(f"{response.get('total', 0)} total PDL records exist matching this query.")
    else:
        print("Error:", response)

    return persons


def rate_relevancy(job_title,personal_information, summary)-> int:
    return 0 #return a number 0 through a 100


job_titles = [
    "Chief Sustainability Officer (CSO)",
    "City Sustainability Officer",
    "Director of Environmental Programs",
    "Environmental Policy Advisor",
    "Environmental Planner",
    "Urban Planner",
    "Climate and Sustainability Program Manager",
    "Community Development Specialist",
    "Environmental Compliance Officer",
    "Sustainability Coordinator",
    "Clean Energy Program Manager",
    "Climate Resilience Officer",
    "Transportation Sustainability Planner",
    "Public Works Director",
    "Natural Resources Manager",
    "Water Resources Planner",
    "Waste and Recycling Program Manager",
    "Air Quality Program Manager",
    "Environmental Health Specialist",
    "Sustainability and Resilience Officer",
    "Local Government Affairs Manager",
    "Regional Sustainability Coordinator",
    "Director of Climate Initiatives",
    "Green Building Program Administrator",
    "Sustainability and Energy Efficiency Officer"
]

location = "charlotte, north carolina, united states"

find_people(job_titles, location)