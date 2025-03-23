#starts the backend engine
from fastapi import APIRouter

from backend.internal_logic.find_people import rate_relevancy, find_people
from backend.internal_logic.job_title import get_job_title_list
from backend.internal_logic.models import EventLocationRequest

router = APIRouter()

@router.post("/event/")
async def submit_event_location(event: EventLocationRequest):
    job_titles = get_job_title_list(event.event_summary)
    people = find_people(job_titles)
    relevancy_scores = [rate_relevancy(person) for person in people]
    summarize_bios = [make_bio(person) for person in people]




    return {
        "message": "Event location received",
        "event_name": event.event_name,
        "location": event.location
    }
