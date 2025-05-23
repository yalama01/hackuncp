from backend.external_logic.helper import filter_dict
from backend.internal_logic.check_description import check_description, description_good
from backend.internal_logic.relevance_score import get_relevance_score, make_score
from backend.internal_logic.find_people import find_people
from backend.internal_logic.job_title import get_job_title_list
from backend.internal_logic.bio_summary import make_bio
from backend.internal_logic.email_draft import make_email
from backend.internal_logic.models import ProjectSubmission
from fastapi import APIRouter
from fastapi.responses import HTMLResponse


# Initialize FastAPI
router = APIRouter()

@router.post("/project/proposal")
async def submit_event_location(event: ProjectSubmission):
    print(event.project_overview)
    print(event.location)
    print("hello??")
    project_overview_feedback = description_good(event.project_overview)

    if project_overview_feedback:
        print(project_overview_feedback)
        return {"feedback":project_overview_feedback}

    job_titles = get_job_title_list(event.project_overview)
    people = find_people(job_titles, location= event.location)
    summarize_bios = [make_bio(person , event.project_overview ) for person in people]
    relevancy_scores = [make_score(person, event.project_overview) for person in people]
    email = [make_email(person, event.project_overview) for person in people]

    sanitized_people = [filter_dict(person.__dict__, ["name","score","email_draft","bio","location","linkedin_url","emails"]) for person in people]

    return {
        "people_list": sanitized_people
    }



@router.get("/", response_class=HTMLResponse)
async def serve_hello_page():
    return """ 
    <html>
        <head>
            <title>Hello Page</title>
        </head>
        <body>
            <h1>Hello!</h1>
        </body>
    </html>
    """
