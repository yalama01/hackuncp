from pydantic import BaseModel

class EventLocationRequest(BaseModel):
    event_summary: str
    location: str

