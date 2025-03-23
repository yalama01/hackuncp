#starts the backend engine
from fastapi import APIRouter

from backend.internal_logic.models import EventLocationRequest

router = APIRouter()

@router.post("/event/")
async def submit_event_location(event: EventLocationRequest):
    job_titles = get_job_title_list(event.event_summary)

    return {
        "message": "Event location received",
        "event_name": event.event_name,
        "location": event.location
    }
